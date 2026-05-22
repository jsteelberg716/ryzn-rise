import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { THEMES, applyTheme, readPersistedTheme, type ThemeKey } from '@/lib/themes';

/// Section that lets the visitor preview each of the 6 accent themes
/// the iOS app ships with — clicking a swatch rewrites the marketing
/// site's `--primary` / `--accent` / `--ring` CSS variables in place
/// so every primary-tinted element (CTAs, headlines, gradients, focus
/// rings) flips colors instantly. Choice persists to localStorage so
/// reloads keep the selection.
const ChooseYourTheme = () => {
  const [active, setActive] = useState<ThemeKey>('emerald');

  // Hydrate from localStorage AFTER mount (avoids SSR flash and lets the
  // initial CSS variable default render before we touch it).
  useEffect(() => {
    const stored = readPersistedTheme();
    setActive(stored);
    applyTheme(stored);
  }, []);

  const onPick = (key: ThemeKey) => {
    setActive(key);
    applyTheme(key);
  };

  return (
    <section className="relative bg-card pt-16 lg:pt-20 pb-20 lg:pb-24 section-glow section-inset">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span
          variants={fadeUpVariant}
          className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary"
        >
          MAKE IT YOURS
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Choose your theme.
        </motion.h2>
        <motion.p
          variants={fadeUpVariant}
          className="mt-4 text-muted-foreground mx-auto max-w-[640px] text-[1.0625rem]"
        >
          Six accent palettes ship in the app. Tap one to preview how every
          screen, button, and gradient shifts on the fly. Your pick sticks
          across the site.
        </motion.p>

        <motion.div
          variants={fadeUpVariant}
          className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-5"
        >
          {THEMES.map(({ key, name, swatch }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onPick(key)}
                aria-pressed={isActive}
                aria-label={`Set ${name} theme`}
                className="group flex flex-col items-center gap-2 focus:outline-none"
              >
                <span
                  className="relative rounded-full transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110"
                  style={{
                    width: 64,
                    height: 64,
                    background: swatch,
                    boxShadow: isActive
                      ? `0 0 0 3px hsl(var(--background)), 0 0 0 6px ${swatch}, 0 12px 28px -10px ${swatch}`
                      : `0 8px 20px -8px ${swatch}`,
                  }}
                >
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      className="absolute inset-0 flex items-center justify-center text-white"
                    >
                      <Check className="size-7" strokeWidth={3} />
                    </motion.span>
                  )}
                </span>
                <span
                  className={`text-xs font-medium tracking-wide transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {name}
                </span>
              </button>
            );
          })}
        </motion.div>

        <motion.p
          variants={fadeUpVariant}
          className="mt-8 text-xs text-muted-foreground/60"
        >
          Same picker lives in the iOS app under Settings → Accent.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default ChooseYourTheme;
