import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Smartphone, Heart, CreditCard, Ban, Trash2, Baby } from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';

const sections = [
  {
    icon: Smartphone,
    title: 'Data Stored on Your Device',
    body: (
      <>
        <p>The App stores the following information <strong className="text-foreground">locally on your device only</strong> using Apple's Core Data framework:</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-muted-foreground">
          <li>Workout history (exercises, sets, reps, weights)</li>
          <li>Personal settings and preferences</li>
          <li>Muscle group activation data</li>
        </ul>
        <p className="mt-3">This data is never transmitted to any external server, cloud service, or third party. It remains entirely under your control on your device.</p>
      </>
    ),
  },
  {
    icon: Shield,
    title: 'Sign in with Apple',
    body: (
      <p>
        RYZN uses <strong className="text-foreground">Sign in with Apple</strong> for authentication. When you sign in, Apple provides us with a unique, anonymized user identifier. We do not receive or store your real name, personal email address, or Apple ID password. Sign in with Apple is managed entirely by Apple Inc.
      </p>
    ),
  },
  {
    icon: Heart,
    title: 'HealthKit Integration',
    body: (
      <p>
        With your explicit permission, RYZN may read from and write to Apple HealthKit. All HealthKit data is processed locally on your device. We <strong className="text-foreground">do not</strong> sell, share, or transmit HealthKit data to any third party, advertising platform, or external service. Access can be revoked at any time in Settings &gt; Health &gt; Data Access &amp; Devices.
      </p>
    ),
  },
  {
    icon: CreditCard,
    title: 'Purchases & Subscriptions',
    body: (
      <p>
        All purchases and subscriptions are processed through <strong className="text-foreground">Apple's App Store</strong> via StoreKit. We do not collect, process, or store any payment information, credit card numbers, or billing details.
      </p>
    ),
  },
  {
    icon: Ban,
    title: 'Third-Party Services & SDKs',
    body: (
      <p>
        RYZN does <strong className="text-foreground">not</strong> integrate any third-party analytics, advertising networks, crash reporting tools, or tracking SDKs. The only external services the App interacts with are Apple's native frameworks (Sign in with Apple, StoreKit, HealthKit, Core Data).
      </p>
    ),
  },
];

const doNotCollect = [
  'Personal identification information',
  'Location data',
  'Usage analytics or behavioral data',
  'Device identifiers or fingerprints',
  'Advertising identifiers (IDFA)',
  'Browsing or search history',
  'Contact lists or social graph data',
];

const doNot = [
  'Sell or share data with third parties',
  'Use data for advertising or targeted marketing',
  'Track users across apps or websites',
  'Transmit any data to external servers',
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
            Your data never leaves your device.
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground" style={{ fontSize: '1.0625rem' }}>
            Effective April 13, 2026
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-6 glass-card rounded-[20px] p-6 border-l-2" style={{ borderLeftColor: 'hsl(var(--accent-green))' }}>
            <p className="text-sm text-muted-foreground leading-relaxed">
              RYZN ("the App") is developed by Steelberg Ventures. We are committed to protecting your privacy. RYZN is designed with a <strong className="text-foreground">local-first architecture</strong>. Your workout data, settings, and preferences are stored exclusively on your device. We do not operate servers that collect, store, or process your personal data.
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

        {/* Do not collect / Do not */}
        <motion.section className="mt-12" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.h2 variants={fadeUpVariant} className="text-2xl font-bold tracking-tight mb-6">Data Collection Summary</motion.h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent-green mb-4">We do not collect</h3>
              <ul className="space-y-2">
                {doNotCollect.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="text-accent-green mt-0.5 font-bold">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent-green mb-4">We do not</h3>
              <ul className="space-y-2">
                {doNot.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="text-accent-green mt-0.5 font-bold">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Data deletion */}
        <motion.section className="mt-12 space-y-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Trash2 size={18} className="text-accent-green" />
              <h2 className="font-semibold text-foreground text-lg">Data Deletion & Your Rights</h2>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>Since all data is stored locally on your device, you have full control over it at all times. To delete all App data, simply delete the RYZN app from your device.</p>
              <p>To revoke Sign in with Apple access, go to Settings &gt; [Your Name] &gt; Sign-In &amp; Security &gt; Sign in with Apple, select RYZN, and tap "Stop Using Apple ID."</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="glass-card rounded-[20px] p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Baby size={18} className="text-accent-green" />
              <h2 className="font-semibold text-foreground text-lg">Children's Privacy</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              RYZN is not directed at children under the age of 13. We do not knowingly collect personal information from children. Since the App does not collect any personal data from any user, no special provisions for children's data are necessary.
            </p>
          </motion.div>
        </motion.section>

        {/* Changes + Contact */}
        <motion.section className="mt-12" variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="glass-card rounded-[20px] p-6 text-sm text-muted-foreground leading-relaxed space-y-4">
            <div>
              <h3 className="text-foreground font-semibold mb-1">Changes to This Policy</h3>
              <p>We may update this Privacy Policy from time to time. If we make material changes, the updated policy will be posted at this URL with a revised effective date.</p>
            </div>
            <div className="h-px bg-primary/[0.1]" />
            <div>
              <h3 className="text-foreground font-semibold mb-1">Contact Us</h3>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong className="text-foreground">Steelberg Ventures</strong><br />
                Email: <a href="mailto:privacy@steelbergventures.com" className="text-accent-green hover:underline">privacy@steelbergventures.com</a>
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Privacy;
