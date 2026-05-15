import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Zap,
  Activity,
  Brain,
  Flame,
  Apple as AppleIcon,
  Shield,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Camera,
  Mic,
  Heart,
  List,
  Share2,
} from 'lucide-react';
import RyznIconLogo from '@/components/RyznIconLogo';
import RyznWordLogo from '@/components/RyznWordLogo';
import {
  STATES,
  getColor,
  RealMuscleMap,
} from '@/components/landing/MuscleMapSection';

// MARK: - Mobile landing page
//
// One-thumb-friendly variant of the marketing site. Stays in the same
// glassmorphic-dark visual language as the desktop landing (`Index`)
// so a user moving between viewports doesn't feel like they landed on
// a different brand. Sections are stacked vertically, tap targets are
// ≥ 44 pt, headlines are clamped tighter, and the bottom of the
// viewport has a sticky download FAB so the conversion path is one
// thumb-stretch away from anywhere on the page.
//
// Mobile users on `/` are auto-redirected here via the `MobileRedirect`
// wrapper in `App.tsx`. Desktop users who hit `/mobile` directly still
// get the page rendered fine — it works at any viewport.

const features = [
  {
    icon: Zap,
    title: 'Snap. Done.',
    headline: 'Photo logging that\'s instant.',
    body: 'Point your camera at a meal. AI identifies it, pulls real macros from a 270+ food database, logs it. Faster than thinking about it.',
    accent: 'from-primary/30 to-primary/5',
  },
  {
    icon: Activity,
    title: 'Live muscle map',
    headline: 'See what you trained.',
    body: 'Every set lights up the muscles you actually worked. Real-time. Color-coded by volume. No more guessing if your "back day" hit your back.',
    accent: 'from-blue-500/30 to-blue-500/5',
  },
  {
    icon: Brain,
    title: 'Patent-pending engine',
    headline: 'Calories that match reality.',
    body: 'BMR + TEF + NEAT + EAT + EPOC. The math behind your daily burn finally accounts for the workout you just did. Validated against lab research.',
    accent: 'from-emerald-400/30 to-emerald-400/5',
  },
  {
    icon: Flame,
    title: 'Streaks that stick',
    headline: 'Built for the long game.',
    body: 'NFC tag taps that start your workout in 2 seconds. Voice food logs while you cook. Apple Watch heart rate. Everything that makes "consistent" actually consistent.',
    accent: 'from-orange-500/30 to-orange-500/5',
  },
];

const stats = [
  { value: '270+', label: 'Foods in DB' },
  { value: '<1s', label: 'Photo log' },
  { value: '154', label: 'Exercises' },
  { value: '5', label: 'Energy formulas' },
];

const Mobile = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.96]);

  // Show the sticky FAB once the user has scrolled past the hero
  // CTA, so the download path is always one thumb-tap away. Hide it
  // again the moment the in-page download section enters the
  // viewport — otherwise the FAB would float on top of the App Store
  // button + footer copyright, which is both visually redundant and
  // covers content.
  const [showFab, setShowFab] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.6;
      const downloadSection = document.getElementById('download');
      const downloadInView = downloadSection
        ? downloadSection.getBoundingClientRect().top < window.innerHeight - 80
        : false;
      setShowFab(pastHero && !downloadInView);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" ref={scrollRef}>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-primary/[0.08]">
        <div className="flex items-center justify-between px-5 py-3">
          <Link to="/" aria-label="Go to desktop site">
            <RyznWordLogo height={20} />
          </Link>
          <a
            href="#download"
            className="text-xs font-bold tracking-wider uppercase text-primary px-3 py-1.5 rounded-full bg-primary/10 active:bg-primary/20 active:scale-95 transition-all duration-150"
          >
            Download
          </a>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <motion.section
        className="relative px-5 pt-10 pb-16 overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="hero-background pointer-events-none" />
        <div className="hero-grid pointer-events-none" />

        <div className="relative z-10 text-center">
          {/* Hero icon — gently swaying in 3D space. CSS perspective +
              animated rotateY on framer-motion makes the flat SVG read
              as a solid object being presented. Heavy drop-shadow with
              a faint green underglow gives it weight and "lifts" it
              off the page. */}
          <div
            className="relative inline-flex items-center justify-center mb-6"
            style={{
              width: 160,
              height: 160,
              perspective: '900px',
              perspectiveOrigin: '50% 40%',
            }}
          >
            {/* (Green halo behind icon removed per Jack — the page's
                ambient top glow handles atmosphere; a second pulse
                right under the logo was reading as muddy.) */}

            {/* The icon — tilts back-and-forth on the Y axis (a touch
                of X for liveliness). Plain dark drop-shadow gives
                the floating 3D feel without the green wash. */}
            <motion.div
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 18px 22px rgba(0,0,0,0.6))',
              }}
              animate={{
                rotateY: [-22, 22, -22],
                rotateX: [6, -4, 6],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <RyznIconLogo size={104} />
            </motion.div>

            {/* Subtle floor reflection — increases the floating-object
                read on darker phone backgrounds. */}
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{
                bottom: -2,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 110,
                height: 10,
                background:
                  'radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)',
                filter: 'blur(4px)',
              }}
            />
          </div>

          {/* Headline — clamped tighter for mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-extrabold leading-[0.95] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(2.5rem, 12vw, 4rem)' }}
          >
            <span className="block text-foreground">Log smarter.</span>
            <span className="block gradient-text">Lift heavier.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 text-muted-foreground text-base leading-relaxed max-w-sm mx-auto"
          >
            Patent-pending calorie engine. Real-time muscle maps. AI progression. Built for iPhone, not ported to it.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-7 flex flex-col gap-3"
          >
            <a
              href="#download"
              className="cta-primary cta-pulse inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 text-white font-bold text-base active:scale-95 transition-transform duration-100"
            >
              <AppleIcon className="w-5 h-5" />
              Get RYZN on App Store
            </a>
            <a
              href="#features"
              className="dmd-convex inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-muted-foreground font-semibold text-sm active:scale-95 transition-transform duration-100"
            >
              See what's inside
              <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 text-xs text-muted-foreground/50"
          >
            iPhone · iOS 15.0+ · 3-day free trial · $10/month
          </motion.p>
        </div>
      </motion.section>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <section className="px-5 mb-10">
        <div className="grid grid-cols-4 gap-2 dmd-concave rounded-2xl py-4 px-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="text-xl font-extrabold gradient-text tracking-tight">
                {stat.value}
              </div>
              <div className="text-[0.6rem] font-semibold tracking-wider uppercase text-muted-foreground/60 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features — tappable expanding cards ─────────────────── */}
      <section id="features" className="px-5 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dmd-concave mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-muted-foreground">
              What's inside
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] leading-tight">
            Four reasons it just <span className="gradient-text">works</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">Tap a card to expand.</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {features.map((feature, i) => {
            const isExpanded = expandedFeature === i;
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.title}
                onClick={() => setExpandedFeature(isExpanded ? null : i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.98 }}
                className={`relative text-left rounded-2xl p-5 overflow-hidden glass-card transition-all duration-300 ${
                  isExpanded ? 'border-primary/30' : ''
                }`}
                aria-expanded={isExpanded}
              >
                {/* Gradient wash — fades in when expanded */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.accent} pointer-events-none transition-opacity duration-300`}
                  style={{ opacity: isExpanded ? 1 : 0 }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl dmd-convex">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-muted-foreground/70">
                          {feature.title}
                        </div>
                        <div className="text-lg font-extrabold leading-tight mt-0.5">
                          {feature.headline}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex-shrink-0 text-muted-foreground/60"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          {feature.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── Muscle map mini ─────────────────────────────────────── */}
      <MuscleMapMobile />

      {/* ── Fuel logging demo ───────────────────────────────────── */}
      <FuelDemoMobile />

      {/* ── Share cards stack ───────────────────────────────────── */}
      <ShareCardsMobile />

      {/* ── Validation card ─────────────────────────────────────── */}
      <section className="px-5 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl p-6 overflow-hidden glass-card glow-border"
        >
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, transparent 70%)',
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 mb-3">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[0.6rem] font-bold tracking-wider uppercase text-primary">
                Patent pending
              </span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight leading-tight">
              Calorie math that finally <span className="gradient-text">tells the truth</span>.
            </h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Most apps give you a single BMR number and call it a day. RYZN runs the full equation: basal metabolic rate, thermic effect of food, non-exercise activity, the actual workout you just logged, and the calories you keep burning after you finish (EPOC). The numbers match what a lab would tell you.
            </p>
            <Link
              to="/validation"
              className="mt-4 inline-flex items-center gap-1.5 text-primary text-sm font-bold active:opacity-70 transition-opacity"
            >
              See the validation
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Scan-tag CTA ───────────────────────────────────────────
            Pulsing replica of the physical RyznTag. Hover/tap fades
            the icon out and reveals "Click here". Tap navigates to
            /scan (the post-NFC-tap explainer page). Plain anchor
            (not Link) — /scan is a static file, not a React route. */}
      <section className="px-5 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-5"
        >
          <p className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted-foreground/70 mb-2">
            Have a RyznTag?
          </p>
          <h3 className="text-xl font-extrabold tracking-tight">
            Tap it. <span className="gradient-text">Lift starts.</span>
          </h3>
        </motion.div>

        <motion.a
          href="/scan/"
          aria-label="See what happens when you tap a RyznTag"
          className="relative mx-auto block"
          style={{ width: 140, height: 140 }}
          initial="rest"
          animate="rest"
          whileHover="active"
          whileTap="active"
          variants={{ rest: {}, active: {} }}
        >
          {/* Pulsing rings — read as the tag broadcasting */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-3xl"
            style={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.55)' }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(34,197,94,0.55)',
                '0 0 0 36px rgba(34,197,94,0)',
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-3xl"
            style={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.35)' }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(34,197,94,0.35)',
                '0 0 0 24px rgba(34,197,94,0)',
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
          />

          {/* The tag card itself — same off-white surface as the
              physical sticker. Holds both the icon and the "click
              here" overlay; they cross-fade on hover/tap. */}
          <div
            className="relative flex items-center justify-center rounded-3xl w-full h-full overflow-hidden"
            style={{
              background:
                'linear-gradient(160deg, #f5f3ee 0%, #e8e5dc 100%)',
              boxShadow:
                '0 12px 28px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.08)',
            }}
          >
            {/* Icon — fades out on hover/tap.
                mainFill stays neutral black so the icon doesn't read
                as green-tinted against the off-white tag surface. */}
            <motion.div
              className="absolute"
              variants={{
                rest:   { opacity: 1, scale: 1 },
                active: { opacity: 0, scale: 0.88 },
              }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <RyznIconLogo size={70} mainFill="#0a0a0a" />
            </motion.div>

            {/* "Click here" — fades up from below on hover/tap */}
            <motion.div
              className="absolute flex flex-col items-center gap-1"
              variants={{
                rest:   { opacity: 0, y: 14 },
                active: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="text-[0.95rem] font-extrabold tracking-tight"
                style={{ color: '#0a3d20' }}
              >
                Click here
              </span>
              <span
                className="text-[0.6rem] font-bold tracking-[0.16em] uppercase"
                style={{ color: 'rgba(10,61,32,0.55)' }}
              >
                See how it works
              </span>
            </motion.div>
          </div>
        </motion.a>

        {/* Small static hint under the tag so touch users without a
            hover state still know it's interactive. */}
        <p className="mt-4 text-center text-xs text-muted-foreground/70">
          Tap the tag to see what RYZN does.
        </p>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section className="px-5 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl font-extrabold tracking-[-0.02em]">
            One plan. <span className="gradient-text">Everything</span>.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Full access. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative rounded-2xl p-6 dmd-convex"
        >
          <div className="flex items-baseline gap-2 justify-center">
            <span className="text-5xl font-extrabold tracking-tight gradient-text">$10</span>
            <span className="text-muted-foreground font-medium">/mo</span>
          </div>
          <p className="text-center text-xs text-muted-foreground/70 mt-2">
            billed monthly · cancel anytime
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              'Photo + voice food logging',
              'Real-time muscle map',
              'AI-driven progression',
              'Apple Watch heart-rate sync',
              'Patent-pending energy engine',
              'NFC tag quick-start',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ── Final CTA + App Store ───────────────────────────────── */}
      <section id="download" className="relative px-5 py-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34, 197, 94, 0.18) 0%, transparent 70%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center"
        >
          <div className="inline-flex p-3 rounded-2xl dmd-convex mb-5">
            <RyznIconLogo size={40} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] leading-tight">
            Train with<br />intelligence.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The fitness app built for iPhone — not ported to it. Download and start your first session today.
          </p>
          <a
            href="https://apps.apple.com/app/ryzn"
            className="cta-primary cta-pulse mt-7 inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-foreground text-background font-bold text-base active:scale-95 transition-transform duration-100"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
            </svg>
            <div className="text-left leading-tight">
              <div className="text-[0.625rem] opacity-70">Download on the</div>
              <div className="text-sm">App Store</div>
            </div>
          </a>
          <p className="mt-5 text-xs text-muted-foreground/50">
            iPhone · iOS 15.0+ · 3-day free trial · $10/month
          </p>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      {/* Generous bottom padding so the copyright line clears the
          global ChatBubble that's fixed bottom-6 right-6 across every
          page. Without this the © line sits behind the 56-px chat
          orb on phones. */}
      <footer className="px-5 pt-10 pb-28 border-t border-primary/[0.08]">
        <div className="flex flex-col items-center gap-5 text-center">
          <RyznWordLogo height={20} />
          <p className="text-xs text-muted-foreground/70 max-w-xs leading-relaxed">
            The workout app that trains as hard as you do.
          </p>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Privacy Policy
            </Link>
            <a href="mailto:hello@ryznrise.com" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Contact
            </a>
            <Link to="/validation" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Validation
            </Link>
            <Link to="/reviews" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Reviews
            </Link>
            <Link to="/feedback" className="text-primary hover:opacity-80 transition-opacity font-semibold">
              Leave Feedback →
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Desktop site
            </Link>
          </div>

          <p className="text-[0.65rem] text-muted-foreground/40 font-medium tracking-wider uppercase mt-2">
            © 2026 RYZN · Built for iPhone, not ported to it.
          </p>
        </div>
      </footer>

      {/* ── Sticky download FAB ─────────────────────────────────── */}
      <AnimatePresence>
        {showFab && (
          <motion.a
            href="#download"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 left-5 z-30 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary to-emerald-500 text-white font-bold text-sm shadow-[0_8px_24px_rgba(34,197,94,0.4)] active:shadow-[0_4px_12px_rgba(34,197,94,0.5)]"
            aria-label="Download RYZN"
          >
            <AppleIcon className="w-4 h-4" />
            Download
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// MuscleMapMobile — compact heatmap that auto-cycles through training
// states once it scrolls into view. Reuses the same SVG paths + state
// table from the desktop section (see MuscleMapSection.tsx) so the
// truth lives in one place — only the layout and frame size differ.
// ─────────────────────────────────────────────────────────────────────
const MUSCLE_LEGEND = [
  { level: 1, label: 'Light' },
  { level: 2, label: 'Optimal' },
  { level: 3, label: 'Overworked' },
];

function MuscleMapMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.45 });
  const [stateIdx, setStateIdx] = useState(0);

  // Parallax — the figure drifts upward while the section scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  // Cycle through training-volume states only while the section is
  // actually visible. Pausing off-screen keeps the page calm and
  // avoids a stale stateIdx the moment it scrolls back into view.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setStateIdx((p) => (p + 1) % STATES.length);
    }, 1900);
    return () => clearInterval(id);
  }, [inView]);

  const currentState = STATES[stateIdx];
  const chestColor = getColor(currentState.chest);

  return (
    <section ref={sectionRef} className="relative px-5 mb-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dmd-concave mb-3">
          <Activity className="w-3 h-3 text-primary" />
          <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Muscle map
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-[-0.02em] leading-tight">
          Every set <span className="gradient-text">lights up</span> your body.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
          Real-time heatmap tracks which muscles you're hitting — and which still need work.
        </p>
      </motion.div>

      {/* Figure card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl p-6 overflow-hidden glass-card"
      >
        {/* Pulsing glow behind the figure that shifts color with chest activation */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${chestColor}22, transparent 70%)`,
          }}
        />

        <motion.div style={{ y: figureY }} className="relative flex flex-col items-center">
          <RealMuscleMap state={currentState} className="w-full h-auto max-w-[220px]" />

          {/* Step pips */}
          <div className="mt-3 flex gap-1.5">
            {STATES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === stateIdx ? 16 : 6,
                  height: 6,
                  backgroundColor: i === stateIdx ? '#22c55e' : 'rgba(255,255,255,0.18)',
                  boxShadow: i === stateIdx ? '0 0 8px rgba(34,197,94,0.55)' : 'none',
                }}
              />
            ))}
          </div>
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground/50 mt-2">
            Simulating a workout
          </p>
        </motion.div>

        {/* Legend — three concave chips below the figure */}
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {MUSCLE_LEGEND.map((l) => {
            const color = getColor(l.level);
            return (
              <div
                key={l.label}
                className="dmd-concave rounded-xl px-2.5 py-2 flex flex-col items-center gap-1"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {l.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FuelDemoMobile — the looping "snap + speak the details" fuel-tracking
// video framed in a smaller phone bezel. Same /video/fuel-demo.mp4 the
// desktop section uses, so it ships zero extra weight. Hover tilt is
// dropped (no cursor on touch) but the float + glow stay so the frame
// still feels alive while you scroll past.
// ─────────────────────────────────────────────────────────────────────
const FUEL_CHIPS: Array<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  copy: string;
  highlight?: boolean;
}> = [
  { icon: Camera, title: 'Snap', copy: 'AI IDs the plate in under a second.' },
  { icon: Mic, title: 'Speak', copy: 'Narrate tweaks — "no rice, extra chicken."', highlight: true },
  { icon: List, title: 'Re-log', copy: 'Yesterday’s lunch in one tap.' },
  { icon: Heart, title: 'HR fuse', copy: 'Live heart-rate tightens accuracy.' },
];

function FuelDemoMobile() {
  return (
    <section className="px-5 mb-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dmd-concave mb-3">
          <Camera className="w-3 h-3 text-primary" />
          <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Snap + voice fuel
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-[-0.02em] leading-tight">
          Take a picture. <span className="gradient-text">Speak the details.</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
          Vision and voice fuse into one log — stacked against the calories you actually burned.
        </p>
      </motion.div>

      {/* Phone mock */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center"
      >
        <div className="relative" style={{ width: 230 }}>
          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 blur-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 70% at 50% 60%, rgba(34,197,94,0.28) 0%, rgba(69,183,209,0.10) 45%, transparent 70%)',
            }}
          />

          {/* Bezel */}
          <div
            className="relative rounded-[36px] p-[3px] phone-float-slow"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(34,197,94,0.14) 40%, rgba(255,255,255,0.05))',
              boxShadow: '0 30px 60px -16px rgba(0,0,0,0.6)',
            }}
          >
            {/* Screen */}
            <div
              className="relative rounded-[33px] overflow-hidden"
              style={{
                background: '#0a0d12',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div className="relative w-full" style={{ aspectRatio: '9/19.5' }}>
                <video
                  src="/video/fuel-demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dynamic island */}
                <div
                  className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 rounded-full bg-black"
                  style={{ width: 72, height: 22 }}
                />
                {/* Specular sheen */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none rounded-[33px]"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 35%, transparent 65%, rgba(34,197,94,0.08) 100%)',
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature chips */}
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-6 grid grid-cols-2 gap-2.5"
      >
        {FUEL_CHIPS.map((c) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className={`dmd-convex rounded-2xl p-3 flex items-start gap-2.5 relative overflow-hidden ${
                c.highlight ? 'border border-primary/20' : ''
              }`}
            >
              {c.highlight && (
                <div
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.35), transparent 70%)' }}
                />
              )}
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 relative">
                <div className="text-[0.8rem] font-bold leading-tight flex items-center gap-1">
                  {c.title}
                  {c.highlight && (
                    <span className="text-[0.55rem] font-bold uppercase tracking-wider text-primary px-1 py-0.5 rounded-full bg-primary/10">
                      Signature
                    </span>
                  )}
                </div>
                <p className="text-[0.7rem] text-muted-foreground mt-0.5 leading-snug">{c.copy}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ShareCardsMobile — three stacked workout share cards. Desktop uses a
// hover trigger to fan them out; touch has no hover, so we auto-spread
// the moment the section scrolls into view, then settle back into the
// stack once it leaves. Floating platform chips orbit the front card
// to reinforce the "post anywhere" idea.
// ─────────────────────────────────────────────────────────────────────
// Pill offsets are measured from the card-stack center. Stack is 220
// wide × ~280 tall, so anything within ±110 horizontal / ±140 vertical
// sits *on* a card. Push pills further than that so each one reads as
// a separate orbiting chip, not a sticker.
const SHARE_PILLS = [
  { key: 'stories', label: 'Stories', icon: '/icons/instagram.png', x: -120, y: -180 }, // up-left, clear of the back-left card
  { key: 'imessage', label: 'iMessage', icon: '/icons/imessage.png', x: -120, y: 180 }, // down-left, below the stack
  { key: 'tiktok', label: 'TikTok', icon: '/icons/tiktok.png', x: 120, y: 200 }, // down-right, further down than before
];

function ShareCardsMobile() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackInView = useInView(sectionRef, { amount: 0.5 });

  return (
    <section ref={sectionRef} className="px-5 mb-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dmd-concave mb-3">
          <Share2 className="w-3 h-3 text-primary" />
          <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-muted-foreground">
            Share cards
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-[-0.02em] leading-tight">
          Your workout deserves <span className="gradient-text">a moment</span>.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
          Every session ends with a branded card built for Stories, iMessage, and TikTok.
        </p>
      </motion.div>

      {/* Stack — tall enough to clear the orbiting pills above + below */}
      <div
        className="relative mx-auto"
        style={{ width: 280, height: 460, perspective: 1100 }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-[40px] blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(34,197,94,0.32) 0%, rgba(34,197,94,0.08) 50%, transparent 75%)',
            transform: 'scale(1.15)',
          }}
        />

        {/* Card 3 — back-left (blue tint, fanned out) */}
        <div className="absolute top-1/2 left-1/2 z-10" style={{ width: 200, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            animate={{
              x: stackInView ? -56 : -24,
              y: stackInView ? -30 : -16,
              rotate: stackInView ? -11 : -5,
              opacity: 0.85,
            }}
            transition={{ type: 'spring', stiffness: 170, damping: 22 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  '0 16px 36px rgba(0,0,0,0.5), 0 0 24px rgba(96,165,250,0.22), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              <img
                src="/share-card.jpg"
                alt=""
                aria-hidden
                className="w-full block"
                style={{ filter: 'saturate(0.95) brightness(0.92)' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Card 2 — back-right (pink-tinted left panel) */}
        <div className="absolute top-1/2 left-1/2 z-10" style={{ width: 208, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            animate={{
              x: stackInView ? 56 : 24,
              y: stackInView ? -30 : -16,
              rotate: stackInView ? 11 : 5,
              opacity: 0.85,
            }}
            transition={{ type: 'spring', stiffness: 170, damping: 22 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  '0 20px 44px rgba(0,0,0,0.5), 0 0 24px rgba(236,72,153,0.28), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              <img src="/share-card.jpg" alt="" aria-hidden className="w-full block" />
              <div
                aria-hidden
                className="absolute top-0 bottom-0 left-0 pointer-events-none"
                style={{
                  width: '42%',
                  background: 'linear-gradient(180deg, rgba(244,114,182,0.95) 0%, rgba(236,72,153,0.9) 100%)',
                  mixBlendMode: 'color',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Card 1 — front (green hero, gentle float) */}
        <div className="absolute top-1/2 left-1/2 z-20" style={{ width: 220, transform: 'translate(-50%, -50%)' }}>
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                '0 24px 50px rgba(0,0,0,0.55), 0 0 56px rgba(34,197,94,0.28), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
            animate={{ y: [0, -5, 0] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <img src="/share-card-green.jpg" alt="RYZN workout share card" className="w-full block" />
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 35%, transparent 65%, rgba(34,197,94,0.12) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          </motion.div>
        </div>

        {/* Floating platform pills — orbit the front card when in view */}
        {SHARE_PILLS.map((p, idx) => (
          <div
            key={p.key}
            className="absolute top-1/2 left-1/2 z-0 pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md select-none"
              style={{
                background: 'rgba(20,20,28,0.78)',
                border: '1px solid rgba(34,197,94,0.3)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4), 0 0 16px rgba(34,197,94,0.18)',
              }}
              animate={{
                x: stackInView ? p.x : 0,
                y: stackInView ? p.y : 0,
                opacity: stackInView ? 1 : 0,
                scale: stackInView ? 1 : 0.6,
              }}
              transition={{
                delay: stackInView ? 0.25 + idx * 0.12 : 0,
                type: 'spring',
                stiffness: 200,
                damping: 22,
              }}
            >
              <img src={p.icon} alt="" className="w-3.5 h-3.5 object-contain" />
              <span className="text-[0.7rem] font-medium text-foreground/95 whitespace-nowrap">
                {p.label}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Mobile;
