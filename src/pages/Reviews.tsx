import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MessageSquare, Sparkles, Search, ChevronUp, X as XIcon } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import {
  supabase,
  getOrCreateDeviceId,
  getVotedReviewIds,
  markReviewVoted,
  type PublicReview,
} from '@/lib/supabase';

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
  const [query, setQuery] = useState('');
  // Voted set is per-browser-device (backed by localStorage). Initialized
  // here, then mutated optimistically when the user upvotes — the DB
  // upsert is async and we don't want the heart to wait for it.
  const [voted, setVoted] = useState<Set<string>>(() => getVotedReviewIds());

  /** Optimistic upvote — bumps the local count + voted set, then fires
      the Supabase insert in the background. The UNIQUE (review_id,
      device_id) constraint stops dupes server-side; we don't roll back
      on failure because a 409 just means "already voted," which we
      already reflect in the UI. */
  const upvote = async (reviewId: string) => {
    if (voted.has(reviewId)) return;
    // Mark voted + bump count immediately for snappy UX.
    setVoted((prev) => new Set(prev).add(reviewId));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, upvote_count: r.upvote_count + 1 } : r,
      ),
    );
    markReviewVoted(reviewId);

    const deviceId = getOrCreateDeviceId();
    const { error: upErr } = await supabase
      .from('review_upvotes')
      .insert({ review_id: reviewId, device_id: deviceId });
    if (upErr && !upErr.message.includes('duplicate')) {
      console.warn('[Reviews] upvote failed:', upErr.message);
    }
  };

  /** In-memory keyword filter. Matches body OR display name; case-
      insensitive; whitespace-tolerant. Cheap up to a few hundred
      reviews — when we outgrow that, swap in a Postgres tsvector. */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.body.toLowerCase().includes(q) ||
        (r.display_name ?? '').toLowerCase().includes(q),
    );
  }, [reviews, query]);

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
              image_urls: row.image_urls ?? [],
              upvote_count: row.upvote_count ?? 0,
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

        {/* Search bar — only shown once there's something to search.
            Filters in-memory (cheap up to a few hundred reviews); when
            we outgrow that, swap in a Postgres tsvector. */}
        {!loading && reviews.length > 0 && (
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <div className="relative max-w-[520px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search reviews…"
                className="w-full pl-11 pr-10 py-3 rounded-pill glass-card border border-primary/[0.1] text-[0.9375rem] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent-green/50 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                  aria-label="Clear search"
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>
            {query && (
              <p className="mt-3 text-xs text-muted-foreground/70 ml-2">
                {filtered.length} match{filtered.length === 1 ? '' : 'es'} for{' '}
                <span className="text-foreground/80">"{query}"</span>
              </p>
            )}
          </motion.div>
        )}

        {/* Grid — populated reviews OR loading skeletons */}
        {(loading || reviews.length > 0) && (
          <motion.section
            className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((r) => (
                  <ReviewCard
                    key={r.id}
                    review={r}
                    voted={voted.has(r.id)}
                    onUpvote={() => upvote(r.id)}
                  />
                ))}
          </motion.section>
        )}

        {/* Search returned nothing — gentle prompt to clear it. */}
        {!loading && reviews.length > 0 && filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">
            No reviews match{' '}
            <span className="text-foreground/80">"{query}"</span>.{' '}
            <button
              onClick={() => setQuery('')}
              className="text-accent-green hover:underline"
            >
              Clear search
            </button>
          </div>
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

function ReviewCard({
  review,
  voted,
  onUpvote,
}: {
  review: PublicReview;
  voted: boolean;
  onUpvote: () => void;
}) {
  const images = review.image_urls ?? [];

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

      {/* Before/after image strip — when the user attached photos in
          the iOS feedback flow, they show here. Two photos = side-by-
          side (the canonical "before / after" layout); one or 3+ =
          a horizontal scroll strip. Click to open lightbox. */}
      {images.length > 0 && <ImageStrip images={images} />}

      {/* Body */}
      <p className="text-foreground leading-relaxed text-[0.95rem] flex-1">
        {trimQuotes(review.body)}
      </p>

      {/* Footer — upvote pill on the left, name + time on the right */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-primary/[0.06]">
        <button
          onClick={onUpvote}
          disabled={voted}
          aria-label={voted ? 'Upvoted' : 'Upvote this review'}
          className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill text-xs font-medium transition-all ${
            voted
              ? 'bg-accent-green/15 text-accent-green cursor-default'
              : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
          }`}
        >
          <ChevronUp
            size={14}
            className={`transition-transform ${
              voted ? '' : 'group-hover:-translate-y-0.5'
            }`}
          />
          <span className="tabular-nums">{review.upvote_count}</span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-muted-foreground truncate">
            {review.display_name?.trim() || 'RYZN user'}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
            {timeAgo(review.created_at)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/** Renders attached progress photos. Two images get the canonical
    before/after side-by-side; anything else gets a horizontal scroll
    strip. Click any image to open a fullscreen lightbox. */
function ImageStrip({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const layout =
    images.length === 2
      ? 'grid grid-cols-2 gap-2'
      : 'flex gap-2 overflow-x-auto -mx-1 px-1 snap-x';

  return (
    <>
      <div className={layout}>
        {images.map((url, i) => (
          <button
            key={url + i}
            onClick={() => setLightbox(url)}
            className={`relative overflow-hidden rounded-xl bg-primary/5 ${
              images.length === 2 ? 'aspect-[3/4]' : 'aspect-[3/4] min-w-[140px] snap-start'
            }`}
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={url}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform hover:scale-[1.03]"
            />
            {images.length === 2 && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-pill bg-black/60 backdrop-blur-sm text-[0.625rem] font-bold text-white tracking-wider uppercase">
                {i === 0 ? 'Before' : 'After'}
              </span>
            )}
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[2000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
        </div>
      )}
    </>
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
