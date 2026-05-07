import { createClient } from '@supabase/supabase-js';

// Supabase project credentials.
//
// The anon (publishable) key is *designed* to be public — it identifies
// the project but grants no privileges beyond what row-level security
// + view grants explicitly allow. The marketing site only ever reads
// from `public_reviews` (a curated view of approved feedback_wall
// entries), so even if this key is scraped from the bundle, an
// attacker can read public reviews and nothing else.
//
// Future: if you'd rather not bake these into the client bundle,
// move them to Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
// and configure them in the Vercel project settings.
const SUPABASE_URL = 'https://lollolmpbrlmxjkokjkp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bneD2hPf9w9NhQFIkwNdaQ_lPexoml-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Marketing site is read-only and never authenticates a user.
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Wire shape of one row out of the `public_reviews` view.
export interface PublicReview {
  id: string;
  body: string;
  star_rating: number | null;
  display_name: string | null;
  sentiment: string | null;
  image_urls: string[] | null;
  upvote_count: number;
  created_at: string;
}

// ──────────────────────────────────────────────────────────────────
// Per-browser device id used by the upvote system. Stored in
// localStorage so a visitor's vote sticks across reloads. The DB
// has a UNIQUE (review_id, device_id) constraint that caps a single
// device to one upvote per review — clearing localStorage lets the
// same human vote again, but that's an acceptable abuse ceiling
// for an MVP marketing surface.
// ──────────────────────────────────────────────────────────────────

const DEVICE_ID_KEY = 'ryzn.reviews.deviceId';

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

const VOTED_REVIEWS_KEY = 'ryzn.reviews.votedIds';

/** Returns the set of review ids this device has already upvoted. */
export function getVotedReviewIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(VOTED_REVIEWS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

/** Marks a review id as voted for in localStorage. */
export function markReviewVoted(reviewId: string) {
  if (typeof window === 'undefined') return;
  const set = getVotedReviewIds();
  set.add(reviewId);
  window.localStorage.setItem(VOTED_REVIEWS_KEY, JSON.stringify([...set]));
}
