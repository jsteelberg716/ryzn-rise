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
  created_at: string;
}
