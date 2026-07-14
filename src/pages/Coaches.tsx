import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Users,
  ClipboardList,
  Trophy,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Dumbbell,
  LineChart,
  ArrowRight,
  ChevronDown,
  Flame,
  Utensils,
  Activity,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import TeamReachMap from '@/components/coaches/TeamReachMap';
import Footer from '@/components/landing/Footer';
import SubpageNav from '@/components/landing/SubpageNav';

// RYZN for Coaches — image-led Trainer Mode page. NO PRICING anywhere:
// deals are closed directly over email (Jack, 2026-07-11).
//
// UNPUBLISHED: this route ships in the bundle but is intentionally NOT
// linked from the navbar, footer, or sitemap. The iOS app's "RYZN for
// Coaches" buttons deep-link to /coaches#pricing — that anchor now
// lives on the final "invite-only" CTA section, so old links land on
// the register block instead of a dead hash.

const CONTACT_EMAIL = 'hello@ryznrise.com';
const CONTACT_SUBJECT = encodeURIComponent('RYZN for Coaches — Register My Team');
const CONTACT_BODY = encodeURIComponent(
  "Hi Jack,\n\nI'm a coach/trainer interested in RYZN for Coaches.\n\nSport / discipline:\nTeam or client count:\nWhat I'm looking for:\n"
);
const contactHref = `mailto:${CONTACT_EMAIL}?subject=${CONTACT_SUBJECT}&body=${CONTACT_BODY}`;

// Broadcast-style verified-log ticker under the hero — the page opens
// on PROOF rolling in, like a wire feed off the weight room floor.
const tickerItems = [
  'M. CARTER — SESSION COMPLETE · 14,200 LB VOLUME',
  'SQUAD PROTEIN COMPLIANCE 91%',
  'D. OKAFOR — 2,140 CAL LOGGED',
  'FLAG CLEARED — J. REYES BACK ON TARGET',
  'O-LINE GROUP · 6/6 SESSIONS THIS WEEK',
  'T. BROOKS — NEW PR · TRAP BAR 585',
  'SUNDAY REPORT GENERATED — 53 ATHLETES',
  'MACROS APPLIED — FULL ROSTER · 1 TAP',
];

// Count-up stat for the proof band. Numbers earn the scroll.
const BigStat = ({
  value,
  suffix,
  label,
  sub,
}: {
  value: number;
  suffix?: string;
  label: string;
  sub: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1200;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center lg:text-left">
      <div
        className="font-extrabold gradient-text tabular-nums tracking-[-0.04em]"
        style={{ fontSize: 'clamp(4rem, 9vw, 7.5rem)', lineHeight: 0.95 }}
      >
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-3 text-foreground font-bold text-lg">{label}</div>
      <div className="mt-1 text-foreground/55 text-sm leading-relaxed max-w-[280px] mx-auto lg:mx-0">
        {sub}
      </div>
    </div>
  );
};

// Real-world photography (Unsplash CDN, license-free).
const IMG = {
  // Brandless athletic photography — no visible logos (Jack, 2026-07-13).
  hero: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=2000&q=80&auto=format&fit=crop',
  roster: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1400&q=80&auto=format&fit=crop',
  program: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=80&auto=format&fit=crop',
  work: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=1400&q=80&auto=format&fit=crop',
  cta: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=2000&q=80&auto=format&fit=crop',
};

// Three image-led bands. Copy is deliberately tight — the photo sells,
// the bullets confirm.
const bands = [
  {
    img: IMG.roster,
    alt: 'Team celebrating a win on the court',
    eyebrow: 'THE ROSTER',
    title: 'Your whole team, live.',
    points: [
      { icon: Users, text: 'Invite the roster with one code' },
      { icon: Trophy, text: 'Weekly leaderboard from real logs' },
      { icon: CheckCircle2, text: 'Auto-verified — nothing self-reported' },
    ],
  },
  {
    img: IMG.program,
    alt: 'Athlete setting up a heavy barbell deadlift',
    eyebrow: 'THE PROGRAM',
    title: 'Write it once. Drop it to everyone.',
    points: [
      { icon: ClipboardList, text: 'Multi-week programs & session drops' },
      { icon: Dumbbell, text: '150+ lifts, full conditioning library' },
      { icon: CheckCircle2, text: 'Completion boards — who did the work' },
    ],
  },
  {
    img: IMG.work,
    alt: 'Athlete grinding through a training set',
    eyebrow: 'THE ATHLETES',
    title: 'See who\u2019s putting in the work.',
    points: [
      { icon: LineChart, text: 'Per-athlete food & consistency scores' },
      { icon: MessageSquare, text: 'Assign macros, message directly' },
      { icon: BookOpen, text: 'Playbook, drills & team resources' },
    ],
  },
];

const extras = [
  { icon: MessageSquare, text: 'Private-client mode for trainers' },
  { icon: ShieldCheck, text: 'Admin seats for your staff' },
  { icon: Trophy, text: 'Athletes get RYZN Pro included' },
];

// ---------------------------------------------------------------------------
// Team Intelligence — in-app metrics recreated as live web components
// (Jack 2026-07-13: "take screenshots of some of the cool metrics...
// or recreate them on the website"). Recreated > screenshots: crisp at
// every size, on-brand, no App Store review implications.
// ---------------------------------------------------------------------------

const leaderboardRows = [
  {
    rank: 1,
    name: 'Marcus Lee',
    init: 'M',
    meta: '6 workouts · 7 days logged',
    pts: 982,
    pos: 'Quarterback',
    food: 92,
    consistency: 100,
    streak: 34,
    lift: 'Trap bar 585 lb',
  },
  {
    rank: 2,
    name: 'Sofia Chen',
    init: 'S',
    meta: '5 workouts · 7 days logged',
    pts: 913,
    pos: 'Midfielder',
    food: 88,
    consistency: 100,
    streak: 21,
    lift: 'Back squat 245 lb',
  },
  {
    rank: 3,
    name: 'Jordan Miles',
    init: 'J',
    meta: '5 workouts · 6 days logged',
    pts: 847,
    pos: 'Wide Receiver',
    food: 79,
    consistency: 86,
    streak: 12,
    lift: 'Power clean 275 lb',
  },
  {
    rank: 4,
    name: 'Diego Fuentes',
    init: 'D',
    meta: '4 workouts · 6 days logged',
    pts: 792,
    pos: 'Guard',
    food: 74,
    consistency: 86,
    streak: 9,
    lift: 'Bench press 315 lb',
  },
];

// Rank-badge palettes — gold / silver / bronze podium, then muted.
const rankStyle: Record<number, string> = {
  1: 'bg-gradient-to-br from-[#f5d167] to-[#c79a2e] text-black',
  2: 'bg-gradient-to-br from-[#d8dde3] to-[#9aa2ab] text-black',
  3: 'bg-gradient-to-br from-[#d69a63] to-[#a26a34] text-black',
};

// Weekly report bars — one per weekday, with a short label + team-fueling
// readout that surfaces on hover.
const reportDays = [
  { label: 'Mon', v: 42, note: 'Team fueling at 42% of target' },
  { label: 'Tue', v: 58, note: 'Recovery day — 58% logged' },
  { label: 'Wed', v: 50, note: 'Mid-week dip, 50% on plan' },
  { label: 'Thu', v: 72, note: 'Back on track — 72% fueled' },
  { label: 'Fri', v: 66, note: 'Pre-game taper, 66%' },
  { label: 'Sat', v: 84, note: 'Game day — 84% dialed in' },
  { label: 'Sun', v: 91, note: 'Best day: 91% team compliance' },
];

const IntelCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeUpVariant}
    whileHover={{ y: -6 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    className="group relative rounded-[20px] p-5 lg:p-6 bg-[rgba(255,255,255,0.03)] border border-white/[0.07] backdrop-blur-sm transition-colors duration-300 hover:border-primary/35"
    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px -20px rgba(0,0,0,0.6)' }}
  >
    {/* Green glow bloom on hover — the Steelberg card lift. */}
    <div
      className="pointer-events-none absolute -inset-px rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ boxShadow: '0 0 0 1px hsl(var(--primary) / 0.18), 0 34px 70px -28px hsl(var(--primary) / 0.4)' }}
    />
    <div className="relative">{children}</div>
  </motion.div>
);

const IntelEyebrow = ({ text }: { text: string }) => (
  <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary mb-4">{text}</div>
);

// A little inline gauge used inside the expanded athlete detail.
const MiniGauge = ({
  icon: Icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  suffix: string;
  color: string;
}) => (
  <div className="rounded-[10px] p-2.5 bg-white/[0.03] border border-white/[0.05]">
    <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-foreground/40">
      <Icon size={11} className={color} />
      {label}
    </div>
    <div className="mt-1 text-base font-extrabold tabular-nums text-foreground">
      {value}
      <span className="text-[11px] font-semibold text-foreground/45">{suffix}</span>
    </div>
  </div>
);

// 1 — Verified leaderboard. Rows expand on click to reveal the athlete
// breakdown (Jack, 2026-07-13: "make the players' names expand when clicked").
const LeaderboardIntelCard = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <IntelCard>
      <div className="flex items-center justify-between">
        <IntelEyebrow text="Weekly Leaderboard" />
        <span className="text-[9px] font-bold tracking-widest uppercase text-accent-green/80 border border-accent-green/25 rounded-full px-2.5 py-1 mb-4">
          Auto-verified
        </span>
      </div>
      <div className="flex gap-1.5 mb-4">
        {['Week', 'Month', 'Overall', 'Position'].map((t, i) => (
          <span
            key={t}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
              i === 0
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-foreground/45 border border-white/[0.06]'
            }`}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="space-y-2">
        {leaderboardRows.map((r) => {
          const isOpen = open === r.rank;
          return (
            <div
              key={r.rank}
              className={`rounded-[14px] border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white/[0.06] border-primary/30'
                  : 'bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.06] hover:border-primary/25'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : r.rank)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
              >
                <span
                  className={`w-6 h-6 shrink-0 rounded-full grid place-items-center text-[11px] font-extrabold ${
                    rankStyle[r.rank] ?? 'bg-white/[0.08] text-foreground/50'
                  }`}
                >
                  {r.rank}
                </span>
                <span className="w-8 h-8 shrink-0 rounded-[9px] grid place-items-center text-sm font-bold text-accent-blue bg-accent-blue/15 border border-accent-blue/20">
                  {r.init}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground truncate">{r.name}</div>
                  <div className="text-[11px] text-foreground/45 truncate">{r.meta}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-extrabold text-accent-blue tabular-nums leading-none">
                    {r.pts.toLocaleString()}
                  </div>
                  <div className="text-[8px] font-bold tracking-[0.15em] text-foreground/35 mt-0.5">
                    PTS
                  </div>
                </div>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-foreground/35 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3">
                      <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20">
                        {r.pos}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <MiniGauge
                          icon={Utensils}
                          label="Food"
                          value={r.food}
                          suffix="/100"
                          color="text-[hsl(38_92%_55%)]"
                        />
                        <MiniGauge
                          icon={Activity}
                          label="Consistency"
                          value={r.consistency}
                          suffix="%"
                          color="text-accent-blue"
                        />
                        <MiniGauge
                          icon={Flame}
                          label="Streak"
                          value={r.streak}
                          suffix="d"
                          color="text-primary"
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2 rounded-[10px] px-2.5 py-2 bg-white/[0.03] border border-white/[0.05]">
                        <Trophy size={13} className="text-primary shrink-0" />
                        <span className="text-[11px] text-foreground/70">
                          Top lift this week ·{' '}
                          <span className="font-bold text-foreground/90">{r.lift}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-foreground/45">
        Points from completed sessions, protein targets hit, and logging streaks. Tap any
        athlete to open their verified breakdown.
      </p>
    </IntelCard>
  );
};

// 2 — AI flags inbox. "Mark handled" swaps the card body for a success
// screen (Jack: "make the mark handled button have a little screen").
const FlagIntelCard = () => {
  const [handled, setHandled] = useState(false);
  return (
    <IntelCard>
      <div className="flex items-center justify-between">
        <IntelEyebrow text="AI Flags" />
        <span
          className={`text-[9px] font-bold text-white rounded-full px-2 py-0.5 mb-4 tabular-nums transition-colors duration-300 ${
            handled ? 'bg-accent-green' : 'bg-red-500'
          }`}
        >
          {handled ? 3 : 4}
        </span>
      </div>
      <div className="relative min-h-[268px]">
        <AnimatePresence mode="wait">
          {handled ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[14px] p-6 bg-accent-green/[0.06] border border-accent-green/25 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.08, type: 'spring', stiffness: 320, damping: 18 }}
                className="w-14 h-14 rounded-full grid place-items-center bg-accent-green/15 border border-accent-green/30 text-accent-green"
              >
                <CheckCircle2 size={30} />
              </motion.div>
              <div className="mt-4 text-base font-extrabold text-foreground">Flag handled</div>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/60 max-w-[240px]">
                Marcus Lee moved to your Watchlist. His resting-HR trend will re-alert if it
                stays elevated another 48 hours.
              </p>
              <button
                onClick={() => setHandled(false)}
                className="mt-4 text-[11px] font-bold text-foreground/45 hover:text-foreground/70 transition-colors"
              >
                Undo
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="flag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-[14px] p-4 bg-red-500/[0.06] border border-red-500/25"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 shrink-0 rounded-full grid place-items-center bg-red-500/15 text-red-400 text-sm">
                    ♥
                  </span>
                  <div>
                    <div className="text-sm font-bold text-foreground leading-tight">
                      Marcus Lee
                    </div>
                    <div className="text-[11px] text-red-300/80 font-medium">Resting HR Spike</div>
                  </div>
                </div>
                <span className="text-[8px] font-extrabold tracking-widest uppercase text-red-400">
                  Critical
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-foreground/75">
                Resting heart rate is up 18 bpm over his 4-week baseline, 3 days running.
              </p>
              <div className="mt-3 rounded-[10px] p-3 bg-red-500/[0.05] border border-red-500/15">
                <div className="text-[9px] font-extrabold tracking-widest uppercase text-red-400/90 mb-1">
                  Why it matters
                </div>
                <p className="text-[11px] leading-relaxed text-foreground/65">
                  Sustained resting-HR elevation usually means illness, overtraining, or poor
                  recovery — the body fighting something instead of absorbing training.
                </p>
              </div>
              <button
                onClick={() => setHandled(true)}
                className="mt-3 w-full rounded-[10px] py-2 text-xs font-bold text-accent-green bg-accent-green/[0.08] border border-accent-green/25 transition-colors duration-200 hover:bg-accent-green/[0.16] hover:border-accent-green/40"
              >
                ✓ Mark handled
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-5 text-xs text-foreground/45">
        Anomalies surface to your inbox before they become problems — every flag explains what
        changed, why it matters, and its team impact.
      </p>
    </IntelCard>
  );
};

// 3 — Sunday report card. Each bar highlights on hover with a live readout
// (Jack: "each day gets highlighted as I hover over them").
const ReportIntelCard = () => {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? reportDays.length - 1;
  return (
    <IntelCard>
      <div className="flex items-center justify-between">
        <IntelEyebrow text="Team Weekly Report" />
        <span className="text-[10px] font-semibold text-foreground/35 mb-4">Jul 7</span>
      </div>
      <p className="text-[15px] font-bold text-foreground leading-snug">
        Team fueling is up 9% — three athletes need eyes this week.
      </p>
      <div className="mt-4 space-y-2.5">
        <div className="flex gap-2.5">
          <LineChart size={14} className="text-accent-blue shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-foreground/65">
            <span className="font-bold text-foreground/80">Trends&nbsp;·&nbsp;</span>7 of 8
            athletes logged 5+ days. Protein avg climbed to 141g/day (up from 129).
          </p>
        </div>
        <div className="flex gap-2.5">
          <Trophy size={14} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-foreground/65">
            <span className="font-bold text-foreground/80">Climbing&nbsp;·&nbsp;</span>Sofia
            jumped two leaderboard spots; Jordan put up his biggest volume week.
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-2 h-20">
        {reportDays.map((d, i) => {
          const isActive = active === i;
          const isLast = i === reportDays.length - 1;
          return (
            <button
              key={d.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="flex-1 flex flex-col justify-end h-full group/bar"
              aria-label={d.note}
            >
              <div
                className={`rounded-t-[4px] origin-bottom transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-t from-primary to-accent-green scale-y-105'
                    : isLast
                      ? 'bg-gradient-to-t from-primary/70 to-accent-green/70'
                      : 'bg-white/[0.12] group-hover/bar:bg-white/25'
                }`}
                style={{ height: `${d.v}%` }}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[9px] font-semibold uppercase tracking-wider">
        {reportDays.map((d, i) => (
          <span
            key={d.label}
            className={`flex-1 text-center transition-colors duration-200 ${
              active === i ? 'text-primary' : 'text-foreground/30'
            }`}
          >
            {d.label}
          </span>
        ))}
      </div>
      <div className="mt-3 rounded-[10px] px-3 py-2 bg-white/[0.03] border border-white/[0.05] text-[11px] text-foreground/70">
        <span className="font-bold text-foreground/90 tabular-nums">{reportDays[active].v}%</span>
        <span className="mx-1.5 text-foreground/25">·</span>
        {reportDays[active].note}
      </div>
      <p className="mt-4 text-xs text-foreground/45">
        A full report card lands every Sunday morning — team-wide for staff, personal for every
        athlete. Hover any day to break it down.
      </p>
    </IntelCard>
  );
};

// 4 — Macro autopilot. "Apply recommendation" swaps to a success screen
// (Jack: "make apply recommendation actually have a little screen").
const MacroIntelCard = () => {
  const [applied, setApplied] = useState(false);
  return (
    <IntelCard>
      <IntelEyebrow text="Macro Autopilot" />
      <div className="relative min-h-[176px]">
        <AnimatePresence mode="wait">
          {applied ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[14px] p-6 bg-accent-green/[0.06] border border-accent-green/25 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.08, type: 'spring', stiffness: 320, damping: 18 }}
                className="w-14 h-14 rounded-full grid place-items-center bg-accent-green/15 border border-accent-green/30 text-accent-green"
              >
                <CheckCircle2 size={30} />
              </motion.div>
              <div className="mt-4 text-base font-extrabold text-foreground">Targets applied</div>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground/60 max-w-[240px]">
                3,490 cal &middot; 174P / 419C / 124F pushed to the athlete's plan. They'll see it
                on their next app open.
              </p>
              <button
                onClick={() => setApplied(false)}
                className="mt-4 text-[11px] font-bold text-foreground/45 hover:text-foreground/70 transition-colors"
              >
                Undo
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="rec"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-[14px] p-4 bg-accent-green/[0.05] border border-accent-green/25"
            >
              <div className="text-[9px] font-extrabold tracking-widest uppercase text-accent-green mb-2">
                ✦ AI Recommended
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                    3,490
                  </span>
                  <span className="text-sm font-semibold text-foreground/55">cal</span>
                </div>
                <div className="flex gap-3 text-xs font-bold tabular-nums">
                  <span>
                    <span className="text-primary">P</span>{' '}
                    <span className="text-foreground/80">174g</span>
                  </span>
                  <span>
                    <span className="text-[hsl(38_92%_55%)]">C</span>{' '}
                    <span className="text-foreground/80">419g</span>
                  </span>
                  <span>
                    <span className="text-accent-blue">F</span>{' '}
                    <span className="text-foreground/80">124g</span>
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-foreground/55">
                Quarterback · High School — maintenance fueling, steady energy.
              </p>
              <button
                onClick={() => setApplied(true)}
                className="mt-3 w-full rounded-[10px] py-2 text-xs font-bold text-accent-green bg-accent-green/[0.08] border border-accent-green/25 transition-colors duration-200 hover:bg-accent-green/[0.16] hover:border-accent-green/40"
              >
                Apply recommendation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-5 text-xs text-foreground/45">
        Position- and league-aware targets for the whole roster, one tap to apply — tuned per
        athlete from their real bodyweight and training load.
      </p>
    </IntelCard>
  );
};

const Coaches = () => {
  // The app deep-links to /coaches#pricing. On a cold SPA load the
  // browser's native hash scroll fires before React mounts the section
  // (and Lenis owns the scroll on desktop), so we scroll manually.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -96, immediate: true });
      else el.scrollIntoView({ behavior: 'smooth' }); // touch: native scroll
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-foreground">
      {/* Shared subpage nav — consistent across Scan / Coaches / Reviews
          so every page stays reachable from every other page. */}
      <SubpageNav current="coaches" cta={{ label: 'BECOME A COACH', href: contactHref }} />

      {/* Hero — full-bleed real-world photo, minimal copy. */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={IMG.hero}
          alt="Sprinters racing down a track, seen from above"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        {/* Readability + brand grade over the photo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(8,8,12,0.96) 0%, rgba(8,8,12,0.55) 45%, rgba(8,8,12,0.35) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 100%, hsl(var(--primary) / 0.16) 0%, transparent 70%)',
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pb-20 lg:pb-28"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-[rgba(8,8,14,0.6)] backdrop-blur-md border border-primary/25"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            RYZN for Coaches
          </motion.span>
          <motion.h1
            variants={fadeUpVariant}
            className="mt-6 font-extrabold tracking-[-0.03em] text-foreground max-w-[900px]"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)', lineHeight: 1.02 }}
          >
            Game day is won
            <br />
            <span className="gradient-text">Monday through Saturday.</span>
          </motion.h1>
          <motion.p
            variants={fadeUpVariant}
            className="mt-5 text-foreground/80 text-lg lg:text-xl max-w-[560px] leading-relaxed"
          >
            Every rep, every meal, every athlete on your roster — verified and in your
            pocket. Not self-reported. Not a spreadsheet. Proof.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={contactHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-pill font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
            >
              Bring RYZN to your program
              <ArrowRight size={16} />
            </a>
            <a
              href="#toolkit"
              className="px-8 py-4 rounded-pill font-semibold text-sm text-foreground/80 bg-[rgba(8,8,14,0.55)] backdrop-blur-md border border-white/10 hover:border-primary/40 hover:text-foreground transition-all duration-300"
            >
              See it in action
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Verified-log wire — broadcast ticker rolling live proof. */}
      <div className="relative border-y border-white/[0.06] bg-[rgba(8,8,14,0.85)] overflow-hidden py-3.5 select-none">
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, hsl(var(--bg-primary)), transparent)' }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, hsl(var(--bg-primary)), transparent)' }}
        />
        <motion.div
          className="flex whitespace-nowrap w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 36 }}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center">
              {tickerItems.map((item) => (
                <span
                  key={`${dup}-${item}`}
                  className="flex items-center gap-3 px-7 text-[11px] font-bold tracking-[0.14em] text-foreground/55"
                >
                  <CheckCircle2 size={12} className="text-accent-green shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Proof band — three numbers an NFL staff can't scroll past. */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center text-xs font-bold tracking-[0.2em] uppercase text-foreground/40 mb-16"
          >
            The gap between talent and performance is what happens off the field
          </motion.p>
          <div className="grid gap-14 lg:gap-16 lg:grid-cols-2 max-w-[900px] mx-auto">
            <BigStat
              value={100}
              suffix="%"
              label="Verified data"
              sub="Points, streaks, and rankings come from logged workouts and nutrition — athletes can't game it."
            />
            <BigStat
              value={0}
              label="Spreadsheets. Group chats. Guesswork."
              sub="Programs, macros, reports, and messaging live in the same app your athletes already open every day."
            />
          </div>
        </div>
      </section>

      {/* The board — interactive reach map: every athlete is the market. */}
      <TeamReachMap />

      {/* Image-led feature bands — photo sells, three bullets confirm. */}
      <section id="toolkit" className="relative py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 space-y-24 lg:space-y-32">
          {bands.map((band, i) => (
            <motion.div
              key={band.title}
              className={`flex flex-col gap-10 lg:gap-16 items-center ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Photo */}
              <motion.div variants={fadeUpVariant} className="w-full lg:w-[55%]">
                <div className="relative rounded-[24px] overflow-hidden group">
                  <img
                    src={band.img}
                    alt={band.alt}
                    loading="lazy"
                    className="w-full h-[320px] lg:h-[440px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(8,8,12,0.45) 0%, transparent 45%)',
                      boxShadow: 'inset 0 0 0 1px hsl(var(--primary) / 0.15)',
                      borderRadius: '24px',
                    }}
                  />
                  <div
                    className="absolute -inset-6 -z-10 blur-[50px] opacity-50"
                    style={{
                      background:
                        'radial-gradient(ellipse 60% 60% at 50% 60%, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </motion.div>

              {/* Copy */}
              <div className="w-full lg:w-[45%]">
                <motion.span
                  variants={fadeUpVariant}
                  className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
                >
                  {band.eyebrow}
                </motion.span>
                <motion.h2
                  variants={fadeUpVariant}
                  className="mt-4 font-bold tracking-tight text-foreground"
                  style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
                >
                  {band.title}
                </motion.h2>
                <div className="mt-7 space-y-4">
                  {band.points.map((p) => (
                    <motion.div
                      key={p.text}
                      variants={fadeUpVariant}
                      className="flex items-center gap-4"
                    >
                      <div className="w-9 h-9 shrink-0 rounded-[10px] dmd-concave flex items-center justify-center text-primary">
                        <p.icon size={17} />
                      </div>
                      <span className="text-foreground/85 text-[1.0625rem]">{p.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Intelligence — the in-app metrics, recreated live. */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            className="text-center max-w-[640px] mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.span
              variants={fadeUpVariant}
              className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
            >
              Team Intelligence
            </motion.span>
            <motion.h2
              variants={fadeUpVariant}
              className="mt-4 font-bold tracking-tight text-foreground"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
            >
              The numbers do the coaching.
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="mt-4 text-foreground/70 text-lg">
              Every metric below is computed from real logged workouts and nutrition —
              nothing self-reported, nothing gamed.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-14 grid gap-5 lg:gap-6 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* 1 — Verified leaderboard (click-to-expand athlete detail) */}
            <LeaderboardIntelCard />

            {/* 2 — AI flags inbox (Mark-handled success screen) */}
            <FlagIntelCard />

            {/* 3 — Sunday report card (per-day hover readout) */}
            <ReportIntelCard />

            {/* 4 — Macro autopilot (Apply-recommendation success screen) */}
            <MacroIntelCard />
          </motion.div>
        </div>
      </section>

      {/* Extras — one quiet pill row, no card wall. */}
      <section className="relative pb-6">
        <motion.div
          className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {extras.map((e) => (
            <motion.span
              key={e.text}
              variants={fadeUpVariant}
              className="dmd-convex inline-flex items-center gap-2.5 px-5 py-2.5 rounded-pill text-sm text-foreground/75"
            >
              <e.icon size={15} className="text-primary" />
              {e.text}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Register — invite-only, deals closed directly. Keeps the
          id="pricing" anchor so existing iOS deep-links land here. */}
      <section id="pricing" className="relative py-24 lg:py-32 mt-16 overflow-hidden scroll-mt-24">
        <img
          src={IMG.cta}
          alt="Athletes running at dawn"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,8,12,0.97) 0%, rgba(8,8,12,0.72) 50%, rgba(8,8,12,0.95) 100%)',
          }}
        />
        <motion.div
          className="relative z-10 max-w-[760px] mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-[rgba(8,8,14,0.6)] backdrop-blur-md border border-primary/25"
          >
            Invite-only
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-5 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.08 }}
          >
            Bring your team to <span className="gradient-text">RYZN</span>.
          </motion.h2>
          <motion.p
            variants={fadeUpVariant}
            className="mt-5 text-foreground/75 text-lg leading-relaxed max-w-[540px] mx-auto"
          >
            RYZN for Coaches is invite-only and priced per program — pro to prep, every
            deal is built around your roster. Tell me about your team and you&apos;ll talk
            directly with the founder. Your athletes never pay a cent.
          </motion.p>
          <motion.div variants={fadeUpVariant}>
            <a
              href={contactHref}
              className="inline-flex items-center gap-2 mt-9 px-10 py-4 rounded-pill font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
            >
              Register as a Coach
              <ArrowRight size={16} />
            </a>
          </motion.div>
          <motion.p variants={fadeUpVariant} className="mt-4 text-xs text-foreground/45">
            {CONTACT_EMAIL} — replies come from the founder, usually same-day.
          </motion.p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Coaches;
