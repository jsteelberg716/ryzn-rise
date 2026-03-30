import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const testimonials = [
  {
    stars: 5,
    quote: "The muscle map alone is worth the subscription. I didn't realize I was destroying my chest and barely touching my back until I saw it visualized. Changed my whole program.",
    name: 'Marcus T.',
    detail: '28, powerlifter',
    initials: 'MT',
  },
  {
    stars: 5,
    quote: "I've tried Strong, Hevy, and Fitbod. This is the only app that actually adjusts my weights based on how I'm performing — not just blindly adding 5 lbs. Finally, something intelligent.",
    name: 'Leila K.',
    detail: '23, competitive gym-goer',
    initials: 'LK',
  },
  {
    stars: 5,
    quote: "The share cards are insane. I post mine every Friday after leg day and multiple people have downloaded RYZN because they saw it in my Stories. Organic content on autopilot.",
    name: 'Devon R.',
    detail: '31, fitness content creator',
    initials: 'DR',
  },
];

const Testimonials = () => {
  return (
    <section className="relative bg-card py-20 lg:py-32 section-glow">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
          WHAT LIFTERS ARE SAYING
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Built for people who actually train.
        </motion.h2>
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.initials}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card rounded-2xl p-8 transition-all duration-300"
          >
            <div className="text-[#FFD700] text-sm mb-4">{'★'.repeat(t.stars)}</div>
            <p className="text-muted-foreground leading-relaxed text-sm italic">"{t.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent-green/20 flex items-center justify-center text-foreground font-bold text-sm border border-primary/20">
                {t.initials}
              </div>
              <div>
                <p className="text-foreground font-medium text-sm">— {t.name}</p>
                <p className="text-muted-foreground/50 text-xs">{t.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-muted-foreground text-sm mt-10">
        ★ 4.9 / 5 average from beta users | iOS App Store launch pending
      </p>
    </section>
  );
};

export default Testimonials;
