import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';

const stats = [
  { value: 1, suffix: '%', label: 'Margin vs. Lab Calorimetry' },
  { value: 127, suffix: '%', label: 'Apple Watch Deviation (Same Test)' },
  { value: 2, suffix: 's', label: 'From NFC Tap to Live Tracking' },
  { value: 24, suffix: '/7', label: 'AI Coaching in Your Pocket' },
];

// Card "pop": starts lifted toward the viewer, then presses DOWN into the
// screen and settles flat. transformStyle preserve-3d + a parent perspective
// give the pushed-into-the-surface feel.
const popCard = {
  hidden: { opacity: 0, y: -34, scale: 1.06, rotateX: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: 'spring', stiffness: 260, damping: 18, delay: i * 0.12 },
  }),
};

function AnimatedCounter({
  target,
  decimals = 0,
  suffix = '',
  delay = 0,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // Hold the number hidden until the card has finished popping in.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, delay]);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span
      ref={ref}
      style={{
        opacity: started ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      {formatted}
      {suffix}
    </span>
  );
}

const StatsBar = () => {
  return (
    <section className="relative bg-background py-12 section-glow" id="stats">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8"
        style={{ perspective: 1000 }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={popCard}
            custom={i}
            style={{ transformStyle: 'preserve-3d' }}
            className="dmd-concave rounded-2xl px-6 py-6 text-center relative"
          >
            <div className="font-bold gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              <AnimatedCounter
                target={stat.value}
                decimals={stat.decimals}
                suffix={stat.suffix}
                delay={0.45 + i * 0.12}
              />
            </div>
            <p className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsBar;
