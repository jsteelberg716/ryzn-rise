import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FlaskConical,
  TrendingDown,
  Flame,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';

/* ---------- Data (from RYZN_Validation_Study.xlsx) ---------- */

const users = [
  { id: 1, profile: 'Heavy Lifter',         age: 25, sex: 'M', weight: 90.7, bf: 15, min: 72, vol: 66018, hrAvg: 125, hrPeak: 155, ryzn: 425.9, apple: 685.1, fitbit: 594.8, whoop: 785.9 },
  { id: 2, profile: 'Moderate Lifter',      age: 30, sex: 'F', weight: 61.2, bf: 22, min: 50, vol: 15115, hrAvg: 118, hrPeak: 142, ryzn: 102.1, apple: 429.8, fitbit: 373.2, whoop: 493.1 },
  { id: 3, profile: 'Upper Body Focus',     age: 40, sex: 'M', weight: 84.0, bf: 20, min: 55, vol: 14774, hrAvg: 112, hrPeak: 138, ryzn: 135.7, apple: 450.6, fitbit: 391.3, whoop: 516.9 },
  { id: 4, profile: 'CrossFit Style',       age: 22, sex: 'F', weight: 58.0, bf: 18, min: 40, vol: 16167, hrAvg: 145, hrPeak: 172, ryzn: 153.1, apple: 433.9, fitbit: 376.7, whoop: 612.6 },
  { id: 5, profile: 'Older Recreational',   age: 55, sex: 'M', weight: 95.0, bf: 28, min: 45, vol: 21499, hrAvg: 105, hrPeak: 125, ryzn: 140.0, apple: 376.0, fitbit: 326.4, whoop: 431.3 },
  { id: 6, profile: 'Lightweight Beginner', age: 19, sex: 'M', weight: 65.0, bf: 12, min: 40, vol:  7673, hrAvg: 120, hrPeak: 148, ryzn:  79.2, apple: 303.6, fitbit: 263.6, whoop: 348.3 },
  { id: 7, profile: 'Powerlifter',          age: 35, sex: 'F', weight: 72.0, bf: 20, min: 90, vol: 17772, hrAvg: 115, hrPeak: 160, ryzn: 206.4, apple: 780.9, fitbit: 678.0, whoop: 895.7 },
  { id: 8, profile: 'Bodybuilder (High Vol)', age: 28, sex: 'M', weight: 100, bf: 12, min: 80, vol: 32877, hrAvg: 130, hrPeak: 158, ryzn: 332.7, apple: 852.4, fitbit: 740.1, whoop: 1203.4 },
  { id: 9, profile: 'General Fitness',      age: 45, sex: 'F', weight: 68.0, bf: 25, min: 35, vol: 10121, hrAvg: 108, hrPeak: 130, ryzn:  77.2, apple: 283.1, fitbit: 245.8, whoop: 324.7 },
  { id:10, profile: 'Athletic Push/Pull',   age: 32, sex: 'M', weight: 82.0, bf: 14, min: 65, vol: 26892, hrAvg: 122, hrPeak: 152, ryzn: 240.6, apple: 589.3, fitbit: 511.7, whoop: 832.0 },
];

const AVG = {
  ryzn: 189.29,
  fitbit: 450.16,
  apple: 518.47,
  whoop: 644.39,
  appleX: 3.10,
  fitbitX: 2.69,
  whoopX: 3.76,
  overall: 3.18,
  phantomKcal: 168,
  annualFatLbs: 10,
};

const avgKcalData = [
  { name: 'RYZN',        value: AVG.ryzn,   fill: 'hsl(145 72% 50%)' },
  { name: 'Fitbit',      value: AVG.fitbit, fill: 'hsl(0 0% 55%)' },
  { name: 'Apple Watch', value: AVG.apple,  fill: 'hsl(0 0% 65%)' },
  { name: 'Whoop',       value: AVG.whoop,  fill: 'hsl(0 0% 75%)' },
];

const overestimationData = [
  { name: 'RYZN',        value: 1,         fill: 'hsl(145 72% 50%)' },
  { name: 'Fitbit',      value: AVG.fitbitX, fill: 'hsl(0 0% 55%)' },
  { name: 'Apple Watch', value: AVG.appleX,  fill: 'hsl(0 0% 65%)' },
  { name: 'Whoop',       value: AVG.whoopX,  fill: 'hsl(0 0% 75%)' },
];

const perUserData = users.map((u) => ({
  name: u.profile.length > 14 ? u.profile.slice(0, 12) + '…' : u.profile,
  RYZN: Math.round(u.ryzn),
  Fitbit: Math.round(u.fitbit),
  Apple: Math.round(u.apple),
  Whoop: Math.round(u.whoop),
}));

const radarData = users.slice(0, 6).map((u) => ({
  profile: u.profile.split(' ')[0],
  RYZN: +(u.ryzn / u.ryzn).toFixed(2),
  Apple: +(u.apple / u.ryzn).toFixed(2),
  Whoop: +(u.whoop / u.ryzn).toFixed(2),
}));

const formula = [
  { v: 'Vᵢ',    def: 'Volume of exercise i (weight × reps)',     val: 'User workout log',                   unit: 'kg' },
  { v: 'g',     def: 'Gravitational acceleration',               val: '9.81 (constant)',                    unit: 'm/s²' },
  { v: 'Dᵢ',    def: 'Anatomical displacement (ROM)',            val: 'Per-exercise lookup table',          unit: 'meters' },
  { v: 'η',     def: 'Muscular efficiency',                      val: '0.22 (Whipp & Wasserman 1969)',      unit: '—' },
  { v: 'f(HR)', def: 'Biological strain = avg HR / resting HR',  val: 'Wearable HR stream',                 unit: '—' },
  { v: 'EPOC',  def: '0.06 + 0.08 × (peak HR / (220 − age))',    val: 'Intensity-scaled afterburn',         unit: '—' },
  { v: '4184',  def: 'Joules per kilocalorie',                   val: 'Thermodynamic constant',             unit: 'J/kcal' },
];

/* ---------- Shared tooltip ---------- */

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-xs">
      {label && <div className="text-foreground font-semibold mb-1">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-foreground font-medium">{p.name}:</span>
          <span>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ---------- Page ---------- */

const Validation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-foreground relative overflow-hidden">
      {/* Aurora background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34, 197, 94,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(69,183,209,0.06) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34, 197, 94,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(34, 197, 94,0.04) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 70% 50% at 50% 20%, black 0%, transparent 75%)',
          }}
        />
      </div>

      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.8)] border-b border-primary/[0.1]">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Link to="/" className="flex items-center">
            <RyznWordLogo height={26} />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Patent Pending
          </div>
          <div className="md:hidden w-8" />
        </div>
      </nav>

      <main className="pt-[120px] pb-24">
        {/* HERO */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill glass-card border-l-2 border-accent-green mb-6"
            style={{ borderLeftColor: 'hsl(var(--accent-green))' }}
          >
            <FlaskConical size={14} className="text-accent-green" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              USPTO #64/021,144 · Simulated Validation Study
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="font-extrabold tracking-[-0.035em] leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)' }}
          >
            The RYZN <span className="gradient-text">Validation</span> Study
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-muted-foreground leading-relaxed max-w-[760px] mx-auto"
            style={{ fontSize: '1.125rem' }}
          >
            A simulated experiment comparing the RYZN physics-based calorie engine against modeled
            HR-only algorithms (Apple Watch, Fitbit, Whoop) across 10 diverse user profiles.
            Inventor: Jack Steelberg · March 30, 2026.
          </motion.p>

          {/* Headline stats */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { icon: TrendingDown, label: 'Avg overestimation',   value: `${AVG.overall.toFixed(1)}×`, sub: 'across competitors' },
              { icon: Flame,        label: 'Phantom calories',     value: `${AVG.phantomKcal}`,         sub: 'kcal per session' },
              { icon: Scale,        label: 'Potential annual',     value: `~${AVG.annualFatLbs} lbs`,   sub: 'fat gain from bad data' },
              { icon: Zap,          label: 'Users tested',         value: '10',                          sub: 'age 19–55, both sexes' },
            ].map((s, i) => (
              <div key={i} className="glass-card rounded-[20px] p-5 text-left hover:-translate-y-0.5 transition-all duration-300">
                <s.icon size={18} className="text-accent-green mb-3" />
                <div className="text-3xl font-extrabold tracking-tight text-foreground">{s.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                <div className="text-xs text-muted-foreground/60 mt-1">{s.sub}</div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* THE PATENT EXPLAINED */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24 section-glow pt-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            THE PATENT
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-3 font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
          >
            A thermodynamic engine, not another heart-rate guess.
          </motion.h2>
          <motion.p
            variants={fadeUpVariant}
            className="mt-5 text-muted-foreground leading-relaxed max-w-[780px]"
            style={{ fontSize: '1.0625rem' }}
          >
            Heart-rate only algorithms cannot measure mechanical load. They see a 145-bpm spike
            and guess. RYZN sees the <strong className="text-foreground">actual work</strong> —
            weight lifted, reps completed, range of motion — and converts it to energy using
            first-principles physics.
          </motion.p>

          {/* Formula card */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-8 glass-card rounded-[24px] p-8 relative overflow-hidden"
          >
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.15), transparent 70%)' }}
            />
            <div className="text-xs font-medium tracking-widest uppercase text-accent-green mb-4">
              The RYZN Master Formula
            </div>
            <div className="font-mono text-lg md:text-2xl text-foreground leading-relaxed break-words">
              E = <span className="text-accent-green">[</span>(1/η) × Σ(V<sub>i</sub> × g × D<sub>i</sub>) / 4184 × f(HR)<span className="text-accent-green">]</span> × (1 + EPOC)
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-2 text-sm">
              {formula.map((f, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-t border-primary/[0.08]">
                  <code className="text-accent-green font-semibold min-w-[56px]">{f.v}</code>
                  <div className="flex-1">
                    <div className="text-foreground">{f.def}</div>
                    <div className="text-muted-foreground/80 text-xs mt-0.5">
                      {f.val} <span className="text-muted-foreground/50">· {f.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CHART 1 — Average kcal */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            FINDING #1
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Average calories per session
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-3 text-muted-foreground max-w-[680px]">
            Averaged across all 10 user profiles. RYZN's physics-grounded estimate is roughly
            one-third of what HR-only wearables report.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 glass-card rounded-[24px] p-6 md:p-8">
            <div style={{ width: '100%', height: 340 }}>
              <ResponsiveContainer>
                <BarChart data={avgKcalData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" name="Avg kcal" radius={[10, 10, 0, 0]}>
                    {avgKcalData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                    <LabelList dataKey="value" position="top" fill="rgba(255,255,255,0.8)" fontSize={12} formatter={(v: number) => Math.round(v)} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.section>

        {/* CHART 2 — Overestimation factor */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            FINDING #2
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Overestimation factor (vs. RYZN baseline)
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-3 text-muted-foreground max-w-[680px]">
            Whoop overestimates resistance-training calories by <strong className="text-foreground">3.76×</strong>,
            Apple Watch by <strong className="text-foreground">3.10×</strong>, and Fitbit by{' '}
            <strong className="text-foreground">2.69×</strong> on average.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 glass-card rounded-[24px] p-6 md:p-8">
            <div style={{ width: '100%', height: 340 }}>
              <ResponsiveContainer>
                <BarChart data={overestimationData} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 4.5]} tickFormatter={(v) => `${v}×`} />
                  <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={13} width={110} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="value" name="Overestimation" radius={[0, 10, 10, 0]}>
                    {overestimationData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                    <LabelList dataKey="value" position="right" fill="rgba(255,255,255,0.8)" fontSize={12} formatter={(v: number) => `${v.toFixed(2)}×`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.section>

        {/* CHART 3 — Per-user breakdown */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            FINDING #3
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Per-user breakdown — all 10 profiles
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-3 text-muted-foreground max-w-[680px]">
            The gap holds across every body type, training style, age, and sex. It is not an artifact of
            any single profile — it is the structural limitation of heart-rate-only estimation.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 glass-card rounded-[24px] p-6 md:p-8">
            <div style={{ width: '100%', height: 420 }}>
              <ResponsiveContainer>
                <BarChart data={perUserData} margin={{ top: 20, right: 20, bottom: 70, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    fontSize={11}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="circle"
                    formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</span>}
                  />
                  <Bar dataKey="RYZN"   fill="hsl(145 72% 50%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Fitbit" fill="hsl(0 0% 55%)"    radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Apple"  fill="hsl(0 0% 65%)"    radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Whoop"  fill="hsl(0 0% 75%)"    radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.section>

        {/* CHART 4 — Radar across profiles */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            FINDING #4
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Relative divergence — the shape of the error
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-3 text-muted-foreground max-w-[680px]">
            RYZN is the inner hexagon (baseline 1×). Apple Watch and Whoop form the outer rings —
            every axis, every profile, the same structural inflation.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 glass-card rounded-[24px] p-6 md:p-8">
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(255,255,255,0.12)" />
                  <PolarAngleAxis dataKey="profile" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(v) => `${v}×`} />
                  <Radar name="RYZN"  dataKey="RYZN"  stroke="hsl(145 72% 50%)" fill="hsl(145 72% 50%)" fillOpacity={0.35} />
                  <Radar name="Apple" dataKey="Apple" stroke="hsl(0 0% 85%)"    fill="hsl(0 0% 85%)"    fillOpacity={0.12} />
                  <Radar name="Whoop" dataKey="Whoop" stroke="hsl(0 70% 70%)"   fill="hsl(0 70% 70%)"   fillOpacity={0.08} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="circle"
                    formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</span>}
                  />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.section>

        {/* FULL DATA TABLE */}
        <motion.section
          className="max-w-[1200px] mx-auto px-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            RAW DATA
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            10-user comparison table
          </motion.h2>

          <motion.div variants={fadeUpVariant} className="mt-8 glass-card rounded-[24px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/[0.02]">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Profile</th>
                    <th className="px-4 py-3 font-medium text-right">Age</th>
                    <th className="px-4 py-3 font-medium">Sex</th>
                    <th className="px-4 py-3 font-medium text-right">Min</th>
                    <th className="px-4 py-3 font-medium text-right">Volume (lbs)</th>
                    <th className="px-4 py-3 font-medium text-right text-accent-green">RYZN</th>
                    <th className="px-4 py-3 font-medium text-right">Apple</th>
                    <th className="px-4 py-3 font-medium text-right">Fitbit</th>
                    <th className="px-4 py-3 font-medium text-right">Whoop</th>
                    <th className="px-4 py-3 font-medium text-right">Avg ×</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const avgX = ((u.apple + u.fitbit + u.whoop) / 3) / u.ryzn;
                    return (
                      <tr key={u.id} className="border-t border-primary/[0.06] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-muted-foreground/60">{u.id}</td>
                        <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{u.profile}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{u.age}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.sex}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{u.min}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{u.vol.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-accent-green font-semibold">{u.ryzn.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{u.apple.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{u.fitbit.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">{u.whoop.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right text-foreground font-semibold">{avgX.toFixed(2)}×</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-primary/20 bg-primary/[0.04] font-semibold">
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 text-foreground">AVERAGE</td>
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3" />
                    <td className="px-4 py-3 text-right text-accent-green">{AVG.ryzn.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{AVG.apple.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{AVG.fitbit.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{AVG.whoop.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right text-foreground">{AVG.overall.toFixed(2)}×</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.section>

        {/* METHODOLOGY */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            METHODOLOGY
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            How the study was run
          </motion.h2>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'RYZN Method',
                body: 'Physics-based: mechanical work (W × R × D) + muscular efficiency (η = 0.22) + HR strain factor + EPOC + Katch-McArdle BMR.',
              },
              {
                title: 'Apple Watch Model',
                body: 'Keytel HR formula × 0.85 motion compensation factor. Validated against published AW overestimation studies (Falter 2019, Stanford 2017).',
              },
              {
                title: 'Fitbit Model',
                body: 'Keytel HR × 0.90 conservative factor × 0.82 motion compensation. Mifflin-St Jeor BMR. Based on published Fitbit accuracy literature.',
              },
              {
                title: 'Whoop Model',
                body: '%HRR zone-weighted Keytel × 0.75 dampening. Based on Whoop\u2019s strain model architecture and published accuracy comparisons.',
              },
            ].map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariant}
                className="glass-card rounded-[20px] p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-accent-green" />
                  <h3 className="font-semibold text-foreground">{m.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Caveats */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-8 glass-card rounded-[20px] p-6 border-l-2"
            style={{ borderLeftColor: 'hsl(var(--accent-green))' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-accent-green" />
              <h3 className="font-semibold text-foreground">Important caveats</h3>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Competitor algorithms are modeled approximations of proprietary systems, not reverse-engineered exact implementations.</li>
              <li>All competitor algorithms are HR-based. The structural limitation (inability to measure mechanical load) is real regardless of specific implementation.</li>
              <li>The 10 profiles span age 19–55, both sexes, BF 12–28%, and diverse workout types.</li>
              <li>Real-world validation with indirect calorimetry (metabolic cart) would be needed to establish absolute ground truth.</li>
              <li>The ~2.5× overestimation headline is conservative relative to the 3.2× average observed.</li>
              <li>Individual results will vary with body composition, training status, and wearable placement accuracy.</li>
            </ol>
          </motion.div>

          {/* Defensible claim */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-8 glass-card rounded-[24px] p-8 relative overflow-hidden"
          >
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.15), transparent 70%)' }}
            />
            <div className="text-xs font-medium tracking-widest uppercase text-accent-green mb-3">
              The defensible claim
            </div>
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              RYZN incorporates <strong>mechanical load data that HR-only methods cannot access</strong>,
              producing calorie estimates anchored in thermodynamic physics. In simulated comparative
              testing across 10 diverse user profiles, conventional wearable algorithms exceeded the
              RYZN physics-based calculation by an average of <strong className="text-accent-green">~2.5× for resistance training sessions</strong>.
            </p>
          </motion.div>
        </motion.section>

        {/* Footer CTA */}
        <motion.section
          className="max-w-[900px] mx-auto px-6 mt-24 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-bold tracking-tight">
            Stop guessing. Start measuring.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground">
            RYZN is the only calorie engine anchored in first-principles physics.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="cta-primary cta-pulse inline-block px-8 py-4 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground font-bold text-[1.0625rem]"
            >
              Start 3-Day Free Trial
            </Link>
            <Link
              to="/"
              className="px-8 py-4 rounded-pill border border-primary/[0.15] text-muted-foreground font-semibold text-[1.0625rem] hover:border-primary/40 hover:text-foreground transition-all duration-200"
            >
              Back to Home
            </Link>
          </motion.div>
          <p className="mt-6 text-xs text-muted-foreground/60">
            USPTO Provisional Application #64/021,144 · Inventor: Jack Steelberg · Filed March 30, 2026
          </p>
        </motion.section>
      </main>
    </div>
  );
};

export default Validation;
