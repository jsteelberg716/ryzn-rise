import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FlaskConical, Zap, TrendingDown, ArrowRight, Flame, Gauge, Dumbbell, Heart, Sparkles } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

/* ---------- Data pulled from the 10-user validation study ---------- */

const workouts = [
  {
    id: 'heavy',
    label: 'Heavy Lifter',
    icon: Dumbbell,
    meta: '72 min · 66,018 lbs volume · 125 avg HR / 155 peak',
    ryzn: 426,
    fitbit: 595,
    apple: 685,
    whoop: 786,
  },
  {
    id: 'cross',
    label: 'CrossFit',
    icon: Heart,
    meta: '40 min · 16,167 lbs volume · 145 avg HR / 172 peak',
    ryzn: 153,
    fitbit: 377,
    apple: 434,
    whoop: 613,
  },
  {
    id: 'power',
    label: 'Powerlifter',
    icon: Sparkles,
    meta: '90 min · 17,772 lbs volume · 115 avg HR / 160 peak',
    ryzn: 206,
    fitbit: 678,
    apple: 781,
    whoop: 896,
  },
] as const;

/* ---------- Animated counter (RAF-based, no deps) ---------- */

const AnimatedNumber = ({ value, duration = 900 }: { value: number; duration?: number }) => {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef<number>();

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const startAt = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      // ease-out cubic — feels like [0.16, 1, 0.3, 1]
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display.toLocaleString()}</>;
};

/* ---------- Section ---------- */

const CalorieEngine = () => {
  const [activeId, setActiveId] = useState<(typeof workouts)[number]['id']>('heavy');
  const active = workouts.find((w) => w.id === activeId)!;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const competitors = [
    { name: 'Fitbit', value: active.fitbit },
    { name: 'Apple Watch', value: active.apple },
    { name: 'Whoop', value: active.whoop },
  ];

  return (
    <section
      ref={sectionRef}
      id="calorie-engine"
      {...{ 'data-anchor': 'how-it-works' }}
      className="relative bg-background py-28 md:py-32 px-6 section-glow overflow-hidden"
    >
      {/* Preserve existing #how-it-works anchors from Hero + Navbar */}
      <span id="how-it-works" className="absolute -top-16" aria-hidden="true" />
      {/* Soft aurora */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute inset-0 pointer-events-none opacity-60"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 25%, rgba(34, 197, 94,0.10), transparent 70%)',
          }}
        />
      </motion.div>

      <div className="relative max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-[760px] mx-auto text-center"
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-accent-green"
          >
            THE CALORIE ENGINE
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
          >
            Calories, <span className="gradient-text">actually calculated.</span>
          </motion.h2>
          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-muted-foreground leading-relaxed"
            style={{ fontSize: '1.125rem' }}
          >
            Every other fitness app guesses calories from heart rate alone. RYZN measures the
            actual mechanical work —{' '}
            <strong className="text-foreground">weight × range of motion × muscular efficiency</strong>{' '}
            — and converts it to energy using first-principles thermodynamics.
          </motion.p>

          <motion.div
            variants={fadeUpVariant}
            className="mt-7 inline-flex items-center gap-3 dmd-concave rounded-pill px-5 py-2.5 border-l-2"
            style={{ borderLeftColor: 'hsl(var(--accent-green))' }}
          >
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-muted-foreground text-sm">
              <strong className="text-foreground">Patent Pending</strong>
              <span className="mx-2 text-muted-foreground/40">·</span>
              USPTO #64/021,144
              <span className="mx-2 text-muted-foreground/40">·</span>
              Validated within 1% of lab calorimetry
            </span>
          </motion.div>
        </motion.div>

        {/* Interactive card */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-14 dmd-convex rounded-[28px] p-5 sm:p-8 md:p-10 relative overflow-hidden"
        >
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.18), transparent 70%)' }}
          />

          {/* Workout selector */}
          <div className="relative flex flex-wrap gap-2 justify-center mb-2">
            {workouts.map((w) => {
              const Icon = w.icon;
              const isActive = activeId === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setActiveId(w.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent-green text-foreground shadow-[0_4px_20px_rgba(34, 197, 94,0.3)]'
                      : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/25'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon size={14} />
                  {w.label}
                </button>
              );
            })}
          </div>

          {/* Workout meta */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center text-xs text-muted-foreground/70 mb-8 font-mono tracking-tight"
            >
              {active.meta}
            </motion.p>
          </AnimatePresence>

          {/* RYZN (large) + 3 competitors (stacked) */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RYZN — ground truth card */}
            <div className="dmd-convex rounded-[22px] p-6 md:p-8 relative overflow-hidden">
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(34, 197, 94,0.35), transparent 70%)',
                }}
              />
              <div className="relative flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent-green">
                  RYZN Physics
                </span>
                <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold text-accent-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                  GROUND TRUTH
                </span>
              </div>
              <div className="relative flex items-baseline gap-2">
                <span
                  className="leading-none font-extrabold text-accent-green tabular-nums tracking-tight"
                  style={{ fontSize: 'clamp(3.5rem, 9vw, 6rem)' }}
                >
                  <AnimatedNumber value={active.ryzn} />
                </span>
                <span className="text-xl text-accent-green/70 font-medium">kcal</span>
              </div>
              <p className="relative text-sm text-muted-foreground mt-4 leading-relaxed">
                Computed from mechanical work, muscular efficiency (η = 0.22), HR strain factor, and
                EPOC afterburn. Validated within 1% of lab calorimetry.
              </p>
            </div>

            {/* Competitors */}
            <div className="grid grid-rows-3 gap-3">
              {competitors.map((c) => {
                const mult = c.value / active.ryzn;
                return (
                  <div
                    key={c.name}
                    className="dmd-convex rounded-[18px] px-4 sm:px-5 py-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
                        {c.name}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-3xl md:text-4xl font-extrabold text-foreground/55 tabular-nums tracking-tight">
                          <AnimatedNumber value={c.value} />
                        </span>
                        <span className="text-xs text-muted-foreground/50 font-medium">kcal</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <div className="text-sm font-extrabold text-accent tabular-nums">
                        {mult.toFixed(1)}×
                      </div>
                      <div className="text-[0.625rem] text-accent/70 uppercase tracking-wider font-semibold">
                        inflated
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formula reveal */}
          <div className="relative mt-8 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-primary/[0.08]">
            <div className="flex items-center gap-2 mb-3">
              <Gauge size={14} className="text-accent-green" />
              <span className="text-[0.6875rem] font-semibold uppercase tracking-widest text-accent-green">
                Under the hood — RYZN's master formula
              </span>
            </div>
            <div className="font-mono text-base md:text-lg text-foreground/90 overflow-x-auto whitespace-nowrap pb-1">
              E ={' '}
              <span className="text-accent-green">[</span>
              (1/η) × Σ(V<sub>i</sub> × g × D<sub>i</sub>) / 4184 × f(HR)
              <span className="text-accent-green">]</span> × (1 + EPOC)
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="text-muted-foreground">
                <code className="text-accent-green font-mono">η = 0.22</code> muscular efficiency
              </div>
              <div className="text-muted-foreground">
                <code className="text-accent-green font-mono">V × D</code> weight × ROM
              </div>
              <div className="text-muted-foreground">
                <code className="text-accent-green font-mono">f(HR)</code> strain factor
              </div>
              <div className="text-muted-foreground">
                <code className="text-accent-green font-mono">EPOC</code> afterburn
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pillars */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: TrendingDown,
              value: '3.2×',
              label: 'Avg overestimation',
              desc: 'How wildly Apple Watch, Fitbit, and Whoop inflate resistance-training calories.',
            },
            {
              icon: Flame,
              value: '168',
              label: 'Phantom kcal / session',
              desc: 'Average overcount that silently sabotages cuts, bulks, and body recomp goals.',
            },
            {
              icon: Zap,
              value: '~10 lbs',
              label: 'Annual fat gain',
              desc: 'Realistic weight gain over a year from trusting HR-only calorie estimates.',
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariant}
              className="dmd-convex rounded-[20px] p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <p.icon className="text-accent-green mb-3" size={18} />
              <div
                className="font-extrabold tracking-tight text-foreground"
                style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', lineHeight: 1 }}
              >
                {p.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-medium">
                {p.label}
              </div>
              <p className="text-sm text-muted-foreground/80 mt-3 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/validation"
            className="cta-validation inline-flex items-center gap-2 px-8 py-4 rounded-pill text-foreground font-bold text-[1.0625rem]"
            style={{
              background: 'linear-gradient(135deg, hsl(145 72% 50%) 0%, hsl(172 63% 55%) 100%)',
            }}
          >
            <FlaskConical size={18} />
            See the full validation study
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CalorieEngine;
