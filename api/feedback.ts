// ─────────────────────────────────────────────────────────────────────
// /api/feedback — Edge-runtime serverless function
// ─────────────────────────────────────────────────────────────────────
// Receives the v2 feedback questionnaire, validates the conditional
// fields (frequency vs. friction depending on Q1), then inserts the
// row into Supabase via the REST API. Anon key + RLS INSERT-only
// policy protects the table — the key is the same one the public
// marketing site already ships in its bundle.
//
// Supabase JS SDK isn't used here so the function stays small and
// Edge-runtime-clean (the SDK works in Edge but pulls more deps than
// we need for a one-shot INSERT).
// ─────────────────────────────────────────────────────────────────────

export const config = {
  runtime: 'edge',
};

const SUPABASE_URL = 'https://lollolmpbrlmxjkokjkp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bneD2hPf9w9NhQFIkwNdaQ_lPexoml-';

// Whitelist accepted values per field. Anything else is rejected so a
// rogue client can't pollute the table with garbage. Keep in sync with
// the radio options in src/pages/Feedback.tsx.
const ALLOWED: Record<string, string[]> = {
  using_app:        ['yes_regularly', 'yes_sometimes', 'tried_once', 'not_yet'],
  frequency:        ['daily', 'few_week', 'once_week', 'rarely'],
  food_logging:     ['yes_consistently', 'yes_sometimes', 'tried_stopped', 'never'],
  lift_tracking:    ['yes_every', 'sometimes', 'tried_once', 'never'],
  favorite_feature: ['calorie_engine', 'workout_tracking', 'food_logging', 'apple_watch', 'nfc', 'design', 'nothing_yet'],
  would_recommend:  ['definitely', 'probably', 'maybe', 'not_yet', 'no'],
  friction:         ['forget', 'confusing', 'too_much_input', 'missing_features', 'bugs', 'other_app', 'not_my_priority'],
};

interface Payload {
  using_app?: string;
  frequency?: string;
  food_logging?: string;
  lift_tracking?: string;
  favorite_feature?: string;
  would_recommend?: string;
  friction?: string;
  open_feedback?: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'POST only' }, 405);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Bad JSON' }, 400);
  }

  // ── Required fields ─────────────────────────────────────────────
  const required: (keyof Payload)[] = [
    'using_app', 'food_logging', 'lift_tracking', 'favorite_feature', 'would_recommend',
  ];
  for (const key of required) {
    const value = body[key];
    if (typeof value !== 'string' || !value) {
      return json({ error: `Missing field: ${key}` }, 400);
    }
    if (!ALLOWED[key].includes(value)) {
      return json({ error: `Invalid value for ${key}` }, 400);
    }
  }

  // ── Conditional fields ──────────────────────────────────────────
  // Must mirror Feedback.tsx's submit-time validation: users who say
  // they use the app must answer frequency; users who don't must
  // answer friction. Both branches are mutually exclusive.
  const usesApp = body.using_app === 'yes_regularly' || body.using_app === 'yes_sometimes';
  if (usesApp) {
    if (typeof body.frequency !== 'string' || !ALLOWED.frequency.includes(body.frequency)) {
      return json({ error: 'Missing or invalid: frequency' }, 400);
    }
  } else {
    if (typeof body.friction !== 'string' || !ALLOWED.friction.includes(body.friction)) {
      return json({ error: 'Missing or invalid: friction' }, 400);
    }
  }

  // ── Sanity caps + user agent capture ────────────────────────────
  const open = (body.open_feedback ?? '').toString().slice(0, 5000).trim();
  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  const row = {
    using_app:        body.using_app,
    frequency:        usesApp ? body.frequency : null,
    food_logging:     body.food_logging,
    lift_tracking:    body.lift_tracking,
    favorite_feature: body.favorite_feature,
    would_recommend:  body.would_recommend,
    friction:         usesApp ? null : body.friction,
    open_feedback:    open || null,
    user_agent:       userAgent,
  };

  // ── Supabase REST insert. RLS policy "anon insert only" gates this. ─
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/feedback_responses`, {
    method: 'POST',
    headers: {
      'apikey':        SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    console.error('[feedback] Supabase insert failed:', resp.status, errText);
    return json({ error: 'Save failed. Please try again.' }, 500);
  }

  return json({ ok: true });
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
