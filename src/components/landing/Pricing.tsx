import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const included = [
  'Real-time muscle map visualization',
  'AI progression engine & plateau detection',
  '200+ exercises with activation data',
  'All 5 workout split programs',
  'Weekly challenges & badge system',
  'Shareable post-workout cards',
  'Progress photos & workout history',
  'Apple Health & iCloud sync',
  'Full recipes & articles library',
  'Custom themes & settings',
];

const Pricing = () => {
  return (
    <section id="pricing" className="relative bg-bg-primary py-20 lg:py-32">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34,197,94,0.12) 0%, transparent 70%)' }} />

      <motion.div
        className="relative z-10 max-w-[500px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
          PRICING
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          One plan. Everything included.
        </motion.h2>

        <motion.div
          variants={fadeUpVariant}
          className="mt-10 bg-bg-secondary rounded-2xl p-8 border border-primary/[0.15] text-center"
          style={{ boxShadow: '0 0 60px rgba(34,197,94,0.15)' }}
        >
          <span className="inline-block px-4 py-1 rounded-pill bg-gradient-to-r from-primary to-accent text-foreground text-xs font-medium tracking-widest uppercase mb-6">
            Most Popular
          </span>

          <div className="flex items-baseline justify-center gap-1">
            <span className="font-extrabold gradient-text" style={{ fontSize: '4rem' }}>$6.99</span>
            <span className="text-text-secondary text-xl">/ month</span>
          </div>

          <p className="text-text-secondary mt-2"><strong className="text-foreground">2-day free trial</strong> — no credit card required</p>
          <p className="text-text-tertiary text-xs mt-1">Billed monthly. Cancel anytime.</p>

          <div className="mt-8 text-left space-y-3">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-accent-green mt-0.5 font-bold">✓</span>
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>

          <button className="cta-primary w-full mt-8 py-4 rounded-[16px] bg-gradient-to-r from-primary to-accent text-foreground font-bold text-lg">
            <span className="shimmer" />
            <span className="relative z-10">Start My Free 2 Days</span>
          </button>

          <div className="mt-6 flex justify-center gap-6 flex-wrap">
            {[
              { icon: '🔒', label: 'Secure Apple Pay' },
              { icon: '↩️', label: 'Cancel Anytime' },
              { icon: '🎁', label: 'No Card Required' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-text-secondary text-xs font-medium tracking-wide uppercase">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Pricing;
