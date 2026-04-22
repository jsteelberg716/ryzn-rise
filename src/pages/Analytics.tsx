import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Users,
  Globe2,
  Smartphone,
  TrendingUp,
  RefreshCw,
  Lock,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';

type Daily = { day: string; pv: number; visitors: number };
type NameValue = { name: string; value: number };

type Stats = {
  totalPv: number;
  uniqueVisitors: number;
  paths: NameValue[];
  refs: NameValue[];
  sources: NameValue[];
  countries: NameValue[];
  devices: NameValue[];
  daily: Daily[];
  recent: Array<{
    ts: number;
    path: string;
    ref: string;
    source?: string;
    country: string;
    device: string;
    screen: string;
    tz: string;
    visitorId: string;
  }>;
  generatedAt: string;
};

const KEY_STORAGE = 'ryzn_analytics_key';

/* ---------- Tooltip ---------- */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-xs">
      {label && <div className="text-foreground font-semibold mb-1">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-foreground font-medium">{p.name}:</span>
          <span>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ---------- Stat card ---------- */
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
}) => (
  <div className="glass-card rounded-[20px] p-5 hover:-translate-y-0.5 transition-all duration-300">
    <Icon size={18} className="text-accent-green mb-3" />
    <div className="text-3xl font-extrabold tracking-tight text-foreground">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    {sub && <div className="text-xs text-muted-foreground/60 mt-1">{sub}</div>}
  </div>
);

/* ---------- Bar chart card ---------- */
const BarCard = ({
  title,
  data,
  color = 'hsl(145 72% 50%)',
}: {
  title: string;
  data: NameValue[];
  color?: string;
}) => {
  const capped = (data || []).slice(0, 8);
  return (
    <div className="glass-card rounded-[24px] p-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        {title}
      </h3>
      {capped.length === 0 ? (
        <div className="text-sm text-muted-foreground/60 py-8 text-center">No data yet.</div>
      ) : (
        <div style={{ width: '100%', height: Math.max(220, capped.length * 36) }}>
          <ResponsiveContainer>
            <BarChart data={capped} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                width={100}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {capped.map((_, i) => (
                  <Cell key={i} fill={color} fillOpacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

/* ---------- Page ---------- */
const Analytics = () => {
  const [key, setKey] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });
  const [inputKey, setInputKey] = useState<string>(key);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const authed = !!stats;

  const fetchStats = async (k: string) => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/stats?key=${encodeURIComponent(k)}`, {
        headers: { 'Cache-Control': 'no-store' },
      });
      if (r.status === 401) {
        setErr('Incorrect password.');
        setStats(null);
        return;
      }
      if (!r.ok) {
        setErr(`Stats API returned ${r.status}. Is Upstash configured?`);
        setStats(null);
        return;
      }
      const j = (await r.json()) as Stats;
      setStats(j);
      try {
        localStorage.setItem(KEY_STORAGE, k);
      } catch {}
    } catch (e: any) {
      setErr('Could not reach /api/stats. Deploy to Vercel first.');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch if we have a stored key
  useEffect(() => {
    if (key) void fetchStats(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKey(inputKey);
    void fetchStats(inputKey);
  };

  const dailyMax = useMemo(
    () => Math.max(1, ...(stats?.daily?.map((d) => d.pv) || [0])),
    [stats],
  );

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

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.8)] border-b border-primary/[0.1]">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Link to="/" className="flex items-center">
            <RyznWordLogo height={26} />
          </Link>
          <div className="flex items-center gap-3">
            {stats && (
              <button
                onClick={() => void fetchStats(key)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-[120px] pb-24">
        {/* Hero */}
        <motion.section
          className="max-w-[1100px] mx-auto px-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill glass-card border-l-2 border-accent-green mb-6"
          >
            <Activity size={14} className="text-accent-green" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Self-Hosted · Free · Private
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUpVariant}
            className="font-extrabold tracking-[-0.035em] leading-[1.05]"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}
          >
            Traffic <span className="gradient-text">Dashboard</span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground">
            Your own pageview counter, visitor map, and referrer board — running on Vercel serverless
            + Upstash Redis. Nothing leaves your infrastructure.
          </motion.p>
        </motion.section>

        {/* Password gate */}
        {!authed && (
          <motion.section
            className="max-w-[520px] mx-auto px-6 mt-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-8">
              <div className="flex items-center gap-2 text-accent-green mb-4">
                <Lock size={16} />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Dashboard Password
                </span>
              </div>
              <input
                type="password"
                autoFocus
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter ANALYTICS_PASSWORD"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-primary/[0.15] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full cta-primary px-6 py-3 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground font-bold disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Unlock Dashboard'}
              </button>
              {err && <p className="mt-3 text-xs text-red-400">{err}</p>}
              <p className="mt-4 text-xs text-muted-foreground/60 leading-relaxed">
                Default password is <code className="text-foreground">ryzn</code> until you set the{' '}
                <code className="text-foreground">ANALYTICS_PASSWORD</code> env var in Vercel.
              </p>
            </form>

            {/* Setup instructions */}
            <div className="mt-8 glass-card rounded-[20px] p-6 text-sm text-muted-foreground leading-relaxed">
              <h3 className="text-foreground font-semibold mb-3">One-time setup (5 min)</h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li>
                  Sign up at{' '}
                  <a className="text-accent-green hover:underline" href="https://upstash.com" target="_blank" rel="noreferrer">
                    upstash.com
                  </a>{' '}
                  (free, no card). Create a Redis database.
                </li>
                <li>Copy the REST URL and REST Token from the database page.</li>
                <li>
                  In Vercel → your project → Settings → Environment Variables, add:
                  <pre className="mt-2 p-3 rounded-lg bg-black/40 text-xs text-foreground overflow-x-auto">
{`UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
ANALYTICS_PASSWORD=pick-a-password`}
                  </pre>
                </li>
                <li>Redeploy. Visit /analytics and enter your password.</li>
              </ol>
            </div>
          </motion.section>
        )}

        {/* Dashboard */}
        {authed && stats && (
          <>
            <motion.section
              className="max-w-[1200px] mx-auto px-6 mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <StatCard icon={Eye} label="Total pageviews" value={stats.totalPv} sub="all time" />
              <StatCard icon={Users} label="Unique visitors" value={stats.uniqueVisitors} sub="all time" />
              <StatCard
                icon={TrendingUp}
                label="Top page"
                value={stats.paths[0]?.name?.slice(0, 14) || '—'}
                sub={stats.paths[0] ? `${stats.paths[0].value} views` : ''}
              />
              <StatCard
                icon={Globe2}
                label="Top country"
                value={stats.countries[0]?.name || '—'}
                sub={stats.countries[0] ? `${stats.countries[0].value} views` : ''}
              />
            </motion.section>

            {/* Daily chart */}
            <motion.section
              className="max-w-[1200px] mx-auto px-6 mt-8"
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
            >
              <div className="glass-card rounded-[24px] p-6 md:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Pageviews — last 30 days
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={stats.daily} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="pvGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(145 72% 50%)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="hsl(145 72% 50%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(172 63% 55%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(172 63% 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[0, Math.max(10, dailyMax)]} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="pv"
                        name="Pageviews"
                        stroke="hsl(145 72% 50%)"
                        strokeWidth={2}
                        fill="url(#pvGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        name="Visitors"
                        stroke="hsl(172 63% 55%)"
                        strokeWidth={2}
                        fill="url(#visGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.section>

            {/* Breakdown grid */}
            <motion.section
              className="max-w-[1200px] mx-auto px-6 mt-8 grid md:grid-cols-2 gap-4"
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
            >
              <BarCard title="Traffic sources (QR / ?ref)" data={stats.sources} color="hsl(145 72% 50%)" />
              <BarCard title="Top pages" data={stats.paths} color="hsl(145 72% 50%)" />
              <BarCard title="Top referrers" data={stats.refs} color="hsl(172 63% 55%)" />
              <BarCard title="Countries" data={stats.countries} color="hsl(195 60% 55%)" />
              <BarCard title="Devices" data={stats.devices} color="hsl(145 72% 50%)" />
            </motion.section>

            {/* Recent events */}
            <motion.section
              className="max-w-[1200px] mx-auto px-6 mt-8"
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
            >
              <div className="glass-card rounded-[24px] overflow-hidden">
                <div className="px-6 py-4 border-b border-primary/[0.08] flex items-center gap-2">
                  <Smartphone size={14} className="text-accent-green" />
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Recent activity
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.02] text-left text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Time</th>
                        <th className="px-4 py-3 font-medium">Path</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Referrer</th>
                        <th className="px-4 py-3 font-medium">Country</th>
                        <th className="px-4 py-3 font-medium">Device</th>
                        <th className="px-4 py-3 font-medium">Timezone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground/60">
                            No visits yet.
                          </td>
                        </tr>
                      )}
                      {stats.recent.map((r, i) => (
                        <tr
                          key={i}
                          className="border-t border-primary/[0.06] hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {new Date(r.ts).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-accent-green font-mono">{r.path}</td>
                          <td className="px-4 py-3 text-foreground font-semibold">
                            {r.source && r.source !== '(none)' ? r.source : <span className="text-muted-foreground/40">—</span>}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{r.ref}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.country}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.device}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.tz}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>

            <p className="max-w-[1200px] mx-auto px-6 mt-8 text-xs text-muted-foreground/60">
              Last refreshed {new Date(stats.generatedAt).toLocaleString()}
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
