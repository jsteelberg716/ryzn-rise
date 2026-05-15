import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const proFeatures = [
  "Smart weight tracking with auto-increments",
  "Real-time muscle map visualization",
  "150+ exercises with activation data",
  "All workout split programs",
  "Shareable post-workout cards",
  "Progress photos & workout history",
  "Apple Health & iCloud sync",
  "Patent-pending calorie expenditure engine — measures mechanical work, not heart-rate proxy",
  "AI camera food logging — 25 image scans/day",
  "70 voice/keyboard chats per day",
  "Advanced calorie & macro analytics",
  "Priority access to new features",
];

const coachTier = {
  name: "Coach",
  price: "TBA",
  period: "",
  badge: "COMING SOON",
  description: "AI that connects how you live to how you feel.",
  cta: "Learn More",
  features: [
    "Pattern-recognition AI for whole-body health",
    "Connects mental health to physical signals",
    "Spots habits hurting performance & recovery",
    "Personalized to your baseline — not averages",
  ],
};

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const proPrice = annual ? "$80" : "$10";
  const proPeriod = annual ? "/ year" : "/ month";
  const proSubtext = annual ? "Just $6.67/mo — save 33%" : "Billed monthly";

  return (
    <section id="pricing" className="relative bg-background py-20 lg:py-32">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 197, 94,0.08) 0%, transparent 70%)' }} />

      <motion.div
        className="relative z-10 max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
          PRICING
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Simple plans that grow with you.
        </motion.h2>
        <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground text-lg max-w-[600px] mx-auto">
          One plan. Everything included. Cancel anytime.
        </motion.p>

        {/* Monthly / Yearly toggle */}
        <motion.div variants={fadeUpVariant} className="mt-8 inline-flex items-center gap-1 dmd-concave rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
              !annual ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
              annual ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            YEARLY
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${annual ? 'bg-background/20 text-background' : 'bg-primary/20 text-primary'}`}>
              SAVE 33%
            </span>
          </button>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="mt-12 grid md:grid-cols-2 gap-6 text-left max-w-[860px] mx-auto"
        >
          {/* Pro card */}
          <motion.div
            variants={fadeUpVariant}
            className="relative dmd-convex rounded-2xl p-8 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: '0 0 60px rgba(34, 197, 94,0.12), inset 0 1px 0 rgba(255,255,255,0.05)' }}
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl z-0"
              style={{
                background:
                  'conic-gradient(from var(--pro-angle, 0deg), rgba(34,197,94,0) 0deg, #22c55e 40deg, rgba(34,197,94,0) 80deg, rgba(34,197,94,0) 180deg, #22c55e 220deg, rgba(34,197,94,0) 260deg, rgba(34,197,94,0) 360deg)',
                animation: 'pro-border-spin 4s linear infinite',
              }}
            />
            <div className="pointer-events-none absolute inset-[1.5px] rounded-[14px] bg-card z-0" />

            <div className="relative z-10 flex flex-col flex-1">
              <span className="dmd-concave inline-block self-start px-3 py-1 rounded-pill text-primary text-[10px] font-semibold tracking-widest uppercase mb-4">
                PRO
              </span>
              <h3 className="font-bold text-foreground text-xl">RYZN Pro</h3>
              <p className="text-muted-foreground text-sm mt-1">Everything, unlocked.</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-extrabold gradient-text" style={{ fontSize: '2.5rem' }}>
                  {proPrice}
                </span>
                <span className="text-muted-foreground text-base">{proPeriod}</span>
              </div>
              <p className="text-muted-foreground/60 text-xs mt-1">{proSubtext} · Cancel anytime</p>
              <p className="text-primary text-xs font-semibold mt-2">
                Start with a 3-day free trial — no charge until day 4.
              </p>

              <div className="mt-6 space-y-3 flex-1">
                {proFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5 font-bold text-sm">✓</span>
                    <span className="text-foreground/80 text-sm leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3.5 rounded-[14px] font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300">
                Get RYZN
              </button>
            </div>
          </motion.div>

          {/* Coach card (coming soon) */}
          <motion.div
            variants={fadeUpVariant}
            className="relative dmd-convex rounded-2xl p-8 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            <span className="dmd-concave inline-block self-start px-3 py-1 rounded-pill text-primary text-[10px] font-semibold tracking-widest uppercase mb-4">
              {coachTier.badge}
            </span>
            <h3 className="font-bold text-foreground text-xl">RYZN {coachTier.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{coachTier.description}</p>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-extrabold text-foreground" style={{ fontSize: '1.5rem' }}>
                {coachTier.price}
              </span>
            </div>

            <div className="mt-6 space-y-3 flex-1">
              {coachTier.features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 font-bold text-sm">✓</span>
                  <span className="text-foreground/80 text-sm leading-relaxed">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCoachOpen(true)}
              className="w-full mt-8 py-3.5 rounded-[14px] font-bold text-sm glass-card text-muted-foreground border border-primary/15 hover:border-primary/30 hover:text-foreground transition-all duration-300"
            >
              {coachTier.cta}
            </button>
          </motion.div>
        </motion.div>

        {/* Trust badges */}
        <motion.div variants={fadeUpVariant} className="mt-10 flex justify-center gap-8 flex-wrap">
          {[
            { icon: '🔒', label: 'Secure Apple Pay' },
            { icon: '↩️', label: 'Cancel Anytime' },
            { icon: '🎁', label: 'No Card for Trial' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-1.5 text-muted-foreground/50 text-xs font-medium tracking-wide uppercase">
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* RYZN Coach — Learn More modal */}
      <AnimatePresence>
        {coachOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setCoachOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[560px] dmd-convex rounded-[24px] p-8 lg:p-10 overflow-hidden"
            >
              {/* Aurora */}
              <div
                className="absolute inset-0 -z-10 pointer-events-none opacity-60"
                style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,197,94,0.18), transparent 70%)' }}
              />

              <button
                aria-label="Close"
                onClick={() => setCoachOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
              >
                <X size={18} />
              </button>

              <span className="dmd-concave inline-block px-3 py-1 rounded-pill text-primary text-[10px] font-semibold tracking-widest uppercase mb-4">
                COMING SOON
              </span>
              <h3 className="font-bold tracking-tight text-foreground" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}>
                RYZN <span className="gradient-text">Coach</span>
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                An AI coach that uses pattern recognition across your daily signals to find the
                habits silently shaping how you feel — and helps you fix them.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { t: 'Whole-body pattern recognition', d: 'Heart rate, sleep, hydration, alcohol, screentime, food, training — all watched together.' },
                  { t: 'Mental health via physical signals', d: 'Targets the root cause in your body before it shows up in your head.' },
                  { t: 'Habit-level diagnosis', d: 'Surfaces the daily behaviors quietly draining your recovery and mood.' },
                  { t: 'Personalized to your baseline', d: 'Compares you to YOU, not population averages. Built on your RYZN history.' },
                ].map((f) => (
                  <div key={f.t} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5 font-bold text-sm flex-shrink-0">●</span>
                    <div>
                      <p className="text-foreground/90 text-sm font-semibold leading-snug">{f.t}</p>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 rounded-[12px] bg-card/50 border border-primary/15 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button className="px-6 py-3 rounded-[12px] bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap">
                  Join waitlist
                </button>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground/60">
                We'll only email you when RYZN Coach is ready. No spam, ever.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Pricing;
