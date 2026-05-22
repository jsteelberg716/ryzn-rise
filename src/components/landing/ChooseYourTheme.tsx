import { useEffect, useState } from 'react';
import { THEMES, applyTheme, readPersistedTheme, type ThemeKey } from '@/lib/themes';

/// Slim theme picker — six small accent circles + "Choose your theme"
/// label. Embedded inline in the Hero section, directly below the
/// "Log smarter. / Lift heavier." headline so visitors can recolor
/// the entire site in place. The active swatch carries a subtle ring;
/// unselected swatches dim to 85 % opacity.
///
/// Selection persists to localStorage (`ryzn-theme`) and is applied
/// pre-paint by an inline script in `index.html` so reloads don't
/// flash the default emerald. The /scan/v1/ iframe reads the same
/// localStorage entry so its animation re-tints in lockstep.
const ChooseYourTheme = () => {
  const [active, setActive] = useState<ThemeKey>('emerald');

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
    <div className="flex flex-col items-center gap-2.5">
      <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-muted-foreground/70">
        Choose your theme
      </span>
      <div className="flex items-center gap-2.5 sm:gap-3 py-1">
        {THEMES.map(({ key, name, swatch }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onPick(key)}
              aria-pressed={isActive}
              aria-label={`Set ${name} theme`}
              title={name}
              className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:scale-110"
              style={{
                // Outer wrapper sizes the click target + the active
                // ring. The inner span paints the swatch. Using
                // a real bordered wrapper instead of box-shadow so
                // the ring is part of the layout box and can't be
                // clipped by ancestor stacking quirks.
                width: 32,
                height: 32,
                border: isActive ? `2px solid ${swatch}` : '2px solid transparent',
                opacity: isActive ? 1 : 0.85,
              }}
            >
              <span
                aria-hidden
                className="rounded-full block"
                style={{
                  width: 22,
                  height: 22,
                  background: swatch,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseYourTheme;
