/// The same 6 accent colors that ship inside the RYZN iOS app
/// (`AccentColorOption` in `BetterM3/Core/Extensions/ColorExtensions.swift`).
/// HSL values were converted from the iOS HSB definitions:
///   emerald: HSB(145, 0.90, 0.80) — defaults to the marketing-site canon
///   coral:   HSB(10,  0.78, 0.90)
///   ocean:   HSB(210, 0.78, 0.75)
///   blush:   HSB(340, 0.65, 0.85)
///   gold:    HSB(45,  0.80, 0.88)
///   violet:  HSB(270, 0.60, 0.75)
///
/// The marketing site themes via CSS custom properties on
/// `:root` — `--primary`, `--accent`, `--accent-green`, `--ring`
/// all carry the active accent in `H S% L%` form.

export type ThemeKey = 'emerald' | 'coral' | 'ocean' | 'blush' | 'gold' | 'violet';

export interface ThemeDef {
  key: ThemeKey;
  name: string;
  /// HSL value as the `--primary` CSS variable expects it (no `hsl()` wrapper).
  hsl: string;
  /// Direct CSS color for swatch rendering — same hue as the HSL above.
  swatch: string;
}

export const THEMES: ThemeDef[] = [
  { key: 'emerald', name: 'Emerald', hsl: '145 72% 50%', swatch: 'hsl(145 72% 50%)' },
  { key: 'coral',   name: 'Coral',   hsl: '10 78% 55%',  swatch: 'hsl(10 78% 55%)'  },
  { key: 'ocean',   name: 'Ocean',   hsl: '210 64% 46%', swatch: 'hsl(210 64% 46%)' },
  { key: 'blush',   name: 'Blush',   hsl: '340 65% 57%', swatch: 'hsl(340 65% 57%)' },
  { key: 'gold',    name: 'Gold',    hsl: '45 75% 53%',  swatch: 'hsl(45 75% 53%)'  },
  { key: 'violet',  name: 'Violet',  hsl: '270 47% 52%', swatch: 'hsl(270 47% 52%)' },
];

const STORAGE_KEY = 'ryzn-theme';

/// Read the persisted theme key on app boot. Defaults to emerald so the
/// site renders the canonical accent for first-time visitors.
export const readPersistedTheme = (): ThemeKey => {
  if (typeof window === 'undefined') return 'emerald';
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
  if (stored && THEMES.some((t) => t.key === stored)) return stored;
  return 'emerald';
};

/// Persist + apply. Mutates the same four CSS variables that the
/// landing components read via `text-primary`, `bg-primary`, etc.
export const applyTheme = (key: ThemeKey) => {
  if (typeof document === 'undefined') return;
  const theme = THEMES.find((t) => t.key === key);
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--primary', theme.hsl);
  root.style.setProperty('--accent', theme.hsl);
  root.style.setProperty('--accent-green', theme.hsl);
  root.style.setProperty('--ring', theme.hsl);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, key);
  }
};
