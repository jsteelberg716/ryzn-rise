import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Droplets,
  Mic,
  Keyboard,
  List,
  Zap,
  Crosshair,
  Check,
  Wine,
  Wand2,
  Heart,
  ChevronUp,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer, EASING } from '@/lib/animations';

/* =============================================================================
   RYZN "Snap + Voice" Fuel Tracking section.

   Phone mockup cycles through 3 scenes:
     1. Food plate (on a counter) — showcases the VOICE refinement feature
     2. Water glass — simple scan + log
     3. Beer pint — simple scan + log

   Each scene runs 4 phases: idle → scan → recognized (+voice for scene 1) → logged
   Totals accumulate across scenes, then reset at start of loop.
============================================================================ */

type SceneType = 'food' | 'water' | 'beer';

type Scene = {
  id: string;
  type: SceneType;
  image: string;
  imagePos: string;
  initialDetection: {
    name: string;
    portion: string;
    kcal: number;
    macros?: Array<{ label: string; value: string; color: string }>;
  };
  voicePrompt?: string;
  refinedDetection?: {
    name: string;
    portion: string;
    kcal: number;
    macros?: Array<{ label: string; value: string; color: string }>;
  };
  finalDelta: {
    cal: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  toastText: string;
  accentColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const MACRO_COLORS = {
  protein: '#22c55e',
  carbs: '#F59E0B',
  fat: '#60A5FA',
  water: '#60A5FA',
  alcohol: '#E8A458',
} as const;

const SCENES: Scene[] = [
  {
    id: 'food',
    type: 'food',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=85&auto=format&fit=crop',
    imagePos: 'center 50%',
    initialDetection: {
      name: 'Chicken & rice bowl',
      portion: 'Est. 520g · 1 serving',
      kcal: 720,
      macros: [
        { label: 'P', value: '42g', color: MACRO_COLORS.protein },
        { label: 'C', value: '82g', color: MACRO_COLORS.carbs },
        { label: 'F', value: '22g', color: MACRO_COLORS.fat },
      ],
    },
    voicePrompt: 'No rice, extra chicken',
    refinedDetection: {
      name: '2× chicken, no rice',
      portion: 'Refined · 380g',
      kcal: 540,
      macros: [
        { label: 'P', value: '68g', color: MACRO_COLORS.protein },
        { label: 'C', value: '8g', color: MACRO_COLORS.carbs },
        { label: 'F', value: '22g', color: MACRO_COLORS.fat },
      ],
    },
    finalDelta: { cal: 540, protein: 68, carbs: 8, fat: 22, water: 0 },
    toastText: '+540 FUEL LOGGED',
    accentColor: MACRO_COLORS.protein,
    icon: Camera,
  },
  {
    id: 'water',
    type: 'water',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=85&auto=format&fit=crop',
    imagePos: 'center 50%',
    initialDetection: {
      name: 'Water · tall glass',
      portion: '16 oz · 473 ml',
      kcal: 0,
    },
    finalDelta: { cal: 0, protein: 0, carbs: 0, fat: 0, water: 0.5 },
    toastText: '+16 OZ HYDRATION',
    accentColor: MACRO_COLORS.water,
    icon: Droplets,
  },
  {
    id: 'beer',
    type: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=85&auto=format&fit=crop',
    imagePos: 'center 45%',
    initialDetection: {
      name: 'Lager · pint pour',
      portion: '12 oz · 5% ABV',
      kcal: 153,
      macros: [
        { label: 'ABV', value: '5%', color: MACRO_COLORS.alcohol },
        { label: 'C', value: '13g', color: MACRO_COLORS.carbs },
      ],
    },
    finalDelta: { cal: 153, protein: 2, carbs: 13, fat: 0, water: 0 },
    toastText: '+153 ALCOHOL LOGGED',
    accentColor: MACRO_COLORS.alcohol,
    icon: Wine,
  },
];

// Per-phase durations: [idle, scan, recognized(+voice), logged]
const PHASE_DURATION: Record<SceneType, number[]> = {
  food:  [1200, 1300, 3000, 1600],
  water: [1100, 1100, 1500, 1300],
  beer:  [1100, 1100, 1700, 1400],
};

const CalorieLoggingSection = () => {
  const [step, setStep] = useState(0); // 0..11 (3 scenes × 4 phases)
  const sceneIdx = Math.floor(step / 4);
  const phase = step % 4;
  const scene = SCENES[sceneIdx];

  useEffect(() => {
    const dur = PHASE_DURATION[scene.type][phase];
    const t = setTimeout(() => setStep((s) => (s + 1) % (SCENES.length * 4)), dur);
    return () => clearTimeout(t);
  }, [step, scene.type, phase]);

  // Accumulate totals as scenes complete
  const totals = (() => {
    const base = { cal: 295, protein: 20, carbs: 35, fat: 10, water: 1.0 };
    for (let i = 0; i < sceneIdx; i++) {
      const d = SCENES[i].finalDelta;
      base.cal += d.cal;
      base.protein += d.protein;
      base.carbs += d.carbs;
      base.fat += d.fat;
      base.water += d.water;
    }
    if (phase === 3) {
      const d = scene.finalDelta;
      base.cal += d.cal;
      base.protein += d.protein;
      base.carbs += d.carbs;
      base.fat += d.fat;
      base.water += d.water;
    }
    return base;
  })();

  return (
    <section className="relative bg-background py-20 lg:py-32 section-glow overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 70% 30%, rgba(34, 197, 94,0.1), transparent 70%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(69,183,209,0.06), transparent 60%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* ────── Left: copy ────── */}
        <motion.div
          className="flex-1 w-full max-w-[560px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-accent-green"
          >
            SNAP + VOICE FUEL TRACKING
          </motion.span>

          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.12 }}
          >
            Take a picture. <span className="gradient-text">Speak the details.</span>
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-muted-foreground leading-relaxed text-[1.0625rem]"
          >
            Open the <strong className="text-foreground">Fuel</strong> tab, point the camera at
            a plate, a drink, or a glass of water — RYZN reads what it sees. Then{' '}
            <strong className="text-foreground">hold the mic</strong> and narrate what the camera
            can&apos;t: <em>"no rice, extra chicken,"</em> <em>"cooked in butter,"</em>{' '}
            <em>"half a pint."</em> Vision and voice fuse into one log, stacked against the
            calories you actually burned in the gym.
          </motion.p>

          <motion.div
            variants={fadeUpVariant}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {[
              { icon: Camera,              title: 'Snap to log',    copy: 'One tap — AI IDs the plate and portion in under a second' },
              { icon: Mic,                 title: 'Voice to refine', copy: 'Hold the mic — narrate ingredients, method, restaurant, tweaks', highlight: true },
              { icon: List,                title: 'Meals memory',   copy: 'Re-log yesterday\u2019s lunch or your go-to shake in one tap' },
              { icon: Heart,               title: 'HR + digestion', copy: 'Live gastric + cardiac signal tightens accuracy further' },
            ].map((f) => (
              <div
                key={f.title}
                className={`dmd-convex rounded-2xl p-4 hover:-translate-y-1 transition-all duration-300 flex items-start gap-3 ${
                  f.highlight ? 'relative overflow-hidden' : ''
                }`}
              >
                {f.highlight && (
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.3), transparent 70%)' }}
                  />
                )}
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 relative">
                  <f.icon size={16} className="text-accent-green" />
                </div>
                <div className="min-w-0 relative">
                  <h4 className="text-foreground font-semibold text-[0.9375rem] leading-tight flex items-center gap-1.5">
                    {f.title}
                    {f.highlight && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-accent-green px-1.5 py-0.5 rounded-full bg-accent-green/10">
                        Signature
                      </span>
                    )}
                  </h4>
                  <p className="text-muted-foreground text-xs mt-1 leading-snug">{f.copy}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Voice unlock callout */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-6 dmd-convex rounded-[24px] p-6 relative overflow-hidden"
            style={{ borderColor: 'hsl(145 72% 50% / 0.35)' }}
          >
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.2), transparent 70%)' }}
            />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Wand2 size={18} className="text-accent-green" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent-green mb-1">
                  Why voice changes everything
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Cameras read what they see. They can&apos;t see that the rice is gone, that it
                  was fried in butter, or that this is a 6 oz pour — not a 12. Held-mic voice input
                  narrates the details every other app asks you to search, tag, or guess. That&apos;s
                  the difference between an approximation and knowing your true energy balance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ────── Right: animated phone mockup ────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASING.smooth }}
          className="flex-1 flex justify-center w-full"
        >
          <PhoneDemo scene={scene} phase={phase} totals={totals} sceneIdx={sceneIdx} />
        </motion.div>
      </div>
    </section>
  );
};

/* =============================================================================
   PhoneDemo — iOS Fuel interface mock (spec §6)
============================================================================ */

// Spec §6 macro goals
const MACRO_GOALS = { cal: 2400, protein: 180, carbs: 280, fat: 80 } as const;

const PhoneDemo = ({
  scene,
  phase,
  totals,
  sceneIdx,
}: {
  scene: Scene;
  phase: number;
  totals: { cal: number; protein: number; carbs: number; fat: number; water: number };
  sceneIdx: number;
}) => {
  const scanning = phase === 1;
  const recognized = phase === 2 || phase === 3;
  const logged = phase === 3;
  // Mic is "recording" during the recognized phase for food/beer, and briefly flashes for water
  const micActive = recognized && (scene.type === 'food' || scene.type === 'beer' || scene.type === 'water');
  void sceneIdx;

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        className="absolute -inset-10 -z-10 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 60%, rgba(34, 197, 94,0.22) 0%, rgba(69,183,209,0.08) 45%, transparent 70%)',
        }}
      />

      {/* Phone frame */}
      <div
        className="relative rounded-[44px] p-[3px] phone-float-slow"
        style={{
          width: 320,
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(34, 197, 94,0.12) 40%, rgba(255,255,255,0.05))',
        }}
      >
        <div
          className="relative rounded-[41px] overflow-hidden"
          style={{
            background: '#0a0d12',
            boxShadow:
              '0 40px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: '9/19.5' }}>
            {/* Background image (cross-fades on scene change) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55 }}
                className="absolute inset-0"
              >
                <SceneBackground scene={scene} />
              </motion.div>
            </AnimatePresence>

            {/* Status bar */}
            <div className="absolute top-0 inset-x-0 h-10 px-5 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-white z-30">
              <span className="flex items-center gap-1">
                1:38
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex items-end gap-[1.5px]">
                  <span className="w-[3px] h-[4px] bg-white rounded-[0.5px]" />
                  <span className="w-[3px] h-[6px] bg-white rounded-[0.5px]" />
                  <span className="w-[3px] h-[8px] bg-white/30 rounded-[0.5px]" />
                  <span className="w-[3px] h-[10px] bg-white/30 rounded-[0.5px]" />
                </span>
                <svg width="13" height="11" viewBox="0 0 24 20" fill="currentColor">
                  <path d="M12 4c3.7 0 7.1 1.4 9.7 3.7l1.4-1.4C20.2 3.6 16.3 2 12 2S3.8 3.6.9 6.3l1.4 1.4C4.9 5.4 8.3 4 12 4zm0 4c2.4 0 4.6.9 6.3 2.5l1.4-1.4C17.6 7.1 14.9 6 12 6s-5.6 1.1-7.7 3.1l1.4 1.4C7.4 8.9 9.6 8 12 8zm0 4c1.1 0 2.1.4 2.9 1.1l-2.9 2.9-2.9-2.9c.8-.7 1.8-1.1 2.9-1.1z" />
                </svg>
                <span className="relative inline-flex items-center">
                  <span className="w-[22px] h-[10px] border border-white/60 rounded-[3px] relative">
                    <span className="absolute inset-[1.5px] right-[4px] bg-white rounded-[1px]" />
                  </span>
                  <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-white/60 rounded-r-sm" />
                  <span className="ml-1 text-[10px]">64</span>
                </span>
              </span>
            </div>

            {/* MacroOverlay — spec §6 */}
            <div
              className="absolute top-[50px] left-3 right-3 z-20 rounded-[20px] px-3.5 py-3 dmd-concave"
              style={{
                background: 'rgba(18, 20, 26, 0.78)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Row 1 — big calorie number / goal */}
              <div className="flex items-baseline gap-1.5" style={{ fontFamily: '"SF Pro Rounded", -apple-system, system-ui, sans-serif' }}>
                <AnimatedCount
                  value={totals.cal}
                  className="text-[30px] font-extrabold text-white leading-none"
                  style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
                />
                <span
                  className="text-[13px] font-semibold text-white/50 leading-none"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  / {MACRO_GOALS.cal.toLocaleString()} kcal
                </span>
              </div>

              {/* Row 2 — three concave macro pills */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                <MacroPill label="P" value={totals.protein} goal={MACRO_GOALS.protein} color={MACRO_COLORS.protein} />
                <MacroPill label="C" value={totals.carbs}   goal={MACRO_GOALS.carbs}   color={MACRO_COLORS.carbs} />
                <MacroPill label="F" value={totals.fat}     goal={MACRO_GOALS.fat}     color={MACRO_COLORS.fat} />
              </div>
            </div>

            {/* AF bracket lock-on — four L-shaped corners (center 50%) */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  key={scene.id + '-brackets'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 pointer-events-none"
                >
                  <AFBrackets accent="hsl(145 72% 55%)" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tally marks — water scene only */}
            <AnimatePresence>
              {scene.type === 'water' && recognized && (
                <motion.div
                  key="tally"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute left-1/2 -translate-x-1/2 z-20"
                  style={{ bottom: 188 }}
                >
                  <TallyMarks total={8} />
                  <div className="mt-1.5 text-center text-[9px] font-semibold uppercase tracking-widest text-white/70">
                    +16 oz · 8 today
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* "Logged" confirmation toast */}
            <AnimatePresence>
              {logged && (
                <motion.div
                  key={scene.id + '-toast'}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.0, 1.0, 0.95] }}
                  transition={{ duration: 1.15, times: [0, 0.3, 0.7, 1], ease: EASING.overshoot }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: 'hsl(145 72% 50%)',
                      boxShadow: '0 10px 30px -6px hsl(145 72% 50% / 0.7), inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}
                  >
                    <Check size={28} className="text-white" strokeWidth={3.2} />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                      Logged
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Precision Mode + Flash toggles (above composer, one each side) */}
            <div className="absolute left-0 right-0 z-20 px-5 flex items-center justify-between" style={{ bottom: 130 }}>
              <ToggleButton icon={Crosshair} label="Precision" active={scanning} />
              <ToggleButton icon={Zap} label="Flash" />
            </div>

            {/* Composer ribbon — concave pill */}
            <div className="absolute left-4 right-4 z-20" style={{ bottom: 66 }}>
              <div
                className="dmd-concave rounded-[26px] flex items-center gap-3 px-4"
                style={{
                  height: 52,
                  background: 'rgba(18, 20, 26, 0.82)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                }}
              >
                {/* Left icon - mic */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: micActive ? 'hsl(145 72% 50%)' : 'rgba(255,255,255,0.08)',
                    transition: 'background 250ms',
                    boxShadow: micActive ? '0 0 16px hsl(145 72% 50% / 0.6)' : 'none',
                  }}
                >
                  <Mic size={14} className={micActive ? 'text-black' : 'text-white/80'} strokeWidth={2.4} />
                </div>

                {/* Middle — waveform or cursor */}
                <div className="flex-1 h-full flex items-center justify-center">
                  {micActive ? (
                    <ComposerWaveform />
                  ) : (
                    <div className="flex items-center gap-1.5 text-[12px] text-white/50">
                      <span className="inline-block w-[1.5px] h-[14px] bg-white/50 animate-pulse" />
                      <span className="italic">Tap to narrate</span>
                    </div>
                  )}
                </div>

                {/* Right — keyboard swap */}
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Keyboard size={14} className="text-white/70" strokeWidth={2.2} />
                </div>
              </div>
            </div>

            {/* MealsPanel peek — drawer handle */}
            <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <ChevronUp size={11} className="text-white/55" strokeWidth={2.5} />
                <div className="w-10 h-1 rounded-full bg-white/40" />
              </div>
              <span className="absolute left-1/2 translate-x-[28px] text-[9px] font-semibold uppercase tracking-widest text-white/55 whitespace-nowrap">
                3 meals today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scene pips */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {SCENES.map((s, i) => {
          const active = i === sceneIdx;
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`flex items-center gap-1.5 rounded-full transition-all duration-500 ${
                active ? 'px-2.5 py-1 bg-accent-green/15 border border-accent-green/30' : 'px-1 py-1'
              }`}
            >
              <Icon size={11} className={active ? 'text-accent-green' : 'text-muted-foreground/40'} />
              {active && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-accent-green whitespace-nowrap"
                >
                  {s.id === 'food' ? 'Meal' : s.id === 'water' ? 'Water' : 'Alcohol'}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═════════════════════════ Sub-components ═════════════════════════ */

const SceneBackground = ({ scene }: { scene: Scene }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at center, #2a1d10 0%, #140c06 55%, #070504 100%)',
      }}
    />
    <motion.img
      src={scene.image}
      alt=""
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        objectPosition: scene.imagePos,
        filter: 'brightness(0.74) contrast(1.08) saturate(1.1)',
      }}
      initial={{ scale: 1.06 }}
      animate={{ scale: [1.06, 1.12, 1.06] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Vignette */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 30%, rgba(0,0,0,0.58) 95%)',
      }}
    />
    {/* Top + bottom readability tint */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.08) 25%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.55) 100%)',
      }}
    />
    {/* Grain */}
    <svg className="absolute inset-0 w-full h-full opacity-25 mix-blend-overlay pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <filter id="cam-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cam-grain)" />
    </svg>
  </div>
);

/* Concave macro pill (P/C/F) with micro fill bar — spec §6 */
const MacroPill = ({
  label,
  value,
  goal,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  color: string;
}) => {
  const pct = Math.min(100, Math.max(0, (value / goal) * 100));
  return (
    <div
      className="dmd-concave rounded-[10px] px-2 py-1.5 flex flex-col gap-1"
      style={{ background: 'rgba(10, 12, 16, 0.55)' }}
    >
      <div className="flex items-baseline gap-1" style={{ fontFamily: '"SF Pro Rounded", -apple-system, system-ui, sans-serif' }}>
        <span className="text-[10px] font-bold uppercase" style={{ color }}>{label}</span>
        <AnimatedCount
          value={value}
          className="text-[13px] font-extrabold text-white leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        />
        <span className="text-[10px] font-semibold text-white/50 leading-none">g</span>
      </div>
      {/* micro fill bar */}
      <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}99` }}
        />
      </div>
    </div>
  );
};

/* AF brackets — four L-shaped corners covering center 50% */
const AFBrackets = ({ accent }: { accent: string }) => {
  const cornerStyle = (rotate: number): React.CSSProperties => ({
    position: 'absolute',
    width: 22,
    height: 22,
    borderLeft: `2px solid ${accent}`,
    borderTop: `2px solid ${accent}`,
    transform: `rotate(${rotate}deg)`,
    filter: `drop-shadow(0 0 6px ${accent})`,
  });
  const inset = '25%';
  return (
    <motion.div
      initial={{ scale: 1.25, opacity: 0 }}
      animate={{ scale: 1, opacity: [0.4, 1, 0.4] }}
      transition={{
        scale: { duration: 0.3, ease: 'easeOut' },
        opacity: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
      }}
      className="absolute"
      style={{ top: inset, left: inset, right: inset, bottom: inset }}
    >
      <div style={{ ...cornerStyle(0), top: 0, left: 0 }} />
      <div style={{ ...cornerStyle(90), top: 0, right: 0 }} />
      <div style={{ ...cornerStyle(180), bottom: 0, right: 0 }} />
      <div style={{ ...cornerStyle(270), bottom: 0, left: 0 }} />
    </motion.div>
  );
};

/* Tally marks SVG — each stroke animates via stroke-dashoffset */
const TallyMarks = ({ total }: { total: number }) => {
  const groups = Math.floor(total / 5);
  const remainder = total % 5;
  const groupWidth = 32;
  const gap = 10;
  const svgWidth = groups * (groupWidth + gap) + (remainder > 0 ? remainder * 6 + gap : 0);
  return (
    <svg width={svgWidth} height="22" viewBox={`0 0 ${svgWidth} 22`} fill="none" style={{ overflow: 'visible' }}>
      {Array.from({ length: groups }).map((_, gi) => {
        const x = gi * (groupWidth + gap);
        return (
          <g key={gi}>
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={x + i * 6}
                y1={0}
                x2={x + i * 6}
                y2={20}
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                style={{
                  strokeDasharray: 22,
                  strokeDashoffset: 22,
                  animation: `tallyDraw 0.5s ${gi * 0.25 + i * 0.08}s forwards ease-out`,
                }}
              />
            ))}
            {/* diagonal crossing all 4 */}
            <line
              x1={x - 2}
              y1={18}
              x2={x + 20}
              y2={2}
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 30,
                animation: `tallyDraw 0.5s ${gi * 0.25 + 0.35}s forwards ease-out`,
              }}
            />
          </g>
        );
      })}
      {Array.from({ length: remainder }).map((_, i) => {
        const x = groups * (groupWidth + gap) + i * 6;
        return (
          <line
            key={`r${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={20}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            style={{
              strokeDasharray: 22,
              strokeDashoffset: 22,
              animation: `tallyDraw 0.5s ${groups * 0.25 + i * 0.08}s forwards ease-out`,
            }}
          />
        );
      })}
      <style>{`@keyframes tallyDraw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
};

/* 8-bar composer waveform */
const ComposerWaveform = () => {
  const bars = Array.from({ length: 8 });
  return (
    <div className="flex items-center justify-center gap-[3px] h-full w-full">
      {bars.map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: 'hsl(145 72% 55%)',
            height: '60%',
            animation: `wavePulse 0.9s ${i * 0.08}s infinite ease-in-out alternate`,
            boxShadow: '0 0 4px hsl(145 72% 55% / 0.6)',
          }}
        />
      ))}
      <style>{`@keyframes wavePulse { 0% { height: 20%; } 100% { height: 100%; } }`}</style>
    </div>
  );
};

/* Flash / Precision small round toggle */
const ToggleButton = ({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  label: string;
  active?: boolean;
}) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="dmd-concave w-9 h-9 rounded-full flex items-center justify-center"
      style={{
        background: active ? 'rgba(34, 197, 94, 0.25)' : 'rgba(18, 20, 26, 0.82)',
        backdropFilter: 'blur(14px)',
        border: active ? '1px solid hsl(145 72% 50% / 0.6)' : undefined,
      }}
    >
      <Icon
        size={14}
        strokeWidth={2.3}
        className={active ? 'text-accent-green' : 'text-white/80'}
      />
    </div>
    <span
      className="text-[8px] font-bold uppercase tracking-[0.1em]"
      style={{ color: active ? 'hsl(145 72% 60%)' : 'rgba(255,255,255,0.55)' }}
    >
      {label}
    </span>
  </div>
);

const AnimatedCount = ({
  value,
  className,
  style,
  decimals = 0,
  suffix = '',
}: {
  value: number;
  className?: string;
  style?: React.CSSProperties;
  decimals?: number;
  suffix?: string;
}) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (Math.abs(diff) < 0.001) return;
    const startAt = performance.now();
    const duration = 700;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(start + diff * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();
  return (
    <span className={className} style={style}>
      {formatted}
      {suffix}
    </span>
  );
};

export default CalorieLoggingSection;
