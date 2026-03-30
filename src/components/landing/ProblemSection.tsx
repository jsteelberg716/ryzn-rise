import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const problems = [
  {
    problem: 'Guessing what weight to use',
    solution: 'AI progression engine tells you exactly what to lift',
  },
  {
    problem: 'No idea if muscles are balanced',
    solution: 'Live muscle map shows imbalances in real time',
  },
  {
    problem: 'Nothing to keep you coming back',
    solution: 'Weekly challenges, streaks, and badges keep momentum',
  },
];

const ProblemSection = () => {
  return (
    <section id="how-it-works" className="relative bg-background py-20 lg:py-32 section-glow">
      <motion.div
        className="max-w-[720px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
          THE PROBLEM
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Most workout apps are just a glorified notepad.
        </motion.h2>
        <motion.p
          variants={fadeUpVariant}
          className="mt-6 text-muted-foreground leading-relaxed"
          style={{ fontSize: '1.25rem' }}
        >
          You log your sets. You guess your weights. You finish the workout
          and wonder if you're actually making progress. There's no feedback.
          No intelligence. No way to know if your training is balanced.
          <br /><br />
          <strong className="text-foreground">RYZN fixes all of that.</strong>
        </motion.p>
      </motion.div>

      <motion.div
        className="max-w-[1200px] mx-auto px-6 mt-12 grid md:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {problems.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUpVariant}
            custom={i * 0.1}
            className="glass-card rounded-[24px] p-8 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-start gap-3 text-accent">
              <span className="text-lg">✗</span>
              <p className="text-muted-foreground">{item.problem}</p>
            </div>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="flex items-start gap-3 text-accent-green">
              <span className="text-lg">✓</span>
              <p className="text-foreground">{item.solution}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProblemSection;
