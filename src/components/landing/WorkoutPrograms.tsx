import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const splits = [
  { name: 'Push/Pull/Legs (PPL)', subtitle: 'The classic', gradient: 'linear-gradient(135deg, #6C63FF, #9B59B6)', tags: ['6 days/week', 'Intermediate', 'Strength + Size'] },
  { name: 'Upper/Lower', subtitle: 'Efficient & effective', gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', tags: ['4 days/week', 'Beginner+', 'Balanced'] },
  { name: 'Arnold Split', subtitle: 'Old school, proven', gradient: 'linear-gradient(135deg, #45B7D1, #0096FF)', tags: ['6 days/week', 'Advanced', 'Volume'] },
  { name: 'Bro Split', subtitle: 'One muscle at a time', gradient: 'linear-gradient(135deg, #4ECDC4, #2ECC71)', tags: ['5 days/week', 'All levels', 'Classic'] },
  { name: 'Full Body', subtitle: 'Maximize frequency', gradient: 'linear-gradient(135deg, #F7971E, #FFD200)', tags: ['3 days/week', 'All levels', 'Efficient'] },
];

const WorkoutPrograms = () => {
  return (
    <section className="bg-bg-secondary py-20 lg:py-32 overflow-hidden">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
          WORKOUT PROGRAMS & SPLITS
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Your program. Your schedule. Your rules.
        </motion.h2>
        <motion.p variants={fadeUpVariant} className="mt-4 text-text-secondary mx-auto max-w-[600px] text-[1.0625rem]">
          Choose from 5 expert-designed split programs or build your own from scratch.
          Map workout days to your week. RYZN handles the rest.
        </motion.p>
      </motion.div>

      {/* Horizontal scroll cards */}
      <div className="mt-12 flex gap-6 overflow-x-auto hide-scrollbar px-6 snap-x snap-mandatory pb-4" style={{ scrollPaddingLeft: 'max(1.5rem, calc((100vw - 1200px) / 2 + 1.5rem))' }}>
        {splits.map((split, i) => (
          <motion.div
            key={split.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex-shrink-0 w-[280px] rounded-2xl border border-primary/[0.15] overflow-hidden bg-bg-tertiary hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(108,99,255,0.3)] transition-all duration-200 snap-start"
          >
            {/* Top gradient */}
            <div className="h-28" style={{ background: split.gradient }} />
            {/* Content */}
            <div className="p-5">
              <h3 className="text-foreground font-bold">{split.name}</h3>
              <p className="text-text-secondary text-sm mt-1">{split.subtitle}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {split.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-pill bg-bg-secondary text-primary text-[0.6875rem] font-medium tracking-wide uppercase">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="#" className="inline-block mt-4 text-primary text-sm font-medium hover:underline">
                Adopt this split →
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-text-secondary text-sm mt-6">
        Or build your own custom split — day by day, exercise by exercise.
      </p>
    </section>
  );
};

export default WorkoutPrograms;
