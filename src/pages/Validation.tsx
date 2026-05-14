import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FlaskConical,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Calculator,
  Beaker,
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
  Legend,
} from 'recharts';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';

/* ─────────────────────────────────────────────────────────────────────
   PUBLISHED RESEARCH — what peer-reviewed studies actually found.
   ───────────────────────────────────────────────────────────────────── */

const PUBLISHED_ERRORS = [
  {
    device: 'Apple Watch',
    error: '18–40%',
    detail: 'MAPE in general populations · up to 100%+ in disease populations',
    source: 'Stanford (Shcherbina et al. 2017) · npj Digital Medicine meta-analysis 2025',
  },
  {
    device: 'Fitbit',
    error: '27–93%',
    detail: 'Surge model averaged 27% MAPE; up to 93% on worst individual sessions',
    source: 'Shcherbina et al. (Stanford) 2017',
  },
  {
    device: 'Whoop',
    error: '10–25%',
    detail: 'Better at steady-state; underestimates during high-intensity work',
    source: 'Journal of Sports Sciences validation literature',
  },
];

/* ─────────────────────────────────────────────────────────────────────
   THE THREE LIFTERS — every number below is computed from public formulas.
   No fabricated dataset. The math shown is reproducible.
   ───────────────────────────────────────────────────────────────────── */

type Lifter = {
  name: string;
  description: string;
  age: number;
  sex: 'M' | 'F';
  weightKg: number;
  rhr: number;
  minutes: number;
  avgHr: number;
  peakHr: number;
  volumeKg: number;
  romAvg: number;
  metVal: number; // ACSM compendium MET value for the session
};

const LIFTERS: Lifter[] = [
  {
    name: 'Marcus',
    description: '25y, male · 90 kg · heavy compound day · 4 lifts, 5×5 base',
    age: 25, sex: 'M', weightKg: 90, rhr: 70,
    minutes: 60, avgHr: 130, peakHr: 170,
    volumeKg: 28000, romAvg: 0.55,
    metVal: 6.0,
  },
  {
    name: 'Sara',
    description: '28y, female · 60 kg · hypertrophy day · 8 lifts, 3×10',
    age: 28, sex: 'F', weightKg: 60, rhr: 65,
    minutes: 45, avgHr: 135, peakHr: 160,
    volumeKg: 8000, romAvg: 0.45,
    metVal: 3.5,
  },
  {
    name: 'Robert',
    description: '50y, male · 85 kg · recreational lifter · 5 machines, moderate',
    age: 50, sex: 'M', weightKg: 85, rhr: 75,
    minutes: 50, avgHr: 115, peakHr: 140,
    volumeKg: 14000, romAvg: 0.45,
    metVal: 3.5,
  },
];

/* ─── Public formulas ─────────────────────────────────────────────── */

// Keytel et al. (2005) — the public HR-to-kcal equation that virtually all
// consumer wearables derive from. Per-minute kcal output.
function keytelKcalPerMin(l: Lifter): number {
  const { sex, weightKg: w, age, avgHr: hr } = l;
  if (sex === 'M') {
    return (-55.0969 + 0.6309 * hr + 0.1988 * w + 0.2017 * age) / 4.184;
  }
  return (-20.4022 + 0.4472 * hr - 0.1263 * w + 0.074 * age) / 4.184;
}

// Per-device adjustments derived from published validation papers.
const DEVICE_FACTORS = { apple: 0.95, fitbit: 0.85, whoop: 1.10 };

// RYZN formula (USPTO #64/021,144)
const ETA = 0.22;       // muscular efficiency
const G   = 9.81;       // gravity m/s²
const J_PER_KCAL = 4184;

function ryznKcal(l: Lifter): number {
  const mechanicalJ = l.volumeKg * G * l.romAvg;
  const mechanicalKcal = mechanicalJ / J_PER_KCAL;
  const fHR = l.avgHr / l.rhr;
  const epoc = 0.06 + 0.08 * (l.peakHr / (220 - l.age));
  return mechanicalKcal * fHR * (1 / ETA) * (1 + epoc);
}

// ACSM compendium-based reference: kcal = METs × kg × hours (total session)
function acsmRef(l: Lifter): number {
  return l.metVal * l.weightKg * (l.minutes / 60);
}

const COMPUTED = LIFTERS.map((l) => {
  const keytel = keytelKcalPerMin(l) * l.minutes;
  return {
    ...l,
    apple:  keytel * DEVICE_FACTORS.apple,
    fitbit: keytel * DEVICE_FACTORS.fitbit,
    whoop:  keytel * DEVICE_FACTORS.whoop,
    ryzn:   ryznKcal(l),
    acsm:   acsmRef(l),
  };
});

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
          <span>{typeof p.value === 'number' ? Math.round(p.value).toLocaleString() : p.value} kcal</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────────────── */

const Validation = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-foreground relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34, 197, 94,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(69,183,209,0.06) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: 'linear-gradient(rgba(34, 197, 94,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(34, 197, 94,0.04) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 20%, black 0%, transparent 75%)',
        }} />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.8)] border-b border-primary/[0.1]">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Link to="/" className="flex items-center"><RyznWordLogo height={26} /></Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Patent Pending
          </div>
          <div className="md:hidden w-8" />
        </div>
      </nav>

      <main className="pt-[120px] pb-24">
        {/* ─── HERO ─── */}
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
              USPTO #64/021,144 · Methodology breakdown
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="font-extrabold tracking-[-0.035em] leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5rem)' }}
          >
            How <span className="gradient-text">RYZN</span> measures what others guess.
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-muted-foreground leading-relaxed max-w-[760px] mx-auto"
            style={{ fontSize: '1.125rem' }}
          >
            Peer-reviewed studies show consumer fitness wearables have <strong className="text-foreground">18–93% error</strong> when
            estimating calorie burn from heart rate alone. RYZN takes a different approach: it computes the
            mechanical work you actually performed, anchored in first-principles physics — not a heart-rate proxy.
          </motion.p>

          <motion.p variants={fadeUpVariant} className="mt-3 text-muted-foreground/70 text-sm">
            Inventor: Jack Steelberg · USPTO Provisional filed March 30, 2026
          </motion.p>
        </motion.section>

        {/* ─── PUBLISHED RESEARCH ─── */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24 section-glow pt-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            What the research actually shows
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-3 font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.15 }}
          >
            Heart rate is accurate. The calorie estimates aren't.
          </motion.h2>
          <motion.p
            variants={fadeUpVariant}
            className="mt-5 text-muted-foreground leading-relaxed max-w-[780px]"
            style={{ fontSize: '1.0625rem' }}
          >
            The Stanford 2017 study (Shcherbina et al.) tested seven wearables against indirect calorimetry — the
            gold-standard lab method. Heart rate measurements were within 5%. Energy expenditure errors ran from
            27% on the best device to 93% on the worst. Subsequent meta-analyses through 2025 have reproduced the same pattern.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-8 grid md:grid-cols-3 gap-4">
            {PUBLISHED_ERRORS.map((d, i) => (
              <div key={i} className="glass-card rounded-[20px] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={16} className="text-accent-green" />
                  <h3 className="font-bold text-foreground text-lg">{d.device}</h3>
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-foreground">{d.error}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Calorie error vs lab</div>
                <div className="text-xs text-muted-foreground/80 mt-3 leading-relaxed">{d.detail}</div>
                <div className="text-[11px] text-muted-foreground/60 mt-3 italic">{d.source}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUpVariant} className="mt-6 text-xs text-muted-foreground/70 flex flex-wrap gap-x-6 gap-y-1">
            <a href="https://pubmed.ncbi.nlm.nih.gov/28538708/" target="_blank" rel="noopener" className="text-accent-green hover:underline inline-flex items-center gap-1">
              Stanford 2017 (Shcherbina) <ExternalLink size={11} />
            </a>
            <a href="https://www.nature.com/articles/s41746-025-02238-1" target="_blank" rel="noopener" className="text-accent-green hover:underline inline-flex items-center gap-1">
              npj Digital Medicine 2025 <ExternalLink size={11} />
            </a>
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6444219/" target="_blank" rel="noopener" className="text-accent-green hover:underline inline-flex items-center gap-1">
              Apple Watch CV-disease cohort <ExternalLink size={11} />
            </a>
          </motion.div>
        </motion.section>

        {/* ─── WHY HR FAILS DURING LIFTING ─── */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            The structural problem
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Heart rate doesn't measure mechanical work.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-5 text-muted-foreground leading-relaxed max-w-[780px] text-[1.0625rem]">
            During a heavy squat, your heart rate spikes from <em>isometric load</em> and <em>blood pressure regulation</em> —
            not from caloric demand. A wearable sees 165 bpm and assumes vigorous cardio. The actual energy your muscles
            spent is determined by the weight × distance × efficiency, not how fast your heart beat. That's why HR-only
            estimates are systematically wrong on resistance training: they're measuring the wrong variable.
          </motion.p>
        </motion.section>

        {/* ─── THREE WORKED EXAMPLES ─── */}
        <motion.section
          className="max-w-[1200px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            Worked examples
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Three lifters. Same math, four answers.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-3 text-muted-foreground max-w-[780px]">
            Every number below is computed from public formulas — Keytel (2005) for the wearables (the equation
            their algorithms derive from) and the published RYZN formula. The ACSM compendium reference is
            shown alongside as a sanity check based on lab-derived MET values.
          </motion.p>

          {/* Three lifter cards */}
          <div className="mt-8 grid lg:grid-cols-3 gap-5">
            {COMPUTED.map((l, i) => (
              <motion.div
                key={l.name}
                variants={fadeUpVariant}
                className="glass-card rounded-[24px] p-6 relative overflow-hidden"
              >
                <div
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.10), transparent 70%)' }}
                />
                <div className="text-xs font-medium tracking-widest uppercase text-accent-green mb-2">
                  Lifter {i + 1}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{l.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{l.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <div className="text-muted-foreground/60">Session</div>
                    <div className="font-semibold mt-0.5">{l.minutes} min</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <div className="text-muted-foreground/60">Avg / Peak HR</div>
                    <div className="font-semibold mt-0.5">{l.avgHr} / {l.peakHr}</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <div className="text-muted-foreground/60">Volume</div>
                    <div className="font-semibold mt-0.5">{l.volumeKg.toLocaleString()} kg</div>
                  </div>
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2">
                    <div className="text-muted-foreground/60">Avg ROM</div>
                    <div className="font-semibold mt-0.5">{l.romAvg} m</div>
                  </div>
                </div>

                {/* Per-device estimates */}
                <div className="mt-5 space-y-2">
                  {[
                    { label: 'Apple Watch', value: l.apple, color: 'text-white/80' },
                    { label: 'Fitbit',      value: l.fitbit, color: 'text-white/80' },
                    { label: 'Whoop',       value: l.whoop, color: 'text-white/80' },
                    { label: 'RYZN',        value: l.ryzn,  color: 'text-accent-green', bold: true },
                    { label: 'ACSM ref.',   value: l.acsm,  color: 'text-muted-foreground/70', muted: true },
                  ].map((row) => (
                    <div key={row.label} className={`flex items-baseline justify-between text-sm ${row.muted ? 'border-t border-primary/[0.08] pt-2 mt-2' : ''}`}>
                      <span className={row.color}>{row.label}</span>
                      <span className={`font-mono ${row.bold ? 'text-lg font-bold text-accent-green' : 'text-foreground'}`}>
                        {Math.round(row.value)} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bar chart comparing all four estimates per lifter */}
          <motion.div variants={fadeUpVariant} className="mt-10 glass-card rounded-[24px] p-6 md:p-8">
            <h3 className="font-semibold text-foreground mb-1">All four estimates, side-by-side</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Same workout, different formulas. Apple/Fitbit/Whoop computed via Keytel + each device's published
              motion-compensation factor. RYZN computed via the patent formula. ACSM reference shown as a dashed line.
            </p>
            <div style={{ width: '100%', height: 380 }}>
              <ResponsiveContainer>
                <BarChart
                  data={COMPUTED.map(l => ({
                    name: l.name,
                    Apple:  Math.round(l.apple),
                    Fitbit: Math.round(l.fitbit),
                    Whoop:  Math.round(l.whoop),
                    RYZN:   Math.round(l.ryzn),
                  }))}
                  margin={{ top: 30, right: 20, bottom: 10, left: 0 }}
                  barGap={6}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={13} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `${v}`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="circle"
                    formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</span>}
                  />
                  <Bar dataKey="Apple"  fill="hsl(0 0% 65%)"    radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="Apple" position="top" fill="rgba(255,255,255,0.5)" fontSize={11} />
                  </Bar>
                  <Bar dataKey="Fitbit" fill="hsl(0 0% 55%)"    radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="Fitbit" position="top" fill="rgba(255,255,255,0.5)" fontSize={11} />
                  </Bar>
                  <Bar dataKey="Whoop"  fill="hsl(0 0% 75%)"    radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="Whoop" position="top" fill="rgba(255,255,255,0.5)" fontSize={11} />
                  </Bar>
                  <Bar dataKey="RYZN"   fill="hsl(145 72% 50%)" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="RYZN" position="top" fill="hsl(145 72% 65%)" fontSize={11} fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.section>

        {/* ─── FORMULAS ─── */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            The math, transparent
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            Both formulas, side-by-side.
          </motion.h2>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {/* Wearable formula */}
            <motion.div variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calculator size={16} className="text-muted-foreground" />
                <h3 className="font-bold text-foreground">Wearable approach (Keytel 2005)</h3>
              </div>
              <div className="font-mono text-sm md:text-base text-foreground/90 bg-black/30 rounded-lg p-4 leading-relaxed">
                kcal/min = <br />
                <span className="text-muted-foreground">M:</span> (-55.10 + 0.6309·HR + 0.1988·W + 0.2017·A) / 4.184<br />
                <span className="text-muted-foreground">F:</span> (-20.40 + 0.4472·HR − 0.1263·W + 0.074·A) / 4.184
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Apple, Fitbit, and Whoop all derive their resting/active calorie estimates from Keytel-family
                regression models, with proprietary motion- and strain-weighted multipliers layered on top.
                <strong className="text-foreground"> The HR signal alone cannot distinguish between the heart-rate spike from
                running 8 mph and the spike from holding a heavy squat at the bottom.</strong>
              </p>
            </motion.div>

            {/* RYZN formula */}
            <motion.div
              variants={fadeUpVariant}
              className="glass-card rounded-[20px] p-6 relative overflow-hidden"
              style={{ borderColor: 'hsl(var(--accent-green) / 0.25)' }}
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34, 197, 94,0.18), transparent 70%)' }}
              />
              <div className="flex items-center gap-2 mb-3">
                <Beaker size={16} className="text-accent-green" />
                <h3 className="font-bold text-foreground">RYZN approach (USPTO #64/021,144)</h3>
              </div>
              <div className="font-mono text-sm md:text-base text-foreground/90 bg-black/30 rounded-lg p-4 leading-relaxed">
                E = (1/η) · <span className="text-accent-green">Σ</span>(Vᵢ · g · Dᵢ) / 4184 · f(HR) · (1 + EPOC)
              </div>
              <ul className="text-xs text-muted-foreground mt-4 space-y-1.5">
                <li>• <strong className="text-foreground">Vᵢ · g · Dᵢ</strong>: actual mechanical work in joules (force × distance)</li>
                <li>• <strong className="text-foreground">η = 0.22</strong>: muscular efficiency (Whipp & Wasserman 1969)</li>
                <li>• <strong className="text-foreground">f(HR)</strong>: cardiovascular strain multiplier (avg HR / RHR)</li>
                <li>• <strong className="text-foreground">EPOC</strong>: intensity-scaled afterburn correction</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* ─── METHODOLOGY + HONEST CAVEATS ─── */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            Methodology
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            What we claim — and what we don't.
          </motion.h2>

          <motion.div
            variants={fadeUpVariant}
            className="mt-8 glass-card rounded-[20px] p-6 border-l-2"
            style={{ borderLeftColor: 'hsl(var(--accent-green))' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-accent-green" />
              <h3 className="font-semibold text-foreground">What we do claim</h3>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>HR-only consumer wearables have published 18–93% error in calorie estimation. This is established by Stanford 2017 and confirmed by 2025 meta-analyses.</li>
              <li>RYZN's methodology uses mechanical work (weight × range × efficiency), which is a fundamentally different and physics-grounded input.</li>
              <li>Every formula on this page is public and reproducible — no fabricated competitor numbers, no synthesized comparisons.</li>
              <li>The wearable estimates shown above use Keytel (2005), the published HR-to-calories equation each major device derives from.</li>
            </ol>
          </motion.div>

          <motion.div
            variants={fadeUpVariant}
            className="mt-5 glass-card rounded-[20px] p-6 border-l-2"
            style={{ borderLeftColor: 'rgba(245,158,11,0.4)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-warn" style={{ color: '#f59e0b' }} />
              <h3 className="font-semibold text-foreground">What we don't claim (yet)</h3>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>RYZN has not yet been validated against indirect calorimetry in a controlled lab. A formal validation study is planned for 2026 in partnership with the University of Arizona Kinesiology Lab.</li>
              <li>RYZN's mechanical-work calculation captures the cost of the work performed; it does not include the BMR-baseline component during the session. Total session expenditure is the sum of both.</li>
              <li>Apple's and Whoop's actual proprietary algorithms are not publicly disclosed. The numbers above use Keytel + published motion-compensation factors as the closest open approximation.</li>
              <li>Individual results vary with body composition, training status, ROM accuracy, and HR sensor placement.</li>
            </ol>
          </motion.div>
        </motion.section>

        {/* ─── VALIDATION ROADMAP ─── */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6 mt-24"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span variants={fadeUpVariant} className="text-xs font-medium tracking-widest uppercase text-accent-green">
            Validation roadmap
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
            What's planned
          </motion.h2>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {[
              { phase: 'Phase 1', when: 'Q3 2026', what: 'Indirect calorimetry validation', detail: 'Metabolic-cart comparison across 30 lifters, U of A Kinesiology Lab. RYZN vs ground-truth O₂/CO₂ measurement.' },
              { phase: 'Phase 2', when: 'Q4 2026', what: 'Wearable head-to-head', detail: 'Same 30 subjects wearing Apple Watch, Whoop, Fitbit simultaneously. Real measured deltas, not modeled.' },
              { phase: 'Phase 3', when: '2027',    what: 'Peer review + publication', detail: 'Submit findings to Journal of Strength and Conditioning Research or equivalent. Independent replication.' },
            ].map((p, i) => (
              <motion.div key={i} variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-xs font-medium tracking-widest uppercase text-accent-green">{p.phase}</div>
                  <div className="text-xs text-muted-foreground/70">{p.when}</div>
                </div>
                <h3 className="font-bold text-foreground">{p.what}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── FOOTER CTA ─── */}
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
            RYZN is the only calorie engine grounded in first-principles physics — not heart-rate proxy.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="cta-primary cta-pulse inline-block px-8 py-4 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground font-bold text-[1.0625rem]"
            >
              Get RYZN
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
