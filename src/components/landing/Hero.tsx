import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { staggerContainer, wordReveal, EASING, DURATION } from '@/lib/animations';
import PhoneMockup from './PhoneMockup';

const heroLines = [
  { text: 'Log ', highlight: 'smarter.' },
  { text: 'Lift ', highlight: 'heavier.' },
  { text: 'See ', highlight: 'every muscle.' },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const phoneY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), {
    stiffness: 100,
    damping: 25,
  });
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-screen pt-[120px] pb-20 overflow-hidden bg-bg-primary">
      <div className="hero-background" />
      <div className="hero-grid" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        {/* Left - Copy */}
        <motion.div
          className="flex-1 max-w-xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div
            variants={wordReveal}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-bg-tertiary border-l-2 border-primary mb-6"
          >
            <span className="text-xs font-medium tracking-widest uppercase text-text-secondary">
              ✦ iOS App — 2 Days Free
            </span>
          </motion.div>

          {/* Headline */}
          {heroLines.map((line, i) => (
            <motion.h1
              key={i}
              variants={wordReveal}
              className="font-extrabold leading-none tracking-[-0.03em]"
              style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
            >
              <span className="text-foreground">{line.text}</span>
              <span className="gradient-text">{line.highlight}</span>
            </motion.h1>
          ))}

          {/* Subheadline */}
          <motion.p
            variants={wordReveal}
            className="mt-6 text-text-secondary leading-relaxed"
            style={{ fontSize: '1.25rem' }}
          >
            RYZN is the workout app that thinks like a coach,
            logs like a pro, and looks good enough to share.
            Real-time muscle maps. AI progression. Built for iPhone.
          </motion.p>

          {/* CTA Group */}
          <motion.div variants={wordReveal} className="mt-8 flex flex-wrap gap-4 items-start">
            <div>
              <a href="#pricing" className="cta-primary inline-block px-8 py-4 rounded-pill bg-gradient-to-r from-primary to-accent text-foreground font-bold text-[1.0625rem]">
                <span className="shimmer" />
                <span className="relative z-10">Start 2-Day Free Trial</span>
              </a>
              <p className="text-text-tertiary text-xs mt-2 ml-1">No credit card. Cancel anytime.</p>
            </div>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-pill border border-primary/[0.15] text-text-secondary font-semibold text-[1.0625rem] hover:border-primary/40 hover:text-foreground transition-all duration-200"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={wordReveal} className="mt-8 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span className="text-[#FFD700]">★★★★★</span>
            <span><strong className="text-foreground">4.9 stars</strong> from 1,200+ lifters</span>
            <span className="hidden sm:inline">|</span>
            <span>Available on the <strong className="text-foreground">App Store</strong></span>
          </motion.div>
        </motion.div>

        {/* Right - Phone Mockup */}
        <motion.div
          className="flex-1 flex justify-center"
          style={{ y: phoneY, opacity: phoneOpacity }}
        >
          <div className="phone-float relative">
            {/* Glow behind phone */}
            <div
              className="absolute -inset-[30px] -z-10 blur-[30px]"
              style={{
                background: 'radial-gradient(ellipse 60% 70% at 50% 60%, rgba(34,197,94,0.35) 0%, rgba(255,107,107,0.15) 40%, transparent 70%)',
                animation: 'glowPulse 4s ease-in-out infinite alternate',
              }}
            />
            <PhoneMockup />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-tertiary" style={{ animation: 'bounceChevron 2s ease-in-out infinite' }}>
        <ChevronDown size={28} />
      </div>
    </section>
  );
};

export default Hero;
