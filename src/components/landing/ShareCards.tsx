import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const DESKTOP_OFFSET = 63;

type PillConfig = {
  key: string;
  label: string;
  icon: string;
  hoverX: number;
  hoverY: number;
  delay: number;
};

const PILLS: PillConfig[] = [
  { key: 'stories', label: 'Stories', icon: '/icons/instagram.png', hoverX: -174, hoverY: -260, delay: 0 },
  { key: 'imessage', label: 'iMessage', icon: '/icons/imessage.png', hoverX: -277, hoverY: 85, delay: 0.15 },
  { key: 'tiktok', label: 'TikTok', icon: '/icons/tiktok.png', hoverX: 238, hoverY: 175, delay: 0.3 },
];

const ShareCardStack = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Apply offset only on desktop (lg+); mobile stacks naturally with no negative margin
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateY: x * 18, rotateX: -y * 14 });
  };

  return (
    <motion.div
      className="flex-1 flex justify-center items-center relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ marginTop: isDesktop ? DESKTOP_OFFSET : 0 }}
    >
      <div
        className="relative"
        style={{ width: 420, height: 440, perspective: 1200 }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ rotateX: 0, rotateY: 0 }); }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 -z-10 rounded-[40px] blur-3xl transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.08) 50%, transparent 75%)',
            opacity: hovered ? 1 : 0.55,
            transform: 'scale(1.15)',
          }}
        />

        {/* Card 3 (back-left) — original blue */}
        <div className="absolute top-1/2 left-1/2 z-10" style={{ width: 280, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              x: hovered ? -95 : -42,
              y: hovered ? -50 : -32,
              rotate: hovered ? -14 : -7,
              opacity: 0.82,
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 18px 40px rgba(0,0,0,0.5), 0 0 30px rgba(96,165,250,0.22), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              <img src="/share-card.jpg" alt="" aria-hidden className="w-full block" style={{ filter: 'saturate(0.95) brightness(0.92)' }} />
            </div>
          </motion.div>
        </div>

        {/* Card 2 (back-right) — pink tint */}
        <div className="absolute top-1/2 left-1/2 z-10" style={{ width: 290, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{
              x: hovered ? 95 : 42,
              y: hovered ? -50 : -32,
              rotate: hovered ? 14 : 7,
              opacity: 0.82,
            }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 22px 50px rgba(0,0,0,0.5), 0 0 30px rgba(236,72,153,0.28), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              <img src="/share-card.jpg" alt="" aria-hidden className="w-full block" />
              {/* Pink tint — clipped to the colored left panel only (~42% of card width) */}
              <div
                className="absolute top-0 bottom-0 left-0 pointer-events-none"
                style={{
                  width: '42%',
                  background: 'linear-gradient(180deg, rgba(244,114,182,0.95) 0%, rgba(236,72,153,0.9) 100%)',
                  mixBlendMode: 'color',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Card 1 (front, interactive) — new green share card */}
        <div ref={cardRef} className="absolute top-1/2 left-1/2 z-20" style={{ width: 300, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="rounded-2xl overflow-hidden cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              boxShadow: hovered
                ? `${-tilt.rotateY * 1.5}px ${tilt.rotateX * 1.5 + 32}px 60px rgba(0,0,0,0.6), 0 0 80px rgba(34,197,94,0.3), 0 0 0 1px rgba(255,255,255,0.06)`
                : '0 28px 60px rgba(0,0,0,0.5), 0 0 50px rgba(34,197,94,0.22), 0 0 0 1px rgba(255,255,255,0.05)',
              transition: 'box-shadow 0.3s ease-out, transform 0.08s ease-out',
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <img src="/share-card-green.jpg" alt="RYZN workout share card" className="w-full block" />

            {/* Specular sheen overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
              style={{
                background: `linear-gradient(${135 + tilt.rotateY * 4}deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 65%, rgba(34,197,94,0.12) 100%)`,
                opacity: hovered ? 1 : 0.55,
                mixBlendMode: 'overlay',
              }}
            />
          </motion.div>
        </div>

        {/* Floating share platform chips — collapsed by default, fly out from card on hover */}
        {PILLS.map((p) => (
          <div
            key={p.key}
            className="absolute top-1/2 left-1/2 z-0 pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md select-none"
              style={{
                background: 'rgba(20,20,28,0.78)',
                border: '1px solid rgba(34,197,94,0.3)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.4), 0 0 20px rgba(34,197,94,0.15)',
              }}
              animate={{
                x: hovered ? p.hoverX : 0,
                y: hovered ? p.hoverY : 0,
                opacity: hovered ? 1 : 0,
                scale: hovered ? 1 : 0.6,
              }}
              transition={{ delay: hovered ? p.delay : 0, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <img src={p.icon} alt="" className="w-4 h-4 object-contain" />
              <span className="text-xs font-medium text-foreground/95 whitespace-nowrap">{p.label}</span>
            </motion.div>
          </div>
        ))}

        {/* Hover hint — directly below main card, centered */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-xs font-medium tracking-widest uppercase text-primary/60 whitespace-nowrap"
          style={{ bottom: -8 }}
          animate={{ opacity: hovered ? 0 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          Hover to share
        </motion.div>
      </div>
    </motion.div>
  );
};

const ShareCards = () => {
  return (
    <section className="relative bg-background py-20 lg:py-32 section-glow overflow-hidden">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 70% 50%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 70% 50%, black 0%, transparent 70%)',
        }}
      />

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

        <ShareCardStack />
      </div>
    </section>
  );
};

export default ShareCards;
