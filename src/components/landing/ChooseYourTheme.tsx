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
      <div className="flex items-center gap-2.5 sm:gap-3">
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
              className="rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:scale-110"
              style={{
                width: 22,
                height: 22,
                background: swatch,
                boxShadow: isActive
                  ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${swatch}`
                  : 'none',
                opacity: isActive ? 1 : 0.85,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChooseYourTheme;
