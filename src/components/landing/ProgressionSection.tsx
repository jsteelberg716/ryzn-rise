import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUpVariant, staggerContainer, EASING } from '@/lib/animations';

const engineFeatures = [
  { icon: '📈', title: 'Plateau Detection', copy: "If reps drop at the same weight, RYZN holds steady — no fake progress." },
  { icon: '🧮', title: 'Natural Ceiling Calculation', copy: 'Per-muscle bodyweight multipliers with gender adjustment. Prevents unsafe loads.' },
  { icon: '📉', title: 'Diminishing Increments', copy: 'Weight jumps shrink as you approach your ceiling: 5 → 2.5 → 1 lb.' },
  { icon: '🔄', title: 'Auto-Deload Detection', copy: 'If you consistently drop weight across sessions, RYZN accepts the new baseline.' },
];

const chartData = [
  { week: 1, weight: 155 },
  { week: 2, weight: 160 },
  { week: 3, weight: 165 },
  { week: 4, weight: 165 },
  { week: 5, weight: 167.5 },
  { week: 6, weight: 170 },
  { week: 7, weight: 172.5 },
  { week: 8, weight: 165 },
];

function ProgressionChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const minW = 150, maxW = 175;
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * 360 + 20;
    const y = 180 - ((d.weight - minW) / (maxW - minW)) * 160 + 10;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L 380,190 L 20,190 Z`;

  return (
    <div ref={ref} className="glass-card rounded-[24px] p-6">
      <svg viewBox="0 0 400 200" className="w-full">
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="20" y1={10 + i * 45} x2="380" y2={10 + i * 45} stroke="rgba(34,197,94,0.06)" strokeWidth="1" />
        ))}
        <motion.path
          d={areaD}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
        <motion.path
          d={pathD}
          fill="none"
          stroke="#22C55E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
        />
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * 360 + 20;
          const y = 180 - ((d.weight - minW) / (maxW - minW)) * 160 + 10;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#22C55E"
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.25, duration: 0.3, ease: EASING.overshoot }}
            />
          );
        })}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-wrap gap-2 mt-4">
        <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.85 }}
          className="px-3 py-1 rounded-pill bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium border border-[#F59E0B]/20">
          Plateau detected
        </motion.span>
        <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 }}
          className="px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium border border-primary/20">
          Smaller increments
        </motion.span>
        <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 2.0 }}
          className="px-3 py-1 rounded-pill bg-accent-green/10 text-accent-green text-xs font-medium border border-accent-green/20">
          Auto-deload
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.2 }}
        className="mt-4 p-4 bg-background/50 rounded-2xl border border-primary/[0.1]"
      >
        <p className="text-xs text-muted-foreground">✦ Next set suggestion</p>
        <p className="text-foreground font-bold mt-1">Bench Press — Try 192.5 lbs × 8 reps</p>
        <p className="text-muted-foreground/50 text-xs mt-1">Based on last 6 sessions</p>
      </motion.div>
    </div>
  );
}

const ProgressionSection = () => {
  return (
    <section className="relative bg-background py-20 lg:py-32 section-glow">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          className="flex-1"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
            AI PROGRESSION ENGINE
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
          >
            Your personal trainer's logic. In your pocket.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-6 text-muted-foreground leading-relaxed text-[1.0625rem]">
            RYZN doesn't just suggest weights — it watches your performance
            across every session, detects plateaus before they stall your progress,
            and adjusts automatically. No more guessing. No more junk volume.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {engineFeatures.map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="text-foreground font-semibold mt-2">{f.title}</h4>
                <p className="text-muted-foreground text-sm mt-1">{f.copy}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            className="mt-6 glass-card rounded-[24px] p-6 border-l-4 !border-l-primary"
          >
            <p className="text-muted-foreground italic text-sm">
              "This isn't '+5 lbs every week.' RYZN's 4-rail safety system is the closest thing to real periodization science in any consumer fitness app."
            </p>
          </motion.div>
        </motion.div>

        <div className="flex-1 w-full">
          <ProgressionChart />
        </div>
      </div>
    </section>
  );
};

export default ProgressionSection;
