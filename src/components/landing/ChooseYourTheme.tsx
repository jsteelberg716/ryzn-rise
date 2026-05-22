import { useEffect, useState } from 'react';
import { THEMES, applyTheme, readPersistedTheme, type ThemeKey } from '@/lib/themes';

/// Slim theme picker band that sits between FinalCTA and Footer on the
/// desktop landing. Six small accent circles + "Choose your theme"
/// label — tap any swatch and every primary-tinted element on the
/// site re-tints in place via `--primary` / `--accent` / `--ring`.
/// Persisted to localStorage; pre-paint hydration in index.html prevents
/// a flash on reload.
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
    <div className="w-full bg-bg-primary py-6 border-t border-border/10">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col items-center gap-3">
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
    </div>
  );
};

export default ChooseYourTheme;
