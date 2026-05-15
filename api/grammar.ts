// ─────────────────────────────────────────────────────────────────────
// /api/grammar — Edge-runtime serverless function
// ─────────────────────────────────────────────────────────────────────
// Cleans up voice-transcribed feedback via Anthropic's Messages API.
// The browser hands us a raw transcript (mic + Web Speech API), we
// punctuate / capitalize / strip filler words and hand it back. The
// system prompt explicitly forbids rephrasing — we keep the user's
// exact word choice and meaning.
//
// Required Vercel env var:
//   ANTHROPIC_API_KEY = sk-ant-...
//
// Cost model: claude-haiku-4-5-20251001 is roughly $0.0005 per typical
// 1500-char transcript correction — basically free at marketing-site
// traffic levels.
// ─────────────────────────────────────────────────────────────────────

export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `You are a grammar and punctuation cleanup assistant for voice-transcribed feedback. Your ONLY job is to:
- Add proper punctuation (periods, commas, question marks)
- Fix capitalization
- Fix obvious grammar errors
- Remove filler words like "um", "uh", "like" (only when clearly filler)
- Preserve the user's exact meaning, voice, and word choice

DO NOT:
- Rephrase or rewrite for style
- Add or remove content
- Make it more formal or more casual
- Add disclaimers or commentary

Return ONLY the cleaned text. No preamble, no quotes, no explanation.`;

const MODEL = 'claude-haiku-4-5-20251001';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fail soft: the client will keep the raw transcript and show a
    // small "saved as-is" status. Don't block the form.
    return json({ error: 'Grammar service not configured.' }, 503);
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Bad JSON' }, 400);
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) return json({ error: 'No text provided' }, 400);
  if (text.length > 5000) {
    return json({ error: 'Transcript too long for cleanup.' }, 400);
  }

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:     MODEL,
      max_tokens: 1000,
      system:    SYSTEM_PROMPT,
      messages:  [{ role: 'user', content: text }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    console.error('[grammar] Anthropic error:', resp.status, errText);
    return json({ error: 'Cleanup failed. Keep your transcript as-is.' }, 500);
  }

  const data: any = await resp.json();
  const cleaned = ((data?.content as Array<{ type: string; text: string }>) ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  if (!cleaned) {
    return json({ error: 'Empty response from grammar model.' }, 500);
  }

  return json({ text: cleaned });
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type':  'application/json',
      'cache-control': 'no-store',
    },
  });
}
