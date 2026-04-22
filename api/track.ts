import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

/**
 * /api/track  — pageview ingestion endpoint
 *
 * Accepts POST { path, referrer, visitorId, device, screen, tz }
 * Writes counters + a recent-events list to Upstash Redis.
 *
 * Required env vars (set in Vercel dashboard):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

const redis = Redis.fromEnv();

function todayUTC(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function sanitizePath(p: unknown): string {
  if (typeof p !== 'string') return '/';
  const s = p.split('?')[0].split('#')[0].slice(0, 120);
  return s || '/';
}

function sanitizeRef(r: unknown): string {
  if (typeof r !== 'string' || !r) return '(direct)';
  try {
    return new URL(r).hostname || '(direct)';
  } catch {
    return '(direct)';
  }
}

function sanitizeString(s: unknown, max = 40): string {
  if (typeof s !== 'string') return '';
  return s.replace(/[^\w\-:./+ ]/g, '').slice(0, max);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const path = sanitizePath(body.path);
    const ref = sanitizeRef(body.referrer);
    const source = sanitizeString(body.source, 24) || '(none)';
    const visitorId = sanitizeString(body.visitorId, 36) || 'anon';
    const device = sanitizeString(body.device, 12) || 'unknown';
    const screen = sanitizeString(body.screen, 12) || 'unknown';
    const tz = sanitizeString(body.tz, 40) || 'unknown';

    // Country from Vercel geo header
    const country =
      sanitizeString((req.headers['x-vercel-ip-country'] as string) || '', 3) || 'XX';

    const day = todayUTC();
    const ts = Date.now();

    // Multi-write pipeline
    const p = redis.pipeline();
    p.incr('pv:total');
    p.incr(`pv:day:${day}`);
    p.hincrby('pv:paths', path, 1);
    p.hincrby('pv:refs', ref, 1);
    p.hincrby('pv:sources', source, 1);
    p.hincrby('pv:countries', country, 1);
    p.hincrby('pv:devices', device, 1);
    p.sadd('visitors:all', visitorId);
    p.sadd(`visitors:day:${day}`, visitorId);
    // Keep a rolling feed of the 500 most recent events
    p.lpush(
      'recent',
      JSON.stringify({ ts, path, ref, source, country, device, screen, tz, visitorId: visitorId.slice(0, 8) }),
    );
    p.ltrim('recent', 0, 499);
    // Expire daily buckets after 90 days to keep usage bounded
    p.expire(`pv:day:${day}`, 60 * 60 * 24 * 90);
    p.expire(`visitors:day:${day}`, 60 * 60 * 24 * 90);

    await p.exec();

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[track] error', e);
    return res.status(500).json({ error: 'track failed' });
  }
}
