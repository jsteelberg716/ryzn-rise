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
    <div ref={ref} className="bg-bg-secondary rounded-[24px] p-6 border border-primary/[0.15]">
      <svg viewBox="0 0 400 200" className="w-full">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="20" y1={10 + i * 45} x2="380" y2={10 + i * 45} stroke="rgba(34,197,94,0.08)" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
        {/* Line */}
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
        {/* Dots */}
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
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Annotation badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85 }}
          className="px-3 py-1 rounded-pill bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-medium"
        >
          Plateau detected
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.1 }}
          className="px-3 py-1 rounded-pill bg-primary/20 text-primary text-xs font-medium"
        >
          Smaller increments
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.0 }}
          className="px-3 py-1 rounded-pill bg-accent-green/20 text-accent-green text-xs font-medium"
        >
          Auto-deload
        </motion.span>
      </div>

      {/* Next set suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.2 }}
        className="mt-4 p-4 bg-bg-tertiary rounded-2xl border border-primary/[0.15]"
      >
        <p className="text-xs text-text-secondary">✦ Next set suggestion</p>
        <p className="text-foreground font-bold mt-1">Bench Press — Try 192.5 lbs × 8 reps</p>
        <p className="text-text-tertiary text-xs mt-1">Based on last 6 sessions</p>
      </motion.div>
    </div>
  );
}

const ProgressionSection = () => {
  return (
    <section className="bg-bg-primary py-20 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        {/* Left - Copy */}
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
          <motion.p variants={fadeUpVariant} className="mt-6 text-text-secondary leading-relaxed text-[1.0625rem]">
            RYZN doesn't just suggest weights — it watches your performance
            across every session, detects plateaus before they stall your progress,
            and adjusts automatically. No more guessing. No more junk volume.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {engineFeatures.map((f) => (
              <div key={f.title} className="bg-bg-secondary rounded-2xl p-5 border border-primary/[0.15] hover:-translate-y-1 hover:border-primary/30 transition-all duration-200">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="text-foreground font-semibold mt-2">{f.title}</h4>
                <p className="text-text-secondary text-sm mt-1">{f.copy}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            className="mt-6 bg-bg-tertiary rounded-[24px] p-6 border-l-4 border-primary"
          >
            <p className="text-text-secondary italic text-sm">
              "This isn't '+5 lbs every week.' RYZN's 4-rail safety system is the closest thing to real periodization science in any consumer fitness app."
            </p>
          </motion.div>
        </motion.div>

        {/* Right - Chart Visual */}
        <div className="flex-1 w-full">
          <ProgressionChart />
        </div>
      </div>
    </section>
  );
};

export default ProgressionSection;
