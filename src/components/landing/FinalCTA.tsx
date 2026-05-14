import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznIconLogo from '@/components/RyznIconLogo';

const FinalCTA = () => {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, hsl(240 33% 4%) 0%, hsl(145 30% 6%) 50%, hsl(240 33% 4%) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34, 197, 94,0.15) 0%, transparent 70%)' }} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(34, 197, 94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, transparent 70%)',
      }} />

      <motion.div
        className="relative z-10 max-w-[600px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={fadeUpVariant} className="mb-8 flex justify-center">
          <div className="p-4 rounded-2xl dmd-convex">
            <RyznIconLogo size={48} />
          </div>
        </motion.div>

        <motion.h2
          variants={fadeUpVariant}
          className="font-extrabold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05 }}
        >
          Your first PR is on us.
        </motion.h2>

        <motion.p variants={fadeUpVariant} className="mt-6 text-muted-foreground text-lg leading-relaxed">
          The fitness app built for iPhone, not ported to it.<br />
          Train with intelligence — starting today.
        </motion.p>

        <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="cta-primary cta-pulse inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background font-bold"
          >
            <svg className="relative z-10 w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
            </svg>
            <span className="relative z-10 text-left leading-tight">
              <span className="text-[0.625rem] block opacity-70">Download on the</span>
              <span className="text-sm">App Store</span>
            </span>
          </a>
          <a href="#how-it-works" className="px-8 py-4 rounded-2xl border border-primary/[0.15] text-muted-foreground font-semibold hover:text-foreground hover:border-primary/40 transition-all duration-200">
            Learn More
          </a>
        </motion.div>

        <motion.p variants={fadeUpVariant} className="mt-8 text-muted-foreground/50 text-xs">
          Available for iPhone · iOS 15.0+ · $10/month · Cancel anytime
        </motion.p>
      </motion.div>
    </section>
  );
};

export default FinalCTA;
