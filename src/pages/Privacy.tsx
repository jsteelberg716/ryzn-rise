import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Smartphone,
  Heart,
  CreditCard,
  Ban,
  Baby,
  User,
  Dumbbell,
  Apple,
  Utensils,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Database,
  UserCheck,
  Clock,
  Lock,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';

const sections = [
  {
    icon: User,
    title: '1. Account Info',
    body: (
      <p>
        We collect your email, password, name, and Apple Sign-In token (if used). Passwords are <strong className="text-foreground">hashed by Supabase</strong> and are never stored in a readable form. Your session token is stored securely in the iOS Keychain on your device.
      </p>
    ),
  },
  {
    icon: Heart,
    title: '2. Health & Fitness Profile',
    body: (
      <p>
        We store your date of birth, gender, height, weight, lifter level, fitness goal, and activity level in Supabase. This profile powers RYZN's calorie engine and personalized recommendations.
      </p>
    ),
  },
  {
    icon: Dumbbell,
    title: '3. Workouts & Routines',
    body: (
      <>
        <p>We store everything related to your training:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-muted-foreground">
          <li>Exercises, sets, weight, reps, completion times</li>
          <li>Cardio data, duration, volume, calories burned (patent-pending engine)</li>
          <li>Custom routines, weekly splits, PRs, progression history</li>
        </ul>
        <p className="mt-3">If you grant HealthKit permission, completed workouts are written to Apple Health as <strong className="text-foreground">HKWorkout</strong> records.</p>
      </>
    ),
  },
  {
    icon: Apple,
    title: '4. Apple HealthKit',
    body: (
      <>
        <p>With your explicit permission, RYZN <strong className="text-foreground">reads</strong>: heart rate, resting HR, HRV, active energy, steps, body fat %, and sleep analysis.</p>
        <p className="mt-2">RYZN <strong className="text-foreground">writes only</strong>: workout records.</p>
        <p className="mt-2">HealthKit data <strong className="text-foreground">never leaves your device</strong>, is never uploaded to our servers, and is never shared with anyone.</p>
      </>
    ),
  },
  {
    icon: Utensils,
    title: '5. Nutrition & Food Logging',
    body: (
      <>
        <p>We store food photos, voice descriptions, typed meals, estimated macros, water and alcohol counts, weight logs, and "food memories" (AI-inferred preferences such as "prefers oat milk").</p>
        <p className="mt-2">Voice input is <strong className="text-foreground">transcribed on-device using Apple Speech</strong> before being sent anywhere.</p>
      </>
    ),
  },
  {
    icon: Sparkles,
    title: '6. AI Processing',
    body: (
      <>
        <p>AI inputs are routed through our server-side proxy (<code className="text-xs bg-primary/10 px-1.5 py-0.5 rounded">functions/v1/ai-proxy</code>) to OpenAI (GPT-4.1, primary) or Anthropic (Claude Haiku 4.5, fallback).</p>
        <p className="mt-2"><strong className="text-foreground">What is sent:</strong> the photo / transcript / message, the last 24 hours of conversation history, condensed profile context, and food memories.</p>
        <p className="mt-2"><strong className="text-foreground">API keys are server-side only.</strong> AI request metadata (model, latency, cost, success) is logged for reliability — but the content of photos, transcripts, and replies is not. AI data is never sold or shared.</p>
      </>
    ),
  },
  {
    icon: ImageIcon,
    title: '7. Photos & Media',
    body: (
      <p>
        Food photos are uploaded to a private Supabase storage bucket. Progress photos and avatars live in private buckets readable <strong className="text-foreground">only by your account</strong>. RYZN does not access your full photo library and does not perform facial recognition.
      </p>
    ),
  },
  {
    icon: CreditCard,
    title: '8. Subscription & Billing',
    body: (
      <p>
        Apple handles all payments via StoreKit. We never see your credit card number. We store your subscription status, transaction ID, and an anonymous account token in a <code className="text-xs bg-primary/10 px-1.5 py-0.5 rounded">subscriptions</code> table.
      </p>
    ),
  },
  {
    icon: MessageSquare,
    title: '9. Feedback & Bug Reports',
    body: (
      <p>
        When you submit feedback or a bug report, we receive the text you wrote plus auto-attached app version, iOS version, and device model. No account data is attached unless you include it yourself.
      </p>
    ),
  },
  {
    icon: Globe,
    title: '10. Third-Party Services',
    body: (
      <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
        <li><strong className="text-foreground">Open Food Facts</strong> — barcode lookups (no personal info sent)</li>
        <li><strong className="text-foreground">USDA FoodData Central</strong> — food name queries (no personal info)</li>
        <li><strong className="text-foreground">Unsplash</strong> — recipe imagery</li>
        <li><strong className="text-foreground">Apple servers</strong> — HealthKit, StoreKit, Sign in with Apple</li>
      </ul>
    ),
  },
  {
    icon: Smartphone,
    title: '11. Local Device Storage',
    body: (
      <>
        <p>The following lives on your device:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-muted-foreground">
          <li>Keychain auth token</li>
          <li>App preferences</li>
          <li>Cached meal photos</li>
          <li>Offline sync queue</li>
          <li>Cached AI personality responses</li>
        </ul>
        <p className="mt-3">All local storage is wiped on sign-out or account deletion.</p>
      </>
    ),
  },
  {
    icon: Database,
    title: '12. Data Storage',
    body: (
      <p>
        All cloud data lives in <strong className="text-foreground">Supabase</strong> (US data centers) protected by row-level security — your data is only accessible by your authenticated account. See Supabase's privacy policy for details on their infrastructure.
      </p>
    ),
  },
  {
    icon: Ban,
    title: '13. Sharing & Selling',
    body: (
      <p>
        We do not sell your data. <strong className="text-foreground">Ever.</strong> No advertisers, no data brokers, no marketing networks. No ad SDKs. No cross-app tracking.
      </p>
    ),
  },
  {
    icon: UserCheck,
    title: '14. Your Rights',
    body: (
      <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
        <li>Edit your profile at any time</li>
        <li>Delete individual items</li>
        <li>Sign out (clears local cache)</li>
        <li>Delete your entire account — permanent, wipes everything in one transaction</li>
        <li>Revoke HealthKit / camera / mic / photo / speech access via iOS Settings</li>
        <li><strong className="text-foreground">CCPA and GDPR</strong> rights are honored via the same delete flow</li>
      </ul>
    ),
  },
  {
    icon: Clock,
    title: '15. Data Retention',
    body: (
      <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
        <li><strong className="text-foreground">Active accounts:</strong> retained while the account exists</li>
        <li><strong className="text-foreground">Deleted accounts:</strong> immediate full deletion — no soft-delete</li>
        <li><strong className="text-foreground">AI prompt logs:</strong> 90 days, then purged</li>
      </ul>
    ),
  },
  {
    icon: Baby,
    title: "16. Children's Privacy",
    body: (
      <p>
        RYZN is rated <strong className="text-foreground">12+</strong>. We do not knowingly collect data from anyone under the age of 13.
      </p>
    ),
  },
  {
    icon: Lock,
    title: '17. Security',
    body: (
      <p>
        All traffic is encrypted with HTTPS / TLS. Supabase storage is encrypted at rest. The iOS Keychain uses hardware-backed encryption. Defense-in-depth: row-level security plus signed JWTs.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: '18. Changes',
    body: (
      <p>
        Material changes to this policy trigger an in-app notification and an updated effective date. Minor fixes do not.
      </p>
    ),
  },
  {
    icon: Mail,
    title: '19. Contact',
    body: (
      <p>
        Questions? Email <a href="mailto:jacksteelberg@gmail.com" className="text-accent-green hover:underline">jacksteelberg@gmail.com</a>. RYZN is operated by <strong className="text-foreground">Jack Steelberg</strong> as a sole proprietor — there is no parent company.
      </p>
    ),
  },
];

const Privacy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-foreground relative overflow-hidden">
      {/* Aurora */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34, 197, 94,0.14) 0%, transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.8)] border-b border-primary/[0.1]">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <Link to="/" className="flex items-center"><RyznWordLogo height={26} /></Link>
          <div className="w-14" />
        </div>
      </nav>

      <main className="pt-[120px] pb-24 max-w-[820px] mx-auto px-6">
        {/* Header */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill glass-card border-l-2 border-accent-green mb-6">
            <Shield size={14} className="text-accent-green" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Privacy Policy</span>
          </motion.div>

          <motion.h1 variants={fadeUpVariant} className="font-extrabold tracking-[-0.035em] leading-[1.05]" style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)' }}>
            Your data. Your rules.
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground" style={{ fontSize: '1.0625rem' }}>
            Effective April 28, 2026
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-6 glass-card rounded-[20px] p-6 border-l-2" style={{ borderLeftColor: 'hsl(var(--accent-green))' }}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              RYZN ("the App") is built and operated by <strong className="text-foreground">Jack Steelberg</strong> as a sole proprietor. This policy explains exactly what data the App collects, where it lives, what it's used for, and how you can delete it. Plain language, no legalese, no fine print.
            </p>
          </motion.div>
        </motion.section>

        {/* Sections */}
        <motion.section className="mt-16 space-y-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          {sections.map((s, i) => (
            <motion.div key={i} variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <s.icon size={18} className="text-accent-green flex-shrink-0" />
                <h2 className="font-semibold text-foreground text-lg">{s.title}</h2>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.body}</div>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </div>
  );
};

export default Privacy;
