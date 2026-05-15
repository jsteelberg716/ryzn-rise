// ─────────────────────────────────────────────────────────────────────
// /api/chat — Edge-runtime serverless function
// ─────────────────────────────────────────────────────────────────────
// Backs the floating chatbot in the bottom-right of the marketing site.
// Auto-deploys on Vercel from this file's location (api/chat.ts).
//
// Cost model: gpt-4o-mini at $0.15 / $0.60 per 1M tokens. A typical
// chat exchange is ~1500 in / 500 out = ~$0.0005. $5/month gives you
// ~10,000 conversations — plenty of runway for marketing-site traffic.
//
// Required Vercel env var:
//   OPENAI_API_KEY = sk-...   (Settings → Environment Variables)
// ─────────────────────────────────────────────────────────────────────

export const config = {
  runtime: 'edge',
};

// ── Allowed in-app navigation targets ─────────────────────────────
//
// The model is instructed in the system prompt to suggest at most one
// of these tokens via the `navigate` field on its JSON output. The
// client maps them to either an in-page hash or a route. Anything
// outside this allowlist is dropped server-side so the model can't
// trick the user into navigating somewhere unexpected.
const NAV_ALLOWLIST = new Set([
  'features',
  'how-it-works',
  'pricing',
  'faq',
  'reviews',
  'privacy',
  'validation',
] as const);

// ── System prompt — single source of truth about RYZN ─────────────
const SYSTEM_PROMPT = `
You are the RYZN website assistant — a friendly, concise guide on
ryznrise.com (the marketing site for the RYZN iOS fitness app).
Your job is to answer visitor questions about the app and route them
to the right section of the site.

About RYZN:
- Native iOS app for serious lifters who track workouts AND meals.
- Patented (USPTO #64/021,144) physics-based calorie engine — uses
  BMR + TEF + NEAT (steps) + EAT (workout) + EPOC, NOT a heart-rate
  proxy. Validation work referenced from Stanford 2017 + npj Digital
  Medicine 2025.
- Apple Watch companion: live heart rate per set, mark sets done /
  to-failure from the wrist, rest timer countdown, 6-hour HR
  sparkline.
- AI calorie tracking: photograph a meal, RYZN identifies it and
  estimates macros in ~2 seconds. Voice-log a snack between sets.
  Routes through OpenAI / Anthropic via a server-side proxy with
  explicit user consent.
- Workout features: progression engine analyzes last 6 sessions and
  suggests weights; auto-cascades previous performance; swap
  exercises mid-workout; bodyweight warmups; muscle-volume heatmap;
  shareable summary cards (IG / iMessage / TikTok).
- Outdoor cardio: GPS routes for runs / walks / hikes / bike rides
  with distance, average speed, route map.
- Splits included: Push/Pull/Legs, Upper/Lower, Arnold, Bro, Full
  Body. Custom splits supported.
- Pricing: Pro is $10/month or $80/year (effective $6.67/mo on
  annual — saves 33%). Every new subscription starts with a 3-day
  free trial — no charge until day 4, cancel any time during the
  trial in iPhone Settings → Apple ID → Subscriptions to avoid
  being billed. Cancel anytime after that via the App Store.
- Privacy: HealthKit data never leaves the device. Other data lives
  in Supabase with row-level security per account. Never sold or
  shared with advertisers.
- Platform: iOS only. No Android planned.
- Support email: jackwork716@gmail.com.

Sections you can navigate the visitor to (use the EXACT slug as the
"navigate" value when one applies):
- "features"     — main features overview
- "how-it-works" — the calorie engine + AI flow explainer
- "pricing"      — plans, trial, billing
- "faq"          — common questions
- "reviews"      — live reviews from real users
- "privacy"      — full privacy policy
- "validation"   — research / validation page

Output rules — STRICT JSON. Never wrap in markdown, never add
commentary outside the JSON. Schema:
  {
    "text": string,            // the visible reply, max ~80 words
    "navigate": string | null  // one of the slugs above, or null
  }

Tone: warm, direct, light-touch personality. Talk like a knowledgeable
friend, not a sales bot. Lifters and macro-trackers are the primary
audience — match their energy. No emojis. No hype words like "amazing"
/ "revolutionary". If you don't know something, say so plainly and
suggest emailing support.

Length: keep replies under ~80 words. If the user asks a broad
question, give the punchy version + suggest the relevant section.
`.trim();

// ── Conversation message shape ────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ── Handler ───────────────────────────────────────────────────────
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fail open with a friendly error rather than a 500 — the chat
    // widget will display this so the user knows the app is healthy
    // but the chatbot's just not wired up yet.
    return json(
      {
        text: "I'm not wired up just yet — Jack needs to add an OpenAI key in the Vercel project settings. Try again soon, or email jackwork716@gmail.com if you've got a question right now.",
        navigate: null,
      },
      200,
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Bad JSON' }, 400);
  }

  const messages = (body.messages ?? []).slice(-10); // cap context
  if (
    messages.length === 0 ||
    !messages.every(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0 &&
        m.content.length < 2000,
    )
  ) {
    return json({ error: 'Invalid messages' }, 400);
  }

  // Forward to OpenAI
  const oaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      // Bound the spend per call. 250 tokens covers an 80-word reply
      // with headroom for the JSON wrapper.
      max_tokens: 250,
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  });

  if (!oaiResp.ok) {
    const errText = await oaiResp.text();
    console.error('[chat] OpenAI error:', oaiResp.status, errText);
    return json(
      {
        text: "Hit a snag pulling that one up. Try again in a sec.",
        navigate: null,
      },
      200,
    );
  }

  const oai: any = await oaiResp.json();
  const raw = oai?.choices?.[0]?.message?.content ?? '';

  // Parse + sanitize. Defaults guard against malformed JSON the
  // model might emit despite response_format=json_object.
  let parsed: { text?: string; navigate?: string | null } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { text: raw, navigate: null };
  }

  const text =
    typeof parsed.text === 'string' && parsed.text.trim().length > 0
      ? parsed.text.trim()
      : "Sorry, I didn't catch that. Mind rephrasing?";

  const navigate =
    typeof parsed.navigate === 'string' &&
    NAV_ALLOWLIST.has(parsed.navigate as any)
      ? parsed.navigate
      : null;

  return json({ text, navigate });
}

// ── Helpers ───────────────────────────────────────────────────────
function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
