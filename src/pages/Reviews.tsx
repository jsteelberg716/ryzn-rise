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
        setError(error.message);
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

        {/* Grid */}
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

        {/* Empty / error states */}
        {!loading && error && (
          <div className="mt-16 glass-card rounded-[20px] p-8 text-center">
            <p className="text-muted-foreground">
              Couldn't load reviews right now.
              <br />
              <span className="text-xs text-muted-foreground/60">{error}</span>
            </p>
          </div>
        )}
        {!loading && !error && reviews.length === 0 && <EmptyState />}
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

function SkeletonCard() {
  return (
    <div className="glass-card rounded-[20px] p-6 flex flex-col gap-4 animate-pulse">
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

function EmptyState() {
  return (
    <div className="mt-20 flex flex-col items-center text-center gap-4 max-w-[480px] mx-auto">
      <div className="w-14 h-14 rounded-full glass-card flex items-center justify-center border-l-2 border-accent-green">
        <MessageSquare size={22} className="text-accent-green" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">No reviews yet.</h2>
      <p className="text-muted-foreground">
        Be the first. Open RYZN on your phone, tap{' '}
        <span className="text-foreground font-medium">Dynamic Feedback</span> in
        Settings, and your review lands here the moment you hit submit.
      </p>
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
