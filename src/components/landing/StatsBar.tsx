import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const stats = [
  { value: 10000, suffix: '+', label: 'Workouts Logged' },
  { value: 4.9, suffix: '★', label: 'App Store Rating', decimals: 1 },
  { value: 200, suffix: '+', label: 'Exercises in Library' },
  { value: 14, suffix: ' Days', label: 'Free Trial, No Card' },
];

function AnimatedCounter({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

const StatsBar = () => {
  return (
    <section className="bg-bg-secondary py-12" id="stats">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUpVariant}
            custom={i * 0.1}
            className="text-center relative"
          >
            {/* Divider */}
            {i > 0 && (
              <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-primary/[0.15]" />
            )}
            <div className="font-bold gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              <AnimatedCounter target={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </div>
            <p className="text-text-tertiary text-xs font-medium tracking-widest uppercase mt-2">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default StatsBar;
