import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

/**
 * /api/stats  — password-protected stats reader
 *
 * GET /api/stats?key=YOUR_KEY
 * Env: ANALYTICS_PASSWORD (defaults to "ryzn" if unset — CHANGE IN PROD)
 */

const redis = Redis.fromEnv();

function lastNDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    out.push(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`,
    );
  }
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const key = (req.query.key as string) || '';
  const expected = process.env.ANALYTICS_PASSWORD || 'ryzn';
  if (key !== expected) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const days = lastNDays(30);

    const p = redis.pipeline();
    p.get<number>('pv:total');
    p.scard('visitors:all');
    p.hgetall<Record<string, number>>('pv:paths');
    p.hgetall<Record<string, number>>('pv:refs');
    p.hgetall<Record<string, number>>('pv:sources');
    p.hgetall<Record<string, number>>('pv:countries');
    p.hgetall<Record<string, number>>('pv:devices');
    p.lrange('recent', 0, 49);
    for (const d of days) p.get<number>(`pv:day:${d}`);
    for (const d of days) p.scard(`visitors:day:${d}`);

    const results = (await p.exec()) as unknown[];

    let i = 0;
    const totalPv = (results[i++] as number) || 0;
    const uniqueVisitors = (results[i++] as number) || 0;
    const paths = (results[i++] as Record<string, number>) || {};
    const refs = (results[i++] as Record<string, number>) || {};
    const sources = (results[i++] as Record<string, number>) || {};
    const countries = (results[i++] as Record<string, number>) || {};
    const devices = (results[i++] as Record<string, number>) || {};
    const recentRaw = (results[i++] as string[]) || [];

    const daily: { day: string; pv: number; visitors: number }[] = [];
    const pvByDay = results.slice(i, i + days.length) as (number | null)[];
    i += days.length;
    const visByDay = results.slice(i, i + days.length) as (number | null)[];

    for (let k = 0; k < days.length; k++) {
      daily.push({
        day: days[k].slice(5), // MM-DD
        pv: pvByDay[k] || 0,
        visitors: visByDay[k] || 0,
      });
    }

    const recent = recentRaw
      .map((r) => {
        try {
          return typeof r === 'string' ? JSON.parse(r) : r;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const toSorted = (obj: Record<string, number>) =>
      Object.entries(obj || {})
        .map(([name, value]) => ({ name, value: Number(value) || 0 }))
        .sort((a, b) => b.value - a.value);

    return res.status(200).json({
      totalPv,
      uniqueVisitors,
      paths: toSorted(paths),
      refs: toSorted(refs),
      sources: toSorted(sources),
      countries: toSorted(countries),
      devices: toSorted(devices),
      daily,
      recent,
      generatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[stats] error', e);
    return res.status(500).json({ error: 'stats failed' });
  }
}
