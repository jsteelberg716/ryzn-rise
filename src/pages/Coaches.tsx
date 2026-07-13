import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
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
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import Footer from '@/components/landing/Footer';

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
  hero: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2000&q=80&auto=format&fit=crop',
  roster: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1400&q=80&auto=format&fit=crop',
  program: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1400&q=80&auto=format&fit=crop',
  work: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1400&q=80&auto=format&fit=crop',
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
    alt: 'Athlete pressing a barbell overhead in the rack',
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
    alt: 'Athlete grinding out pull-ups in a dark gym',
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
  { rank: 1, name: 'M. Carter', pos: 'QB', pts: 1240, pct: 100 },
  { rank: 2, name: 'D. Okafor', pos: 'LB', pts: 1105, pct: 89 },
  { rank: 3, name: 'J. Reyes', pos: 'WR', pts: 980, pct: 79 },
  { rank: 4, name: 'T. Brooks', pos: 'OL', pts: 845, pct: 68 },
];

const reportBars = [42, 58, 50, 72, 66, 84, 91];

const IntelCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeUpVariant}
    className="rounded-[20px] p-5 lg:p-6 bg-[rgba(255,255,255,0.03)] border border-white/[0.07] backdrop-blur-sm"
    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px -20px rgba(0,0,0,0.6)' }}
  >
    {children}
  </motion.div>
);

const IntelEyebrow = ({ text }: { text: string }) => (
  <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-primary mb-4">{text}</div>
);

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
      {/* Minimal top bar — logo home link only. The main navbar's hash
          links target homepage sections and would dead-end here. */}
      <nav className="fixed top-3 left-0 right-0 z-[1000] flex justify-center px-4">
        <div className="w-full max-w-[1080px] h-14 rounded-full flex items-center justify-between pl-6 pr-3 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.72)] border border-primary/[0.12] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]">
          <Link to="/" className="flex items-center">
            <RyznWordLogo height={28} />
          </Link>
          <a
            href={contactHref}
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
          >
            BECOME A COACH
          </a>
        </div>
      </nav>

      {/* Hero — full-bleed real-world photo, minimal copy. */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={IMG.hero}
          alt="Sprinter set in the starting blocks on a track"
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
          <div className="grid gap-14 lg:gap-8 lg:grid-cols-3">
            <BigStat
              value={100}
              suffix="%"
              label="Verified data"
              sub="Points, streaks, and rankings come from logged workouts and nutrition — athletes can't game it."
            />
            <BigStat
              value={53}
              label="Athletes, one screen"
              sub="The whole roster's week — training, fueling, recovery — readable in the time it takes to walk to practice."
            />
            <BigStat
              value={0}
              label="Spreadsheets. Group chats. Guesswork."
              sub="Programs, macros, reports, and messaging live in the same app your athletes already open every day."
            />
          </div>
        </div>
      </section>

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
            {/* 1 — Verified leaderboard */}
            <IntelCard>
              <div className="flex items-center justify-between">
                <IntelEyebrow text="Weekly Leaderboard" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-accent-green/80 border border-accent-green/25 rounded-full px-2.5 py-1 mb-4">
                  Auto-verified
                </span>
              </div>
              <div className="space-y-3">
                {leaderboardRows.map((r) => (
                  <div key={r.rank} className="flex items-center gap-3">
                    <span
                      className={`w-5 text-sm font-extrabold ${
                        r.rank === 1 ? 'text-primary' : 'text-foreground/40'
                      }`}
                    >
                      {r.rank}
                    </span>
                    <span className="w-24 shrink-0 text-sm font-semibold text-foreground/90">
                      {r.name}
                    </span>
                    <span className="text-[10px] font-bold text-foreground/35 w-7">{r.pos}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent-green"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground/70 tabular-nums">
                      {r.pts.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-foreground/45">
                Points from completed sessions, protein targets hit, and logging streaks.
                Filter by position group with one tap.
              </p>
            </IntelCard>

            {/* 2 — AI flags inbox */}
            <IntelCard>
              <IntelEyebrow text="AI Flags" />
              <div className="rounded-[14px] p-4 bg-white/[0.03] border border-red-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-bold text-foreground">
                    J. Reyes — protein down 32% this week
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs leading-relaxed">
                  <p>
                    <span className="font-bold text-foreground/60">WHAT&nbsp;&nbsp;</span>
                    <span className="text-foreground/70">Avg 96g vs a 142g target across 5 days.</span>
                  </p>
                  <p>
                    <span className="font-bold text-foreground/60">WHY&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span className="text-foreground/70">Skipped breakfast logs Tue–Fri; dinner unchanged.</span>
                  </p>
                  <p>
                    <span className="font-bold text-foreground/60">IMPACT</span>
                    <span className="text-foreground/70"> Recovery risk before Saturday's game.</span>
                  </p>
                </div>
              </div>
              <p className="mt-5 text-xs text-foreground/45">
                Anomalies surface to your inbox before they become problems — every flag
                explains what changed, why it matters, and what to do.
              </p>
            </IntelCard>

            {/* 3 — Sunday report card */}
            <IntelCard>
              <IntelEyebrow text="Sunday Report" />
              <p className="text-sm font-bold text-foreground">
                Team protein compliance up 12% — best week this season.
              </p>
              <div className="mt-5 flex items-end gap-2 h-24">
                {reportBars.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full">
                    <div
                      className={`rounded-t-[4px] ${
                        i === reportBars.length - 1
                          ? 'bg-gradient-to-t from-primary to-accent-green'
                          : 'bg-white/[0.12]'
                      }`}
                      style={{ height: `${v}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] font-semibold text-foreground/30 uppercase tracking-wider">
                <span>Mon</span>
                <span>Sun</span>
              </div>
              <p className="mt-4 text-xs text-foreground/45">
                A full analytics report card lands every Sunday morning — team-wide for
                staff, personal for every athlete.
              </p>
            </IntelCard>

            {/* 4 — Macro autopilot */}
            <IntelCard>
              <div className="flex items-center justify-between">
                <IntelEyebrow text="Macro Autopilot" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-primary/80 border border-primary/25 rounded-full px-2.5 py-1 mb-4">
                  AI Recommended
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight gradient-text tabular-nums">
                  3,490
                </span>
                <span className="text-sm font-semibold text-foreground/60">cal / day</span>
              </div>
              <p className="mt-1 text-xs text-foreground/50">Quarterback · High school · In-season</p>
              <div className="mt-4 flex gap-2.5">
                {[
                  ['Protein', '196g'],
                  ['Carbs', '452g'],
                  ['Fat', '97g'],
                ].map(([label, v]) => (
                  <span
                    key={label}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-foreground/80"
                  >
                    {label} <span className="text-primary font-bold">{v}</span>
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs text-foreground/45">
                Position- and league-aware targets for the whole roster, one tap to apply —
                tuned per athlete from their real bodyweight and training load.
              </p>
            </IntelCard>
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
