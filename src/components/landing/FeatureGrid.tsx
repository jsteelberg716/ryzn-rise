import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const features = [
  { icon: '📊', name: 'Real-Time Muscle Map', desc: 'Front & back body, 16 muscle groups, live color coding' },
  { icon: '🤖', name: 'AI Progression Engine', desc: '4-rail safety system that thinks like a coach' },
  { icon: '⏱️', name: 'Smart Rest Timer', desc: 'Immersive or compact mode with haptic countdown' },
  { icon: '🏋️', name: '150+ Exercises', desc: 'Full library with muscle activation data and instructions' },
  { icon: '📅', name: 'Workout Programs', desc: '5 template splits + custom split builder' },
  { icon: '🔥', name: 'Streak Tracker', desc: 'Consecutive training days with milestone celebrations' },
  { icon: '🎯', name: 'Goals System', desc: '5 goal types: strength, consistency, volume, weight, streak' },
  { icon: '🏆', name: '26 Badges', desc: 'Across 5 categories, unlocked by real achievements' },
  { icon: '📆', name: 'Weekly Challenges', desc: '200 randomized challenges, refreshed every week' },
  { icon: '📸', name: 'Shareable Cards', desc: 'Beautiful post-workout summaries designed to be shared' },
  { icon: '📷', name: 'Progress Photos', desc: 'Before/after transformation photos with timestamps' },
  { icon: '📈', name: '12-Week Heatmap', desc: 'Visual training calendar showing consistency patterns' },
  { icon: '🍽️', name: '100+ Recipes', desc: 'Full macros, ingredients, and meal-type organization' },
  { icon: '📖', name: '50+ Articles', desc: 'Training, recovery, nutrition, technique, and mindset' },
  { icon: '🍎', name: 'Apple Health Sync', desc: 'Reads and writes workouts to Apple HealthKit' },
  { icon: '☁️', name: 'iCloud Backup', desc: 'Your data synced and backed up automatically' },
  { icon: '🎨', name: 'Custom Themes', desc: 'Dark/light mode, 12 accent colors, font styles' },
  { icon: '📤', name: 'PDF Export', desc: 'Export full workout history as a shareable PDF' },
];

const FeatureGrid = () => {
  return (
    <section className="relative bg-card py-20 lg:py-32 section-glow section-inset">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
          EVERYTHING INCLUDED
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Built for lifters who take training seriously.
        </motion.h2>
        <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground mx-auto max-w-[580px] text-[1.0625rem]">
          From your first session to your thousandth — every tool you need
          is here, in one clean native iOS app.
        </motion.p>
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-6 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.05, duration: 0.4 }}
            className="dmd-convex rounded-2xl p-5 transition-all duration-300 group"
          >
            <span className="text-2xl group-hover:scale-110 inline-block transition-transform duration-200">{f.icon}</span>
            <h3 className="text-foreground font-semibold mt-2">{f.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid;
