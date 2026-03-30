import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const cards = [
  { gradient: 'linear-gradient(160deg, #0A1A10 0%, #0D2818 100%)', rotate: -5, volume: '12,840 lbs', exercises: 8, sets: 24, prs: 3, workout: 'Push Day', date: 'March 28, 2026' },
  { gradient: 'linear-gradient(160deg, #0F1923 0%, #0A1A1A 100%)', rotate: 0, volume: '9,200 lbs', exercises: 6, sets: 18, prs: 1, workout: 'Pull Day', date: 'March 26, 2026' },
  { gradient: 'linear-gradient(160deg, #1A0F0A 0%, #1A1510 100%)', rotate: 5, volume: '15,600 lbs', exercises: 7, sets: 28, prs: 2, workout: 'Leg Day', date: 'March 24, 2026' },
];

const ShareCards = () => {
  return (
    <section className="relative bg-background py-20 lg:py-32 section-glow">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          className="flex-1"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-primary">
            SHAREABLE WORKOUT CARDS
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
          >
            Your workout deserves a moment.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-6 text-muted-foreground leading-relaxed text-[1.0625rem]">
            Finish a session and get a card worth posting. RYZN generates
            a beautiful branded summary after every workout — designed for
            Instagram Stories, TikTok, and iMessage. No editing required.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-6 space-y-2 text-muted-foreground text-sm">
            {['📸 Auto-generated after every completed workout', '🎨 Multiple card styles — minimal, detailed, gradient', '💪 Shows duration, volume, PRs hit, and your muscle map heatmap', '📲 One-tap to iOS ShareSheet — Instagram, TikTok, iMessage, anywhere', "🏷️ Subtle 'Tracked with RYZN' watermark drives organic installs"].map(f => (
              <p key={f}>{f}</p>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative w-[280px] h-[420px] group">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between border border-primary/[0.1] overflow-hidden"
                style={{
                  background: card.gradient,
                  rotate: card.rotate,
                  zIndex: 3 - i,
                }}
                whileHover={i === 2 ? { y: -12 } : {}}
                initial={{ opacity: 0, y: 40, rotate: card.rotate }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-foreground font-extrabold text-xs border border-primary/30">R</div>
                    <span className="text-foreground font-bold text-sm">RYZN</span>
                  </div>
                  <p className="text-foreground font-extrabold text-2xl mt-6">Total Volume</p>
                  <p className="text-foreground font-extrabold text-3xl">{card.volume}</p>
                  <p className="text-foreground/70 text-sm mt-2">{card.exercises} exercises · {card.sets} sets · {card.prs} PRs</p>
                </div>
                <div className="relative z-10">
                  <p className="text-foreground/60 text-xs">{card.workout} · {card.date}</p>
                  <p className="text-foreground/30 text-[0.625rem] mt-2">Tracked with RYZN</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareCards;
