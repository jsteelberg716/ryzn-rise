import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const ShareCardTilt = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateY: x * 25, rotateX: -y * 20 });
  };

  return (
    <motion.div
      className="flex-1 flex justify-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div
        ref={cardRef}
        style={{ perspective: 600 }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ rotateX: 0, rotateY: 0 }); }}
      >
        <div
          className="rounded-2xl overflow-hidden transition-all duration-300 ease-out"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            boxShadow: hovered
              ? `${-tilt.rotateY * 1.5}px ${tilt.rotateX * 1.5}px 40px rgba(0,0,0,0.5), 0 0 50px rgba(34, 197, 94,0.15)`
              : '0 25px 60px rgba(34, 197, 94,0.12), 0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          <img src="/share-card.jpg" alt="RYZN workout share card" className="w-[300px] rounded-2xl" />
        </div>
      </div>
    </motion.div>
  );
};

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
          <motion.span variants={fadeUpVariant} className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
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
            a beautiful branded summary after every workout — complete with
            your muscle map heatmap, stats, and branding. Designed for
            Instagram Stories, TikTok, and iMessage.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-6 space-y-2 text-muted-foreground text-sm">
            {[
              'Auto-generated after every completed workout',
              'Shows duration, volume, exercises, sets, and your muscle map',
              'Front & back muscle heatmap with activation levels',
              'One-tap to iOS ShareSheet — post anywhere instantly',
              "Subtle 'Tracked with RYZN' watermark drives organic installs",
            ].map(f => (
              <div key={f} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">●</span>
                <span>{f}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stacked cards — real screenshot in front, colored variants behind */}
        <ShareCardTilt />
      </div>
    </section>
  );
};

export default ShareCards;
