import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const legend = [
  { color: '#2A2A3A', label: 'Untrained this week' },
  { color: '#45B7D1', label: 'Underworked — add more volume' },
  { color: '#4ECDC4', label: 'Optimal training volume' },
  { color: '#FF6B6B', label: 'Overworked — consider recovery' },
];

const features = [
  '16 muscle groups tracked with biomechanical accuracy',
  'Updates live during your workout as you complete sets',
  'Front and back views — tap to flip',
  'Exercise-specific activation percentages',
];

const FrontBody = () => (
  <svg width="200" height="360" viewBox="0 0 200 360" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="30" r="20" fill="#2A2A3A" opacity="0.6" />
    <rect x="92" y="50" width="16" height="14" rx="6" fill="#2A2A3A" opacity="0.6" />
    <ellipse cx="55" cy="78" rx="22" ry="14" fill="#4ECDC4" opacity="0.7" />
    <ellipse cx="145" cy="78" rx="22" ry="14" fill="#4ECDC4" opacity="0.7" />
    <ellipse cx="100" cy="100" rx="38" ry="26" fill="#FF6B6B" opacity="0.9" className="animate-[muscleOverworkPulse_2.5s_ease-in-out_infinite]" style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,107,0.5))' }} />
    <rect x="20" y="82" width="16" height="58" rx="8" fill="#45B7D1" opacity="0.6" />
    <rect x="164" y="82" width="16" height="58" rx="8" fill="#45B7D1" opacity="0.6" />
    <rect x="18" y="140" width="14" height="44" rx="7" fill="#2A2A3A" opacity="0.5" />
    <rect x="168" y="140" width="14" height="44" rx="7" fill="#2A2A3A" opacity="0.5" />
    <rect x="78" y="126" width="44" height="50" rx="10" fill="#4ECDC4" opacity="0.5" />
    <rect x="64" y="180" width="28" height="76" rx="12" fill="#4ECDC4" opacity="0.7" />
    <rect x="108" y="180" width="28" height="76" rx="12" fill="#4ECDC4" opacity="0.7" />
    <rect x="68" y="262" width="22" height="60" rx="10" fill="#2A2A3A" opacity="0.6" />
    <rect x="110" y="262" width="22" height="60" rx="10" fill="#2A2A3A" opacity="0.6" />
  </svg>
);

const BackBody = () => (
  <svg width="200" height="360" viewBox="0 0 200 360" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="30" r="20" fill="#2A2A3A" opacity="0.6" />
    <rect x="92" y="50" width="16" height="14" rx="6" fill="#2A2A3A" opacity="0.6" />
    <ellipse cx="100" cy="68" rx="30" ry="10" fill="#2A2A3A" opacity="0.6" />
    <ellipse cx="55" cy="78" rx="22" ry="14" fill="#4ECDC4" opacity="0.5" />
    <ellipse cx="145" cy="78" rx="22" ry="14" fill="#4ECDC4" opacity="0.5" />
    <ellipse cx="100" cy="110" rx="40" ry="30" fill="#4ECDC4" opacity="0.7" />
    <rect x="20" y="82" width="16" height="58" rx="8" fill="#2A2A3A" opacity="0.5" />
    <rect x="164" y="82" width="16" height="58" rx="8" fill="#2A2A3A" opacity="0.5" />
    <rect x="82" y="136" width="36" height="30" rx="10" fill="#4ECDC4" opacity="0.5" />
    <ellipse cx="82" cy="185" rx="20" ry="18" fill="#FF6B6B" opacity="0.8" style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,107,0.5))' }} />
    <ellipse cx="118" cy="185" rx="20" ry="18" fill="#FF6B6B" opacity="0.8" style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,107,0.5))' }} />
    <rect x="64" y="206" width="28" height="60" rx="12" fill="#45B7D1" opacity="0.6" />
    <rect x="108" y="206" width="28" height="60" rx="12" fill="#45B7D1" opacity="0.6" />
    <rect x="68" y="272" width="22" height="54" rx="10" fill="#2A2A3A" opacity="0.6" />
    <rect x="110" y="272" width="22" height="54" rx="10" fill="#2A2A3A" opacity="0.6" />
  </svg>
);

const MuscleMapSection = () => {
  const [showBack, setShowBack] = useState(false);

  return (
    <section id="features" className="relative bg-card py-20 lg:py-32 section-glow">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          className="flex-1 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative" style={{ perspective: 1200 }}>
            {/* Glow behind body */}
            <div className="absolute inset-[-20px] blur-[30px] bg-primary/10 rounded-full" />
            <motion.div
              animate={{ rotateY: showBack ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative"
            >
              <div style={{ backfaceVisibility: 'hidden' }}>
                <FrontBody />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <BackBody />
              </div>
            </motion.div>
          </div>

          <div className="mt-6 flex glass-card rounded-pill p-1">
            <button
              onClick={() => setShowBack(false)}
              className={`px-6 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${!showBack ? 'bg-primary text-foreground shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-muted-foreground'}`}
            >
              Front
            </button>
            <button
              onClick={() => setShowBack(true)}
              className={`px-6 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${showBack ? 'bg-primary text-foreground shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-muted-foreground'}`}
            >
              Back
            </button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
            MUSCLE MAP VISUALIZATION
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
          >
            See exactly what you're working. Every rep.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-6 text-muted-foreground leading-relaxed text-[1.0625rem]">
            After every set, your body lights up. RYZN's real-time muscle map
            tracks which muscles you've trained, how hard you hit them, and what
            needs more attention — so you never waste a workout on imbalance.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-6 space-y-2">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}40` }} />
                <span className="text-muted-foreground text-sm">{item.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUpVariant} className="mt-6 space-y-2">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-2 text-muted-foreground text-sm">
                <span className="text-primary mt-0.5">●</span>
                <span>{f}</span>
              </div>
            ))}
          </motion.div>

          <motion.a
            variants={fadeUpVariant}
            href="#pricing"
            className="inline-block mt-6 text-primary font-medium hover:underline"
          >
            → Try it free for 3 days
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default MuscleMapSection;
