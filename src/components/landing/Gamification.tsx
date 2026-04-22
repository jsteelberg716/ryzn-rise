import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const badgeCategories = [
  { icon: '🔥', name: 'Streak Milestones', count: 6 },
  { icon: '💪', name: 'Workout Count', count: 5 },
  { icon: '🏋️', name: 'Strength Records', count: 5 },
  { icon: '📦', name: 'Volume Records', count: 5 },
  { icon: '⭐', name: 'Lifetime Milestones', count: 5 },
];

const Gamification = () => {
  return (
    <section className="relative bg-background py-20 lg:py-32 section-glow">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center mb-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
          GAMIFICATION & ENGAGEMENT
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Always something to chase.
        </motion.h2>
      </motion.div>

      {/* Weekly Challenges */}
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 mb-20">
        <motion.div className="flex-1" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h3 variants={fadeUpVariant} className="text-foreground font-bold text-xl lg:text-2xl">200 Weekly Challenges. Refreshed Every Monday.</motion.h3>
          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground leading-relaxed">
            A new challenge every week keeps your training fresh and focused. Volume goals, consistency targets, personal record attempts — always something that pushes you just past where you are.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-4 space-y-1 text-muted-foreground text-sm">
            <p>✦ 13 challenge types</p>
            <p>✦ Randomized weekly rotation</p>
            <p>✦ Complete challenges to unlock badge rewards and subscription discounts</p>
          </motion.div>
        </motion.div>
        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="dmd-convex rounded-[24px] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-foreground font-bold">This Week's Challenge</span>
              <span className="text-muted-foreground/50 text-xs">6d 14h remaining</span>
            </div>
            <p className="text-primary font-bold text-lg">VOLUME KING</p>
            <p className="text-muted-foreground text-sm mt-1">Hit 50,000 lbs of total volume this week</p>
            <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent-green"
                initial={{ width: 0 }}
                whileInView={{ width: '68%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="text-muted-foreground text-xs mt-2">68% complete · 34,000 / 50,000 lbs</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm">🎁</span>
              <span className="text-muted-foreground text-xs">Complete for 10% off your next month</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Streak Tracker */}
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 mb-20">
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <span className="text-5xl" style={{ animation: 'flameFlicker 1.5s ease-in-out infinite', display: 'inline-block' }}>🔥</span>
            <p className="font-extrabold gradient-text mt-2" style={{ fontSize: '5rem', lineHeight: 1 }}>47</p>
            <p className="text-muted-foreground text-sm mt-2">consecutive days</p>
          </div>
        </motion.div>
        <motion.div className="flex-1" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h3 variants={fadeUpVariant} className="text-foreground font-bold text-xl lg:text-2xl">Keep the streak alive.</motion.h3>
          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground leading-relaxed">
            Your consecutive training days are tracked and celebrated. Hit milestones — 7 days, 30 days, 100 days — and unlock streak badges. Miss a day and the app sends an encouraging nudge, not a guilt trip.
          </motion.p>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div
        className="max-w-[1200px] mx-auto px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h3 variants={fadeUpVariant} className="text-foreground font-bold text-xl text-center mb-8">
          26 achievements. 5 categories. All earned — never bought.
        </motion.h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badgeCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={fadeUpVariant}
              custom={i * 0.08}
              className="dmd-convex rounded-[24px] p-5 text-center transition-all duration-300"
            >
              <span className="text-3xl">{cat.icon}</span>
              <p className="text-foreground font-semibold text-sm mt-2">{cat.name}</p>
              <p className="text-muted-foreground/50 text-xs mt-1">{cat.count} badges</p>
              <div className="flex justify-center gap-1.5 mt-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className={`w-6 h-6 rounded-full ${j < 3 ? 'bg-primary/20 border border-primary/30' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Gamification;
