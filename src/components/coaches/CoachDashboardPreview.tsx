import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share, Dumbbell, Weight, Utensils, Zap, BarChart3, Droplets,
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
// mock athletes and can actually poke the macros + deep-dive tabs. Everything
// inside the phone uses the app's iOS-blue chrome so it reads as the product.
// ---------------------------------------------------------------------------

const BLUE = '#0A84FF';

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

// Small circular progress ring used for Score / Food Score / Consistency.
const Ring = ({ value, color, size = 62, label }: { value: number; color: string; size?: number; label?: string }) => {
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
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ color, fontSize: size * 0.3 }}>
          {value}
        </div>
      </div>
      {label && <span className="mt-1.5 text-[11px] font-semibold tracking-wide text-white/45 uppercase">{label}</span>}
    </div>
  );
};

const StatTile = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1 py-3">
    <Icon size={17} style={{ color: BLUE }} />
    <span className="text-white font-bold text-[19px] leading-none tabular-nums">{value}</span>
    <span className="text-white/40 text-[11px]">{label}</span>
  </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-[18px] bg-[#1c1c1e] p-4 ${className}`}>{children}</div>
);

const MiniBars = ({ data, color = BLUE }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-[3px]"
          style={{ background: i === data.length - 1 ? color : `${color}55` }}
          initial={{ height: 0 }}
          animate={{ height: `${(d / max) * 100}%` }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
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
            no chasing. Switch between athletes below and try it.
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
            <div className="space-y-2.5">
              {ATHLETES.map((a) => {
                const on = a.id === activeId;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveId(a.id)}
                    className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-300 border ${
                      on
                        ? 'bg-[rgba(255,255,255,0.05)] border-primary/40 shadow-[0_10px_30px_-12px_rgba(34,197,94,0.4)]'
                        : 'bg-[rgba(255,255,255,0.02)] border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <span
                      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ background: `linear-gradient(135deg, ${a.grad[0]}, ${a.grad[1]})` }}
                    >
                      {a.initials}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-foreground font-semibold text-[15px] truncate">{a.name}</span>
                      <span className="block text-foreground/45 text-[13px]">{a.position}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-bold tabular-nums" style={{ color: on ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.6)' }}>{a.score}</span>
                      <span className="block text-foreground/35 text-[10px] tracking-wider uppercase">Score</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-2.5">
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

          {/* Right: the phone */}
          <div className="order-1 lg:order-2 justify-self-center">
            <div
              className="relative w-[340px] rounded-[46px] p-[10px] bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* screen */}
              <div className="relative rounded-[38px] overflow-hidden bg-black h-[680px]">
                {/* status bar */}
                <div className="absolute top-0 left-0 right-0 z-20 h-11 px-7 flex items-center justify-between text-white text-[13px] font-semibold pointer-events-none">
                  <span>10:49</span>
                  <span className="absolute left-1/2 -translate-x-1/2 top-2 w-[92px] h-[26px] bg-black rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <span className="tracking-[-2px] text-[10px]">••••</span>
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M8 2.5c2 0 3.8.8 5.2 2l1.1-1.2C13.7 1.6 11 .5 8 .5S2.3 1.6.7 3.3L1.8 4.5C3.2 3.3 6 2.5 8 2.5z" opacity="0.9"/><path d="M8 6c1.1 0 2.1.4 2.8 1.1l1.1-1.2C10.9 4.8 9.5 4.2 8 4.2s-2.9.6-3.9 1.7l1.1 1.2C6 6.4 6.9 6 8 6z"/><circle cx="8" cy="9.5" r="1.5"/></svg>
                    <span className="ml-0.5 inline-block w-6 h-3 rounded-[3px] border border-white/60 relative"><span className="absolute inset-[1.5px] right-[3px] bg-white rounded-[1px]" /></span>
                  </span>
                </div>

                {/* scrollable content */}
                <div className="absolute inset-0 pt-11 overflow-y-auto hide-scrollbar">
                  {/* sheet header */}
                  <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
                    <span className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center" style={{ color: BLUE }}>
                      <Share size={16} />
                    </span>
                    <span className="text-white font-semibold text-[17px]">Teammate</span>
                    <span className="px-4 py-1.5 rounded-full border border-white/15 font-semibold text-[15px]" style={{ color: BLUE }}>Done</span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={athlete.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-8 space-y-3"
                    >
                      {/* profile */}
                      <Card className="flex items-center gap-3">
                        <span
                          className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-lg"
                          style={{ background: `linear-gradient(135deg, ${athlete.grad[0]}, ${athlete.grad[1]})` }}
                        >
                          {athlete.initials}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-bold text-[22px] leading-tight truncate">{athlete.name}</div>
                          <div className="text-white/40 text-[12px] font-semibold tracking-widest uppercase">This season</div>
                        </div>
                        <Ring value={athlete.score} color={BLUE} label="Score" />
                      </Card>

                      {/* stats grid */}
                      <Card className="!p-0 overflow-hidden">
                        <div className="grid grid-cols-3 divide-x divide-y divide-white/[0.06]">
                          <StatTile icon={Dumbbell} value={`${athlete.workouts}`} label="Workouts" />
                          <StatTile icon={Weight} value={`${fmtVol(athlete.volume)} lb`} label="Volume" />
                          <StatTile icon={Utensils} value={`${athlete.daysLogged}`} label="Days Logged" />
                          <StatTile icon={Zap} value={`${athlete.avgProtein}g`} label="Avg Protein" />
                          <StatTile icon={BarChart3} value={`${fmtVol(athlete.volPerWorkout)} lb`} label="Vol / Workout" />
                          <StatTile icon={Droplets} value={`${athlete.loggingRate}%`} label="Logging Rate" />
                        </div>
                      </Card>
                      <p className="text-white/35 text-[12px] text-center leading-snug px-3">
                        All stats are auto-verified from {athlete.first}'s logged workouts and nutrition — no self-reporting.
                      </p>

                      {/* muscle focus */}
                      <Card>
                        <div className="flex items-center gap-2 mb-2">
                          <PersonStanding size={16} style={{ color: BLUE }} />
                          <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Muscle Focus</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex flex-col items-center">
                            <RealMuscleMap state={athlete.front} className="w-[120px] h-auto" />
                            <span className="text-white/30 text-[9px] tracking-widest uppercase">Front</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <RealMuscleMap state={athlete.back} remap={BACK_REMAP} className="w-[120px] h-auto" />
                            <span className="text-white/30 text-[9px] tracking-widest uppercase">Back</span>
                          </div>
                        </div>
                        <p className="text-white/35 text-[11px] leading-snug mt-1">
                          Emphasis spread from {athlete.first}'s verified training volume — green is dialed, red is heavy.
                        </p>
                      </Card>

                      {/* coach insights */}
                      <Card>
                        <div className="flex items-center gap-2 mb-3">
                          <Stethoscope size={16} style={{ color: BLUE }} />
                          <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Coach Insights</span>
                        </div>
                        <div className="flex items-start justify-around">
                          <Ring value={athlete.foodScore} color="#ff453a" size={58} label="Food Score" />
                          <Ring value={athlete.consistency} color="#ff453a" size={58} label="Consistency" />
                          <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center" style={{ width: 58, height: 58 }}>
                              <Heart size={22} className="fill-[#ff453a] text-[#ff453a]" />
                            </div>
                            <span className="text-white font-bold text-[15px] leading-none -mt-2">{athlete.avgHR}</span>
                            <span className="mt-1.5 text-[11px] font-semibold tracking-wide text-white/45 uppercase">Avg HR</span>
                          </div>
                        </div>
                      </Card>

                      {/* assigned macros — interactive */}
                      <Card>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <PieChart size={16} style={{ color: BLUE }} />
                            <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Assigned Macros</span>
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
                                <div className="text-white font-bold text-[26px] leading-none tabular-nums">{draft.calories.toLocaleString()}</div>
                                <div className="text-white/40 text-[11px] mt-0.5">daily calories</div>
                              </div>
                              <div className="flex gap-4 text-center">
                                {([['P', draft.protein, '#0A84FF'], ['C', draft.carbs, '#30d158'], ['F', draft.fat, '#ff9f0a']] as const).map(([k, v, c]) => (
                                  <div key={k}>
                                    <div className="font-bold text-[15px] tabular-nums" style={{ color: c }}>{v}g</div>
                                    <div className="text-white/35 text-[10px]">{k}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => setEditingMacros(true)}
                              className="mt-3 w-full py-2.5 rounded-full font-semibold text-white text-[14px] flex items-center justify-center gap-1.5"
                              style={{ background: BLUE }}
                            >
                              <Plus size={15} /> Assign Macros
                            </button>
                          </>
                        ) : (
                          <div className="space-y-2.5">
                            {([['Calories', 'calories', 50], ['Protein', 'protein', 5], ['Carbs', 'carbs', 5], ['Fat', 'fat', 5]] as const).map(([label, key, d]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-white/70 text-[13px]">{label}</span>
                                <div className="flex items-center gap-3">
                                  <button onClick={() => step(key, -d)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition">
                                    <Minus size={14} />
                                  </button>
                                  <span className="text-white font-bold text-[14px] tabular-nums w-14 text-center">
                                    {draft[key].toLocaleString()}{key === 'calories' ? '' : 'g'}
                                  </span>
                                  <button onClick={() => step(key, d)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition">
                                    <Plus size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={saveMacros}
                              className="mt-1 w-full py-2.5 rounded-full font-semibold text-white text-[14px]"
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
                            <Search size={15} style={{ color: BLUE }} />
                            <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: BLUE }}>Deep Dive</span>
                          </div>
                          <span className="flex items-center gap-1 text-[12px]" style={{ color: BLUE }}>Last 30 days <ChevronDown size={13} /></span>
                        </div>
                        <div className="flex gap-1 p-1 rounded-full bg-white/[0.06] mb-3">
                          {DEEP_TABS.map((t) => (
                            <button
                              key={t}
                              onClick={() => setDeepTab(t)}
                              className={`flex-1 py-1.5 rounded-full text-[13px] font-semibold transition ${deepTab === t ? 'bg-white/15 text-white' : 'text-white/45'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        {deepTab === 'Nutrition' && (
                          <div>
                            <MiniBars data={athlete.nutrition} color="#30d158" />
                            <div className="flex justify-between mt-3 text-center">
                              <div><div className="text-white font-bold text-[15px] tabular-nums">{Math.round(athlete.nutrition.reduce((a, b) => a + b, 0) / athlete.nutrition.length).toLocaleString()}</div><div className="text-white/35 text-[10px]">avg cal</div></div>
                              <div><div className="text-white font-bold text-[15px] tabular-nums">{athlete.loggingRate}%</div><div className="text-white/35 text-[10px]">logged</div></div>
                              <div><div className="text-white font-bold text-[15px] tabular-nums">{athlete.avgProtein}g</div><div className="text-white/35 text-[10px]">avg protein</div></div>
                            </div>
                          </div>
                        )}
                        {deepTab === 'Workouts' && (
                          <div>
                            <MiniBars data={athlete.workoutsBars} color={BLUE} />
                            <div className="flex justify-between mt-3 text-center">
                              <div><div className="text-white font-bold text-[15px] tabular-nums">{athlete.workouts}</div><div className="text-white/35 text-[10px]">sessions</div></div>
                              <div><div className="text-white font-bold text-[15px] tabular-nums">{fmtVol(athlete.volume)}</div><div className="text-white/35 text-[10px]">total lb</div></div>
                              <div><div className="text-white font-bold text-[15px] tabular-nums">{athlete.daysLogged}</div><div className="text-white/35 text-[10px]">days active</div></div>
                            </div>
                          </div>
                        )}
                        {deepTab === 'Strength' && (
                          <div className="space-y-2.5">
                            {athlete.lifts.map((l) => (
                              <div key={l.name} className="flex items-center gap-3">
                                <span className="flex-1 text-white/75 text-[13px]">{l.name}</span>
                                <div className="flex items-end gap-[3px] h-6">
                                  {l.trend.map((v, i) => {
                                    const mx = Math.max(...l.trend);
                                    return <div key={i} className="w-[5px] rounded-t-[2px]" style={{ height: `${(v / mx) * 100}%`, background: i === l.trend.length - 1 ? BLUE : `${BLUE}55` }} />;
                                  })}
                                </div>
                                <span className="text-white font-bold text-[14px] tabular-nums w-14 text-right">{l.value} lb</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  </AnimatePresence>
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
