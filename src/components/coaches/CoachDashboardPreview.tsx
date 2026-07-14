import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell, Weight, Utensils, Zap, BarChart3, Droplets,
  Heart, PieChart, Plus, Minus, Search, ChevronDown, Stethoscope,
  PersonStanding, Check,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { RealMuscleMap, BACK_REMAP } from '@/components/landing/MuscleMapSection';

// ---------------------------------------------------------------------------
// CoachDashboardPreview — the flagship /coaches proof. A faithful, interactive
// recreation of the real RYZN "Teammate" detail screen a coach sees when they
// tap an athlete: season score, auto-verified stats, muscle focus, coach
// insights, assignable macros, deep-dive tabs. Coaches toggle between three
// mock athletes; switching morphs every value IN PLACE (numbers count, rings
// re-fill, bars re-height) rather than a full fade. The phone matches the
// house frame + the app's own dark-gray surface, and scrolls with a custom
// draggable scrollbar on the right edge.
// ---------------------------------------------------------------------------

const BLUE = '#0A84FF';
const APP_BG = '#0D0D0F';
const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

type Emphasis = Record<string, number>;
type Macros = { calories: number; protein: number; carbs: number; fat: number };

type Athlete = {
  id: string;
  name: string;
  first: string;
  initials: string;
  position: string;
  grad: [string, string];
  score: number;
  workouts: number;
  volume: number;
  daysLogged: number;
  avgProtein: number;
  volPerWorkout: number;
  loggingRate: number;
  foodScore: number;
  consistency: number;
  avgHR: number;
  front: Emphasis;
  back: Emphasis;
  macros: Macros;
  nutrition: number[];
  workoutsBars: number[];
  lifts: { name: string; value: number; trend: number[] }[];
};

const ATHLETES: Athlete[] = [
  {
    id: 'marcus', name: 'Marcus Bell', first: 'Marcus', initials: 'MB', position: 'RB · #22',
    grad: ['#2563eb', '#1e40af'], score: 84,
    workouts: 47, volume: 214600, daysLogged: 58, avgProtein: 172, volPerWorkout: 4570, loggingRate: 91,
    foodScore: 79, consistency: 88, avgHR: 148,
    front: { shoulders: 1, chest: 1, arms: 1, forearms: 1, core: 2, upper_back: 1, quads: 3 },
    back: { lats: 1, rear_delts: 1, triceps: 1, forearms: 1, lower_back: 2, upper_back: 1, hamstrings: 3 },
    macros: { calories: 3200, protein: 195, carbs: 360, fat: 90 },
    nutrition: [3100, 3260, 2980, 3340, 3180, 2890, 3220],
    workoutsBars: [38, 52, 44, 61, 49, 57],
    lifts: [
      { name: 'Back Squat', value: 405, trend: [355, 365, 380, 390, 405] },
      { name: 'Power Clean', value: 245, trend: [215, 225, 230, 240, 245] },
      { name: 'Bench Press', value: 275, trend: [245, 255, 260, 270, 275] },
    ],
  },
  {
    id: 'diego', name: 'Diego Torres', first: 'Diego', initials: 'DT', position: 'WR · #10',
    grad: ['#16a34a', '#065f46'], score: 76,
    workouts: 39, volume: 168200, daysLogged: 51, avgProtein: 158, volPerWorkout: 4310, loggingRate: 84,
    foodScore: 82, consistency: 80, avgHR: 156,
    front: { shoulders: 2, chest: 2, arms: 2, forearms: 1, core: 2, upper_back: 1, quads: 2 },
    back: { lats: 2, rear_delts: 2, triceps: 2, forearms: 1, lower_back: 1, upper_back: 2, hamstrings: 2 },
    macros: { calories: 2850, protein: 180, carbs: 300, fat: 78 },
    nutrition: [2790, 2910, 2680, 2950, 2830, 2710, 2880],
    workoutsBars: [30, 41, 36, 47, 39, 43],
    lifts: [
      { name: 'Trap Bar DL', value: 365, trend: [315, 330, 340, 355, 365] },
      { name: 'Bench Press', value: 235, trend: [205, 215, 220, 230, 235] },
      { name: 'Front Squat', value: 285, trend: [245, 255, 265, 275, 285] },
    ],
  },
  {
    id: 'tyler', name: 'Tyler Nguyen', first: 'Tyler', initials: 'TN', position: 'LB · #45',
    grad: ['#f97316', '#b45309'], score: 91,
    workouts: 54, volume: 262400, daysLogged: 63, avgProtein: 188, volPerWorkout: 4860, loggingRate: 95,
    foodScore: 90, consistency: 93, avgHR: 141,
    front: { shoulders: 3, chest: 3, arms: 2, forearms: 2, core: 2, upper_back: 2, quads: 3 },
    back: { lats: 3, rear_delts: 3, triceps: 2, forearms: 2, lower_back: 2, upper_back: 3, hamstrings: 2 },
    macros: { calories: 3450, protein: 210, carbs: 380, fat: 95 },
    nutrition: [3420, 3510, 3380, 3460, 3400, 3290, 3480],
    workoutsBars: [44, 58, 51, 66, 55, 62],
    lifts: [
      { name: 'Back Squat', value: 455, trend: [405, 420, 435, 445, 455] },
      { name: 'Deadlift', value: 495, trend: [435, 455, 470, 485, 495] },
      { name: 'Bench Press', value: 315, trend: [275, 290, 300, 310, 315] },
    ],
  },
];

const fmtVol = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

// Count-up number that tweens whenever its target changes — this is what makes
// an athlete switch feel like the values "shift" instead of fade out and in.
const AnimatedNumber = ({
  value,
  format,
}: {
  value: number;
  format?: (n: number) => string;
}) => {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) {
      setDisplay(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 620;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format ? format(display) : display.toLocaleString()}</>;
};

// Small circular progress ring used for Score / Food Score / Consistency.
const Ring = ({ value, color, size = 54, label }: { value: number; color: string; size?: number; label?: string }) => {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={c}
            initial={false}
            animate={{ strokeDashoffset: c - (Math.min(100, value) / 100) * c }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color, fontSize: size * 0.3 }}>
          <AnimatedNumber value={value} format={(n) => `${n}`} />
        </div>
      </div>
      {label && <span className="mt-1 text-[10px] font-semibold tracking-wide text-white/45 uppercase">{label}</span>}
    </div>
  );
};

const StatTile = ({ icon: Icon, value, label, format }: { icon: any; value: number; label: string; format?: (n: number) => string }) => (
  <div className="flex flex-col items-center gap-1 py-2.5">
    <Icon size={15} style={{ color: BLUE }} />
    <span className="text-white font-bold text-[16px] leading-none tabular-nums">
      <AnimatedNumber value={value} format={format} />
    </span>
    <span className="text-white/40 text-[10px]">{label}</span>
  </div>
);

const Card = ({ children, className = '', pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) => (
  <div
    className={`rounded-2xl ${pad ? 'p-3.5' : ''} ${className}`}
    style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
  >
    {children}
  </div>
);

const MiniBars = ({ data, color = BLUE }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-11">
      {data.map((d, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-[3px]"
          style={{ background: i === data.length - 1 ? color : `${color}55` }}
          initial={false}
          animate={{ height: `${(d / max) * 100}%` }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
};

const DEEP_TABS = ['Nutrition', 'Workouts', 'Strength'] as const;
type DeepTab = (typeof DEEP_TABS)[number];

const CoachDashboardPreview = () => {
  const [activeId, setActiveId] = useState(ATHLETES[0].id);
  const athlete = useMemo(() => ATHLETES.find((a) => a.id === activeId)!, [activeId]);

  const [deepTab, setDeepTab] = useState<DeepTab>('Nutrition');
  const [editingMacros, setEditingMacros] = useState(false);
  const [draft, setDraft] = useState<Macros>(athlete.macros);
  const [savedFlash, setSavedFlash] = useState(false);

  // Reset the macro draft + close the editor whenever the coach switches athlete.
  useEffect(() => {
    setDraft(athlete.macros);
    setEditingMacros(false);
  }, [athlete]);

  const step = (key: keyof Macros, delta: number) =>
    setDraft((d) => ({ ...d, [key]: Math.max(0, d[key] + delta) }));

  const saveMacros = () => {
    setEditingMacros(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  // ---- custom draggable scrollbar -----------------------------------------
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ progress: 0, thumb: 0.28 });

  const measure = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScroll({
      progress: max > 0 ? el.scrollTop / max : 0,
      thumb: Math.max(0.14, Math.min(1, el.clientHeight / el.scrollHeight)),
    });
  };

  useEffect(() => {
    measure();
    // Content height changes when athlete / editor / tab changes.
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [athlete, editingMacros, deepTab]);

  const startThumbDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    const move = (ev: PointerEvent) => {
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const rect = track.getBoundingClientRect();
      const thumbH = scroll.thumb * rect.height;
      let p = (ev.clientY - rect.top - thumbH / 2) / (rect.height - thumbH);
      p = Math.max(0, Math.min(1, p));
      el.scrollTop = p * (el.scrollHeight - el.clientHeight);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <section className="relative py-20 lg:py-28">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, hsl(var(--primary) / 0.07) 0%, transparent 70%)' }}
      />
      <div className="relative max-w-[1200px] mx-auto px-6">
        <motion.div
          className="text-center max-w-[760px] mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
          >
            The coach view
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
          >
            Tap any athlete. See everything.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-4 text-foreground/70 text-lg">
            This is the exact screen you get on every athlete — auto-verified training and
            nutrition, a live muscle map, and macros you assign in a tap. No self-reporting,
            no chasing. Switch between athletes below and scroll through it.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: athlete switcher + coach-facing bullets */}
          <div className="order-2 lg:order-1">
            <p className="text-foreground/45 text-xs font-semibold tracking-widest uppercase mb-3">Your roster</p>
            <div className="space-y-2 max-w-[320px]">
              {ATHLETES.map((a) => {
                const on = a.id === activeId;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveId(a.id)}
                    className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all duration-300 border"
                    style={{
                      background: on ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      borderColor: on ? 'hsl(var(--primary) / 0.45)' : 'rgba(255,255,255,0.06)',
                      boxShadow: on ? '0 10px 30px -12px hsl(var(--primary) / 0.45)' : 'none',
                    }}
                  >
                    <span
                      className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[13px]"
                      style={{ background: `linear-gradient(135deg, ${a.grad[0]}, ${a.grad[1]})` }}
                    >
                      {a.initials}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-foreground font-semibold text-[13.5px] truncate">{a.name}</span>
                      <span className="block text-foreground/45 text-[11.5px]">{a.position}</span>
                    </span>
                    <span className="text-right shrink-0">
                      <span className="block font-bold text-[15px] tabular-nums leading-none" style={{ color: on ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.6)' }}>{a.score}</span>
                      <span className="block text-foreground/35 text-[9px] tracking-wider uppercase mt-0.5">Score</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2.5 max-w-[340px]">
              {[
                'Every stat auto-verified from their logs — never self-reported',
                'Live muscle-focus map from their real training volume',
                'Assign calorie & macro targets in one tap',
                'Deep-dive nutrition, workouts and strength trends',
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5 text-foreground/65 text-sm">
                  <Check size={15} className="text-primary shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the phone — house frame, app surface, custom scrollbar */}
          <div className="order-1 lg:order-2 justify-self-center">
            <div
              className="relative w-[330px] rounded-[44px] p-[3px]"
              style={{
                background: '#1c1c1e',
                boxShadow: '0 40px 90px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {/* screen */}
              <div className="relative rounded-[41px] overflow-hidden" style={{ background: APP_BG, height: 660 }}>
                {/* dynamic island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[96px] h-[26px] rounded-full bg-black" />

                {/* scrollable content */}
                <div
                  ref={scrollRef}
                  onScroll={measure}
                  className="absolute inset-0 pt-10 pb-8 px-3.5 overflow-y-auto hide-scrollbar"
                >
                  <div className="space-y-3">
                    {/* profile */}
                    <Card className="flex items-center gap-3">
                      <span
                        className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-[15px]"
                        style={{ background: `linear-gradient(135deg, ${athlete.grad[0]}, ${athlete.grad[1]})` }}
                      >
                        {athlete.initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-[16px] leading-tight truncate">{athlete.name}</div>
                        <div className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mt-0.5">{athlete.position} · This season</div>
                      </div>
                      <Ring value={athlete.score} color={BLUE} label="Score" />
                    </Card>

                    {/* stats grid */}
                    <Card pad={false} className="overflow-hidden">
                      <div className="grid grid-cols-3 divide-x divide-y divide-white/[0.06]">
                        <StatTile icon={Dumbbell} value={athlete.workouts} label="Workouts" />
                        <StatTile icon={Weight} value={athlete.volume} label="Volume" format={(n) => `${fmtVol(n)} lb`} />
                        <StatTile icon={Utensils} value={athlete.daysLogged} label="Days Logged" />
                        <StatTile icon={Zap} value={athlete.avgProtein} label="Avg Protein" format={(n) => `${n}g`} />
                        <StatTile icon={BarChart3} value={athlete.volPerWorkout} label="Vol / Workout" format={(n) => `${fmtVol(n)} lb`} />
                        <StatTile icon={Droplets} value={athlete.loggingRate} label="Logging Rate" format={(n) => `${n}%`} />
                      </div>
                    </Card>
                    <p className="text-white/35 text-[11px] text-center leading-snug px-3">
                      All stats are auto-verified from {athlete.first}'s logged workouts and nutrition — no self-reporting.
                    </p>

                    {/* muscle focus */}
                    <Card>
                      <div className="flex items-center gap-2 mb-2">
                        <PersonStanding size={15} style={{ color: BLUE }} />
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Muscle Focus</span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex flex-col items-center">
                          <RealMuscleMap state={athlete.front} className="w-[108px] h-auto" />
                          <span className="text-white/30 text-[9px] tracking-widest uppercase">Front</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div style={{ transform: 'scaleX(-1)' }}>
                            <RealMuscleMap state={athlete.back} remap={BACK_REMAP} className="w-[108px] h-auto" />
                          </div>
                          <span className="text-white/30 text-[9px] tracking-widest uppercase">Back</span>
                        </div>
                      </div>
                      <p className="text-white/35 text-[10.5px] leading-snug mt-1">
                        Emphasis spread from {athlete.first}'s verified training volume — green is dialed, red is heavy.
                      </p>
                    </Card>

                    {/* coach insights */}
                    <Card>
                      <div className="flex items-center gap-2 mb-3">
                        <Stethoscope size={15} style={{ color: BLUE }} />
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Coach Insights</span>
                      </div>
                      <div className="flex items-start justify-around">
                        <Ring value={athlete.foodScore} color="#ff453a" size={52} label="Food Score" />
                        <Ring value={athlete.consistency} color="#ff453a" size={52} label="Consistency" />
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center" style={{ width: 52, height: 52 }}>
                            <Heart size={20} className="fill-[#ff453a] text-[#ff453a]" />
                          </div>
                          <span className="text-white font-bold text-[14px] leading-none -mt-2 tabular-nums">
                            <AnimatedNumber value={athlete.avgHR} format={(n) => `${n}`} />
                          </span>
                          <span className="mt-1 text-[10px] font-semibold tracking-wide text-white/45 uppercase">Avg HR</span>
                        </div>
                      </div>
                    </Card>

                    {/* assigned macros — interactive */}
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <PieChart size={15} style={{ color: BLUE }} />
                          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Assigned Macros</span>
                        </div>
                        {savedFlash && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#30d158' }}>
                            <Check size={13} /> Saved
                          </span>
                        )}
                      </div>

                      {!editingMacros ? (
                        <>
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-white font-bold text-[24px] leading-none tabular-nums">
                                <AnimatedNumber value={draft.calories} />
                              </div>
                              <div className="text-white/40 text-[11px] mt-0.5">daily calories</div>
                            </div>
                            <div className="flex gap-4 text-center">
                              {([['P', draft.protein, '#0A84FF'], ['C', draft.carbs, '#30d158'], ['F', draft.fat, '#ff9f0a']] as const).map(([k, v, c]) => (
                                <div key={k}>
                                  <div className="font-bold text-[14px] tabular-nums" style={{ color: c }}>
                                    <AnimatedNumber value={v} format={(n) => `${n}g`} />
                                  </div>
                                  <div className="text-white/35 text-[10px]">{k}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingMacros(true)}
                            className="mt-3 w-full py-2.5 rounded-full font-semibold text-white text-[13px] flex items-center justify-center gap-1.5"
                            style={{ background: BLUE }}
                          >
                            <Plus size={14} /> Assign Macros
                          </button>
                        </>
                      ) : (
                        <div className="space-y-2.5">
                          {([['Calories', 'calories', 50], ['Protein', 'protein', 5], ['Carbs', 'carbs', 5], ['Fat', 'fat', 5]] as const).map(([label, key, d]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-white/70 text-[12px]">{label}</span>
                              <div className="flex items-center gap-3">
                                <button onClick={() => step(key, -d)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition">
                                  <Minus size={13} />
                                </button>
                                <span className="text-white font-bold text-[13px] tabular-nums w-14 text-center">
                                  {draft[key].toLocaleString()}{key === 'calories' ? '' : 'g'}
                                </span>
                                <button onClick={() => step(key, d)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition">
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={saveMacros}
                            className="mt-1 w-full py-2.5 rounded-full font-semibold text-white text-[13px]"
                            style={{ background: BLUE }}
                          >
                            Save targets
                          </button>
                        </div>
                      )}
                    </Card>

                    {/* deep dive — interactive tabs */}
                    <Card>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Search size={14} style={{ color: BLUE }} />
                          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Deep Dive</span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: BLUE }}>Last 30 days <ChevronDown size={12} /></span>
                      </div>
                      <div className="flex gap-1 p-1 rounded-full bg-white/[0.06] mb-3">
                        {DEEP_TABS.map((t) => (
                          <button
                            key={t}
                            onClick={() => setDeepTab(t)}
                            className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold transition ${deepTab === t ? 'bg-white/15 text-white' : 'text-white/45'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {deepTab === 'Nutrition' && (
                        <div>
                          <MiniBars data={athlete.nutrition} color="#30d158" />
                          <div className="flex justify-between mt-3 text-center">
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={Math.round(athlete.nutrition.reduce((a, b) => a + b, 0) / athlete.nutrition.length)} /></div><div className="text-white/35 text-[10px]">avg cal</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.loggingRate} format={(n) => `${n}%`} /></div><div className="text-white/35 text-[10px]">logged</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.avgProtein} format={(n) => `${n}g`} /></div><div className="text-white/35 text-[10px]">avg protein</div></div>
                          </div>
                        </div>
                      )}
                      {deepTab === 'Workouts' && (
                        <div>
                          <MiniBars data={athlete.workoutsBars} color={BLUE} />
                          <div className="flex justify-between mt-3 text-center">
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.workouts} format={(n) => `${n}`} /></div><div className="text-white/35 text-[10px]">sessions</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.volume} format={(n) => fmtVol(n)} /></div><div className="text-white/35 text-[10px]">total lb</div></div>
                            <div><div className="text-white font-bold text-[14px] tabular-nums"><AnimatedNumber value={athlete.daysLogged} format={(n) => `${n}`} /></div><div className="text-white/35 text-[10px]">days active</div></div>
                          </div>
                        </div>
                      )}
                      {deepTab === 'Strength' && (
                        <div className="space-y-2.5">
                          {athlete.lifts.map((l) => (
                            <div key={l.name} className="flex items-center gap-3">
                              <span className="flex-1 text-white/75 text-[12px]">{l.name}</span>
                              <div className="flex items-end gap-[3px] h-6">
                                {l.trend.map((v, i) => {
                                  const mx = Math.max(...l.trend);
                                  return (
                                    <motion.div
                                      key={i}
                                      className="w-[5px] rounded-t-[2px]"
                                      initial={false}
                                      animate={{ height: `${(v / mx) * 100}%` }}
                                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                      style={{ background: i === l.trend.length - 1 ? BLUE : `${BLUE}55` }}
                                    />
                                  );
                                })}
                              </div>
                              <span className="text-white font-bold text-[13px] tabular-nums w-14 text-right"><AnimatedNumber value={l.value} format={(n) => `${n} lb`} /></span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </div>

                {/* custom draggable scrollbar */}
                <div ref={trackRef} className="absolute right-1.5 top-10 bottom-3 w-1.5 z-30">
                  <div className="relative w-full h-full">
                    <div
                      onPointerDown={startThumbDrag}
                      className="absolute left-0 w-full rounded-full cursor-grab active:cursor-grabbing transition-colors"
                      style={{
                        height: `${scroll.thumb * 100}%`,
                        top: `${scroll.progress * (1 - scroll.thumb) * 100}%`,
                        background: 'rgba(255,255,255,0.28)',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoachDashboardPreview;
