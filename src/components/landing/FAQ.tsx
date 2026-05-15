import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const faqs = [
  { q: "What's included with RYZN?", a: "Everything. Full access to the AI progression engine, muscle map, all workout programs, challenges, badges, shareable cards, recipes, articles, and all customization options. One plan, no tiers, no upsells." },
  { q: "Does RYZN work with Apple Health?", a: "Yes. RYZN syncs workouts to and from Apple Health, including calories burned, workout duration, and exercise records. Enable it in Settings." },
  { q: "Can I import my workouts from another app?", a: "Direct imports aren't available at launch, but you can rebuild your routines quickly using our exercise library. We're working on import support for major apps." },
  { q: "How does the progression engine decide what weight to suggest?", a: "It analyzes your last 6 sessions on each exercise, detects plateaus (reps dropping at the same weight), calculates your natural ceiling based on bodyweight and muscle group, and adjusts increments as you approach it. It also auto-accepts a new baseline if you consistently drop weight." },
  { q: "Is this available on Android?", a: "RYZN is a native iOS app built in SwiftUI and uses Apple-only integrations (HealthKit, iCloud, StoreKit). An Android version is not planned at this time." },
  { q: "What workout splits are included?", a: "Push/Pull/Legs (PPL), Upper/Lower, Arnold Split, Bro Split, and Full Body. Each has a full exercise list, day structure, and animated preview. You can also build completely custom splits from scratch." },
  { q: "How do the shareable workout cards work?", a: "After you finish any workout, RYZN automatically generates a branded summary card with your stats, PRs, and a muscle heatmap. You get multiple style options and can share directly to Instagram Stories, TikTok, iMessage, or anywhere via the iOS Share Sheet." },
  { q: "Is there a free trial?", a: "Yes. Every new subscription starts with a 3-day free trial. You're not charged until day 4 — if you cancel any time during the trial through your iPhone Settings → Apple ID → Subscriptions, you won't be billed at all." },
  { q: "Can I cancel my subscription?", a: "Yes. Cancel anytime through your iPhone's App Store subscriptions page. You keep access until the end of your current billing period." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-card py-20 lg:py-32 section-glow section-inset">
      <motion.div
        className="max-w-[720px] mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={fadeUpVariant} className="text-center mb-12">
          <span className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
          >
            Got questions? We've got answers.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariant}
              custom={i * 0.05}
              className="dmd-convex rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-foreground font-semibold text-sm pr-4">{faq.q}</span>
                <span
                  className="text-primary text-xl flex-shrink-0 transition-transform duration-300"
                  style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
