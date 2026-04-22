import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const tiers = [
  {
    name: "Base",
    price: "$3",
    period: "/ month",
    badge: null,
    description: "Everything you need to train smarter",
    cta: "Subscribe Now",
    features: [
      "Smart weight tracking with auto-increments",
      "Recommended food intake & nutrition data",
      "Real-time muscle map visualization",
      "100+ exercises with activation data",
      "All workout split programs",
      "Shareable post-workout cards",
      "Progress photos & workout history",
      "Apple Health & iCloud sync",
      "Social features (coming soon)",
    ],
    highlight: false,
    available: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/ month",
    badge: "COMING SOON",
    description: "Patent-pending calorie intelligence",
    cta: "Start Free Trial",
    features: [
      "Everything in Base, plus:",
      "Patent-pending calorie expenditure engine — 2-5x more accurate than Apple Watch & Fitbit",
      "AI camera food logging — 25 image scans/day",
      "70 voice/keyboard chats per day",
      "Advanced calorie & macro analytics",
      "Rewarded heart rate monitors (details TBA)",
      "Priority access to new features",
    ],
    highlight: true,
    available: true,
  },
  {
    name: "Trainer",
    price: "Pay-per-client",
    period: "",
    badge: "COMING SOON",
    description: "Built for fitness professionals",
    cta: "Apply Now",
    features: [
      "Dedicated trainer app (separate from client app)",
      "Connects directly to each client's RYZN app",
      "Trainer code system — clients get the app free",
      "Monitor client workouts & progress in real time",
      "Assign programs & track compliance",
      "Scalable per-client pricing",
    ],
    highlight: false,
    available: false,
  },
];

const Pricing = () => {
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
          Start with Base for free. Upgrade when you're ready.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="mt-12 grid md:grid-cols-3 gap-6 text-left"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              variants={fadeUpVariant}
              custom={i * 0.1}
              className={`relative dmd-convex rounded-2xl p-8 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1`}
              style={tier.highlight ? { boxShadow: '0 0 60px rgba(34, 197, 94,0.12), inset 0 1px 0 rgba(255,255,255,0.05)' } : {}}
            >
              {/* Spinning green border line for highlighted */}
              {tier.highlight && (
                <>
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl z-0"
                    style={{
                      background:
                        'conic-gradient(from var(--pro-angle, 0deg), rgba(34,197,94,0) 0deg, #22c55e 40deg, rgba(34,197,94,0) 80deg, rgba(34,197,94,0) 180deg, #22c55e 220deg, rgba(34,197,94,0) 260deg, rgba(34,197,94,0) 360deg)',
                      animation: 'pro-border-spin 4s linear infinite',
                    }}
                  />
                  <div className="pointer-events-none absolute inset-[1.5px] rounded-[14px] bg-card z-0" />
                </>
              )}

              {/* Badge */}
              <div className="relative z-10 flex flex-col flex-1">
              {tier.badge && (
                <span className="dmd-concave inline-block self-start px-3 py-1 rounded-pill text-primary text-[10px] font-semibold tracking-widest uppercase mb-4">
                  {tier.badge}
                </span>
              )}

              {/* Tier name */}
              <h3 className="font-bold text-foreground text-xl">RYZN {tier.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{tier.description}</p>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-1">
                <span className={`font-extrabold ${tier.highlight ? "gradient-text" : "text-foreground"}`} style={{ fontSize: tier.period ? '2.5rem' : '1.5rem' }}>
                  {tier.price}
                </span>
                {tier.period && <span className="text-muted-foreground text-base">{tier.period}</span>}
              </div>

              {tier.name === "Base" && (
                <p className="text-muted-foreground/60 text-xs mt-1">3-day free trial · No credit card required</p>
              )}

              {/* Features */}
              <div className="mt-6 space-y-3 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5 font-bold text-sm">✓</span>
                    <span className="text-foreground/80 text-sm leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={`w-full mt-8 py-3.5 rounded-[14px] font-bold text-sm transition-all duration-300 ${
                  tier.available
                    ? "bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary"
                    : "glass-card text-muted-foreground border border-primary/15 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {tier.cta}
              </button>
              </div>
            </motion.div>
          ))}
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
    </section>
  );
};

export default Pricing;
