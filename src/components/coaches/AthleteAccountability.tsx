import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ClipboardCheck, Flame, ShieldCheck, EyeOff } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

// ---------------------------------------------------------------------------
// AthleteAccountability — replaces the old reach map. The /coaches audience is
// COACHES, so this proves the thing they actually care about: their athletes
// will follow through, and RYZN shows them who didn't. Big count-up stats on
// scroll + a coach-facing line + three supporting proof chips.
// ---------------------------------------------------------------------------

type Stat = { value: number; suffix: string; label: string; sub: string };

const STATS: Stat[] = [
  { value: 94, suffix: '%', label: 'of assigned macros logged', sub: 'Athletes hit what you set.' },
  { value: 17, suffix: ' days', label: 'average logging streak', sub: 'Consistency, not one-offs.' },
  { value: 100, suffix: '%', label: 'of workouts auto-verified', sub: 'No self-reported guesswork.' },
];

const SUPPORTS = [
  { icon: ClipboardCheck, text: 'Every meal and lift logs straight to your dashboard.' },
  { icon: ShieldCheck, text: 'Auto-verified — the numbers you see are the numbers they did.' },
  { icon: EyeOff, text: 'At-risk athletes get flagged before they fall off.' },
];

// Count up from 0 → value once the stat scrolls into view.
function useCountUp(target: number, run: boolean, dur = 1100) {
  const [n, setN] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (!run) return;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current as number);
  }, [run, target, dur]);
  return n;
}

const StatBlock = ({ stat, run }: { stat: Stat; run: boolean }) => {
  const n = useCountUp(stat.value, run);
  return (
    <motion.div
      variants={fadeUpVariant}
      className="flex-1 min-w-[180px] text-center px-4 py-6"
    >
      <div className="font-extrabold tabular-nums gradient-text leading-none tracking-[-0.03em] text-[clamp(2.6rem,6vw,4rem)]">
        {n}
        <span className="text-[0.55em] font-bold align-baseline">{stat.suffix}</span>
      </div>
      <div className="mt-3 text-foreground font-semibold text-sm">{stat.label}</div>
      <div className="mt-1 text-foreground/45 text-[13px]">{stat.sub}</div>
    </motion.div>
  );
};

const AthleteAccountability = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, margin: '-80px' });

  return (
    <section className="relative py-20 lg:py-28">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          className="text-center max-w-[720px] mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
          >
            The proof
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          >
            Athletes actually follow through.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-4 text-foreground/70 text-lg">
            You assign the plan. RYZN makes sure they do it — logs it, verifies it, and
            shows you exactly who's on track and who slipped. No more chasing check-ins.
          </motion.p>
        </motion.div>

        <motion.div
          ref={statsRef}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 rounded-[24px] p-5 lg:p-8 bg-[rgba(255,255,255,0.03)] border border-white/[0.07] backdrop-blur-sm"
          style={{
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 60px -30px rgba(0,0,0,0.7)',
          }}
        >
          <div className="flex flex-wrap items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
            {STATS.map((s) => (
              <StatBlock key={s.label} stat={s} run={inView} />
            ))}
          </div>

          <motion.div
            variants={fadeUpVariant}
            className="mt-2 pt-6 border-t border-white/[0.06] flex items-start gap-3 justify-center text-center max-w-[640px] mx-auto"
          >
            <Flame size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-foreground/80 text-[15px] leading-relaxed">
              <span className="text-foreground font-semibold">Your athletes stay accountable
              between sessions</span> — and you get the receipts, not their word for it.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {SUPPORTS.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.text}
                variants={fadeUpVariant}
                className="flex items-start gap-3 rounded-[16px] p-4 bg-[rgba(255,255,255,0.02)] border border-white/[0.05]"
              >
                <span
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'hsl(var(--primary) / 0.12)' }}
                >
                  <Icon size={17} className="text-primary" />
                </span>
                <p className="text-foreground/65 text-[13.5px] leading-snug">{s.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AthleteAccountability;
