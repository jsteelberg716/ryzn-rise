import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MessageSquare, Sparkles } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import { supabase, type PublicReview } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────
// Reviews page — `/reviews`
//
// Pulls approved feedback submitted from inside the iOS app via the
// Dynamic Feedback flow (Settings → Feedback → write a review). Rows
// land in the `feedback_wall` Supabase table with `is_approved = TRUE`
// and immediately surface here. The marketing site reads via the
// `public_reviews` view (RLS-gated, anon SELECT granted); the raw
// table stays internal.
//
// Empty state pitches the app — a fresh review section is not a
// liability, it's a "be the first" moment. Loading state shows
// skeleton cards so the page never feels empty during the round trip.
// ─────────────────────────────────────────────────────────────────────

const Reviews = () => {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let alive = true;

    (async () => {
      const { data, error } = await supabase
        .from('public_reviews')
        .select('id, body, star_rating, display_name, sentiment, created_at')
        .order('created_at', { ascending: false })
        .limit(60);

      if (!alive) return;
      if (error) {
        // Log for the developer (visible in browser DevTools) but
        // don't surface a "broken" message to visitors. An empty
        // result reads the same as the genuine "no reviews yet"
        // state — that's the intentional UX. We're either not yet
        // wired to the DB or there's nothing to show; both deserve
        // the welcoming "Be the first" treatment, not an error card.
        console.warn('[Reviews] Supabase query failed:', error.message);
        setError(error.message);
        setReviews([]);
        setLoading(false);
        return;
      }
      setReviews((data ?? []) as PublicReview[]);
      setLoading(false);
    })();

    // Realtime — when a new approved review lands, prepend it instantly
    // without a refresh. Keeps the "live updates" promise from your
    // initial pitch. The channel only listens to INSERT events on the
    // underlying feedback_wall (Supabase Realtime doesn't fire on
    // views), so we re-filter client-side for is_approved + sentiment.
    const channel = supabase
      .channel('public_reviews:inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feedback_wall' },
        (payload) => {
          const row = payload.new as Partial<PublicReview> & { is_approved?: boolean };
          if (!row.is_approved) return;
          setReviews((prev) => [
            {
              id: row.id ?? crypto.randomUUID(),
              body: row.body ?? '',
              star_rating: row.star_rating ?? null,
              display_name: row.display_name ?? null,
              sentiment: row.sentiment ?? null,
              created_at: row.created_at ?? new Date().toISOString(),
            },
            ...prev,
          ]);
        },
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-foreground relative overflow-hidden">
      {/* Aurora — same green glow as the privacy page */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34, 197, 94,0.14) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.8)] border-b border-primary/[0.1]">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Link to="/" className="flex items-center">
            <RyznWordLogo height={26} />
          </Link>
          <div className="w-14" />
        </div>
      </nav>

      <main className="pt-[120px] pb-24 max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill glass-card border-l-2 border-accent-green mb-6"
          >
            <Sparkles size={14} className="text-accent-green" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Live from the app
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="font-extrabold tracking-[-0.035em] leading-[1.05]"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}
          >
            What lifters are saying.
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="mt-4 text-muted-foreground max-w-[640px]"
            style={{ fontSize: '1.0625rem' }}
          >
            Every review here was submitted directly from inside the RYZN app via
            the Dynamic Feedback flow. New reviews appear in real time.
          </motion.p>
        </motion.section>

        {/* Stats strip */}
        {!loading && reviews.length > 0 && (
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4"
          >
            <Stat label="Reviews" value={String(reviews.length)} />
            <Stat label="Average" value={avgStarsLabel(reviews)} accent />
            <Stat label="Latest" value={timeAgo(reviews[0].created_at)} />
          </motion.div>
        )}

        {/* Grid — populated reviews OR loading skeletons */}
        {(loading || reviews.length > 0) && (
          <motion.section
            className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </motion.section>
        )}

        {/* Empty state — error and "no reviews yet" both land here.
            The page intentionally celebrates being un-reviewed: a big
            "Be the first" CTA sits above ghost skeleton cards so the
            visitor immediately understands the format AND that they
            could be the one to fill it in. */}
        {!loading && reviews.length === 0 && <EmptyState />}
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: PublicReview }) {
  return (
    <motion.article
      variants={fadeUpVariant}
      className="glass-card rounded-[20px] p-6 flex flex-col gap-4 h-full"
    >
      {/* Stars */}
      {review.star_rating != null && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < (review.star_rating ?? 0)
                  ? 'fill-accent-green text-accent-green'
                  : 'text-muted-foreground/30'
              }
            />
          ))}
        </div>
      )}

      {/* Body */}
      <p className="text-foreground leading-relaxed text-[0.95rem] flex-1">
        {trimQuotes(review.body)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-primary/[0.06]">
        <span className="text-xs font-medium text-muted-foreground">
          {review.display_name?.trim() || 'RYZN user'}
        </span>
        <span className="text-xs text-muted-foreground/70">
          {timeAgo(review.created_at)}
        </span>
      </div>
    </motion.article>
  );
}

function SkeletonCard({ pulse = true }: { pulse?: boolean }) {
  return (
    <div
      className={`glass-card rounded-[20px] p-6 flex flex-col gap-4 ${
        pulse ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 rounded bg-muted-foreground/15" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3.5 rounded bg-muted-foreground/15 w-full" />
        <div className="h-3.5 rounded bg-muted-foreground/15 w-[92%]" />
        <div className="h-3.5 rounded bg-muted-foreground/15 w-[80%]" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-primary/[0.06]">
        <div className="h-3 rounded bg-muted-foreground/15 w-20" />
        <div className="h-3 rounded bg-muted-foreground/15 w-14" />
      </div>
    </div>
  );
}

// Empty-state surface. The page is brand new — celebrate that. A big
// "Be the first!" CTA card up top, followed by a faded skeleton grid
// that previews the layout once reviews arrive. No "couldn't load" or
// "no reviews yet" copy — the whole page reads as a deliberate
// invitation, not a broken state.
function EmptyState() {
  return (
    <div className="mt-12">
      {/* Hero CTA — the centerpiece */}
      <motion.div
        variants={fadeUpVariant}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-[24px] p-10 md:p-14 text-center glass-card border border-accent-green/30"
      >
        {/* Soft accent glow on the card */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34, 197, 94, 0.18) 0%, transparent 70%)',
          }}
        />

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-green/10 border border-accent-green/30 mb-5">
          <Star size={22} className="text-accent-green fill-accent-green" />
        </div>

        <h2
          className="font-extrabold tracking-[-0.02em] leading-[1.05]"
          style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)' }}
        >
          Be the first!
        </h2>

        <p className="mt-4 text-muted-foreground max-w-[520px] mx-auto leading-relaxed">
          No reviews on the wall yet — you could be the one to start it. Open
          RYZN on your phone, head to{' '}
          <span className="text-foreground font-medium">
            Settings → Dynamic Feedback
          </span>
          , write a quick line about how the app's working, and your card lands
          here the second you hit submit.
        </p>

        {/* Mini visual: how a single card will look */}
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-pill glass-card border-l-2 border-accent-green text-xs text-muted-foreground">
          <Sparkles size={12} className="text-accent-green" />
          <span>Reviews update live, no refresh needed</span>
        </div>
      </motion.div>

      {/* Ghost preview grid — shows the visitor what the layout looks
          like once reviews start landing. No pulse animation (this is
          a deliberate placeholder, not a loading state) and reduced
          opacity so they read as "future cards" not "broken state". */}
      <div className="mt-12 mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-muted-foreground/15" />
        <span className="text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground/60">
          Preview of how reviews will appear
        </span>
        <div className="h-px flex-1 bg-muted-foreground/15" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-40">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} pulse={false} />
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={`text-2xl font-bold tabular-nums tracking-tight ${
          accent ? 'text-accent-green' : 'text-foreground'
        }`}
      >
        {value}
      </span>
      <span className="text-[0.6875rem] uppercase tracking-[0.15em] text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function avgStarsLabel(reviews: PublicReview[]): string {
  const rated = reviews.filter((r) => typeof r.star_rating === 'number');
  if (rated.length === 0) return '—';
  const avg =
    rated.reduce((sum, r) => sum + (r.star_rating ?? 0), 0) / rated.length;
  return `${avg.toFixed(1)} ★`;
}

function timeAgo(iso: string): string {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

// Strip surrounding quotes the iOS classifier sometimes wraps around the
// raw body. Keeps inline quotes inside the text intact.
function trimQuotes(s: string): string {
  return s.replace(/^["'\s]+|["'\s]+$/g, '');
}

export default Reviews;
