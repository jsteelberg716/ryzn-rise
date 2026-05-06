import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import Lottie from 'lottie-react';
import benchPress from '@/assets/lottie/bench-press.json';
import pullups from '@/assets/lottie/pullups.json';
import pushups from '@/assets/lottie/pushups.json';
import deadlift from '@/assets/lottie/deadlift.json';
import strength from '@/assets/lottie/strength.json';

const splits = [
  {
    name: 'Push/Pull/Legs',
    subtitle: 'The classic 6-day split',
    lottie: benchPress,
    gradient: 'linear-gradient(135deg, #22c55e, #15803D)',
    tags: ['6 days/week', 'Intermediate', 'Strength + Size'],
    days: [
      { day: 'Push', exercises: ['Bench Press', 'Overhead Press', 'Incline DB Press', 'Lateral Raises', 'Tricep Pushdowns', 'Cable Flyes'] },
      { day: 'Pull', exercises: ['Deadlift', 'Barbell Rows', 'Lat Pulldowns', 'Face Pulls', 'Barbell Curls', 'Hammer Curls'] },
      { day: 'Legs', exercises: ['Squats', 'Romanian Deadlift', 'Leg Press', 'Leg Curls', 'Calf Raises', 'Lunges'] },
    ],
  },
  {
    name: 'Upper/Lower',
    subtitle: 'Efficient & effective',
    lottie: pullups,
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    tags: ['4 days/week', 'Beginner+', 'Balanced'],
    days: [
      { day: 'Upper A', exercises: ['Bench Press', 'Barbell Rows', 'OHP', 'Lat Pulldowns', 'Curls', 'Tricep Ext.'] },
      { day: 'Lower A', exercises: ['Squats', 'RDL', 'Leg Press', 'Leg Curls', 'Calf Raises', 'Ab Rollouts'] },
      { day: 'Upper B', exercises: ['Incline DB Press', 'Cable Rows', 'DB Shoulder Press', 'Pull-Ups', 'Hammer Curls', 'Skull Crushers'] },
      { day: 'Lower B', exercises: ['Deadlift', 'Bulgarian Splits', 'Leg Extensions', 'Glute Bridges', 'Calf Raises', 'Planks'] },
    ],
  },
  {
    name: 'Arnold Split',
    subtitle: 'Old school, proven',
    lottie: strength,
    gradient: 'linear-gradient(135deg, #45B7D1, #0096FF)',
    tags: ['6 days/week', 'Advanced', 'Volume'],
    days: [
      { day: 'Chest & Back', exercises: ['Bench Press', 'Barbell Rows', 'Incline Press', 'Lat Pulldowns', 'Cable Flyes', 'Seated Rows'] },
      { day: 'Shoulders & Arms', exercises: ['OHP', 'Lateral Raises', 'Barbell Curls', 'Tricep Pushdowns', 'Rear Delt Flyes', 'Hammer Curls'] },
      { day: 'Legs', exercises: ['Squats', 'RDL', 'Leg Press', 'Leg Curls', 'Calf Raises', 'Lunges'] },
    ],
  },
  {
    name: 'Bro Split',
    subtitle: 'One muscle at a time',
    lottie: pushups,
    gradient: 'linear-gradient(135deg, #4ECDC4, #2ECC71)',
    tags: ['5 days/week', 'All levels', 'Classic'],
    days: [
      { day: 'Chest', exercises: ['Bench Press', 'Incline Press', 'Cable Flyes', 'Dips', 'Push-Ups'] },
      { day: 'Back', exercises: ['Deadlift', 'Barbell Rows', 'Lat Pulldowns', 'Seated Rows', 'Pull-Ups'] },
      { day: 'Shoulders', exercises: ['OHP', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Shrugs'] },
      { day: 'Arms', exercises: ['Barbell Curls', 'Tricep Pushdowns', 'Hammer Curls', 'Skull Crushers', 'Preacher Curls'] },
      { day: 'Legs', exercises: ['Squats', 'Leg Press', 'RDL', 'Leg Curls', 'Calf Raises'] },
    ],
  },
  {
    name: 'Full Body',
    subtitle: 'Maximize frequency',
    lottie: deadlift,
    gradient: 'linear-gradient(135deg, #F7971E, #FFD200)',
    tags: ['3 days/week', 'All levels', 'Efficient'],
    days: [
      { day: 'Day A', exercises: ['Squats', 'Bench Press', 'Barbell Rows', 'OHP', 'Curls', 'Calf Raises'] },
      { day: 'Day B', exercises: ['Deadlift', 'Incline Press', 'Lat Pulldowns', 'Lateral Raises', 'Tricep Ext.', 'Leg Curls'] },
      { day: 'Day C', exercises: ['Front Squats', 'DB Press', 'Cable Rows', 'Face Pulls', 'Hammer Curls', 'Planks'] },
    ],
  },
];

const SplitCard = ({ split, index }: { split: typeof splits[number]; index: number }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative z-10 flex-shrink-0 w-[280px] snap-start cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className="relative w-full">
        {/* Front (in flow — determines card height) */}
        <div
          className="rounded-2xl overflow-hidden dmd-convex transition-opacity duration-300"
          style={{ opacity: flipped ? 0 : 1, pointerEvents: flipped ? 'none' : 'auto' }}
        >
          <div className="h-48 relative flex items-center justify-center" style={{ background: split.gradient }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            <div className="relative z-10 w-28 h-28">
              <Lottie
                animationData={split.lottie}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-foreground font-bold">{split.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{split.subtitle}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {split.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-pill bg-primary/10 text-primary text-[0.6875rem] font-medium tracking-wide uppercase border border-primary/15">
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 text-primary/60 text-xs font-medium">Tap to see exercises →</p>
          </div>
        </div>

        {/* Back (absolute, fills front's natural height) */}
        <div
          className="rounded-2xl overflow-hidden dmd-convex p-5 transition-opacity duration-300 flex flex-col"
          style={{ position: 'absolute', inset: 0, opacity: flipped ? 1 : 0, pointerEvents: flipped ? 'auto' : 'none' }}
        >
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: split.gradient }}>
              <Lottie
                animationData={split.lottie}
                loop={true}
                autoplay={true}
                style={{ width: 22, height: 22 }}
              />
            </div>
            <h3 className="text-foreground font-bold text-sm">{split.name}</h3>
          </div>
          <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
            {split.days.map((d) => (
              <div key={d.day}>
                <p className="text-primary text-[10px] font-semibold tracking-widest uppercase mb-1">{d.day}</p>
                <div className="flex flex-wrap gap-1">
                  {d.exercises.map((ex) => (
                    <span key={ex} className="px-2 py-0.5 rounded-md bg-primary/8 text-foreground/70 text-[0.65rem] font-medium border border-primary/10">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-primary/60 text-xs font-medium flex-shrink-0">Tap to flip back →</p>
        </div>
      </div>
    </div>
  );
};

const WorkoutPrograms = () => {
  return (
    <section className="relative bg-card pt-16 lg:pt-20 pb-0 section-glow section-inset">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span variants={fadeUpVariant} className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
          WORKOUT PROGRAMS & SPLITS
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Your program. Your schedule. Your rules.
        </motion.h2>
        <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground mx-auto max-w-[600px] text-[1.0625rem]">
          Choose from 5 expert-designed split programs or build your own from scratch.
          Map workout days to your week. RYZN handles the rest.
        </motion.p>
      </motion.div>

      <div className="max-w-[1200px] mx-auto mt-8 px-6">
        <div className="flex gap-6 overflow-x-auto overflow-y-visible hide-scrollbar py-4 snap-x snap-mandatory relative z-20">
          {splits.map((split, i) => (
            <SplitCard key={split.name} split={split} index={i} />
          ))}
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm mt-2 px-6">
        Or build your own custom split — day by day, exercise by exercise.
      </p>
    </section>
  );
};

export default WorkoutPrograms;
