import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  ClipboardList,
  Trophy,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Dumbbell,
  LineChart,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import Footer from '@/components/landing/Footer';

// RYZN for Coaches — Trainer Mode info + pricing page.
//
// UNPUBLISHED: this route ships in the bundle but is intentionally NOT
// linked from the navbar, footer, or sitemap. The iOS app's "RYZN for
// Coaches" button deep-links straight to /coaches#pricing. When Jack
// says go, add it to Navbar routeLinks + Footer and it's live.

const CONTACT_EMAIL = 'hello@ryznrise.com';
const CONTACT_SUBJECT = encodeURIComponent('RYZN for Coaches — Early Access');
const CONTACT_BODY = encodeURIComponent(
  "Hi Jack,\n\nI'm a coach/trainer interested in RYZN for Coaches.\n\nSport / discipline:\nTeam or client count:\nWhat I'm looking for:\n"
);
const contactHref = `mailto:${CONTACT_EMAIL}?subject=${CONTACT_SUBJECT}&body=${CONTACT_BODY}`;

const features = [
  {
    icon: Users,
    title: 'Your whole roster, live',
    desc: 'Invite athletes with a code. See workouts, nutrition, and consistency the moment they log — auto-verified, never self-reported.',
  },
  {
    icon: ClipboardList,
    title: 'Programs & session drops',
    desc: 'Author standing multi-week programs or drop a one-off session or benchmark. Athletes adopt it into their week with one tap.',
  },
  {
    icon: CheckCircle2,
    title: 'Completion boards',
    desc: 'Every assignment shows who adopted it and who finished it — per athlete, per day. No more "did you do the lift?" texts.',
  },
  {
    icon: Trophy,
    title: 'Team leaderboard',
    desc: 'Weekly rankings built from real logged data. Workouts and nutrition scores your athletes can\'t fake.',
  },
  {
    icon: BookOpen,
    title: 'Playbook, drills & resources',
    desc: 'A team handbook with play diagrams, coach-made drills published to the exercise library, and a binder for rules, schedules, and guides.',
  },
  {
    icon: MessageSquare,
    title: 'Private-client mode',
    desc: 'Personal trainers get a 1-on-1 setup: client home page, direct messaging, and per-client macro assignments. No leaderboard noise.',
  },
  {
    icon: LineChart,
    title: 'Athlete deep-dives',
    desc: 'Food score and consistency gauges per athlete, computed from verified logs. Assign macros and watch adherence.',
  },
  {
    icon: Dumbbell,
    title: 'Full conditioning library',
    desc: 'Sprints, shuttles, sleds, swim, agility, HIIT — every conditioning mode with a built-in timer, plus 150+ lifts with muscle activation data.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin seats',
    desc: 'Invite assistant coaches, nutritionists, or parents-as-admins. They see the same analytics you do — without edit access.',
  },
];

const tiers = [
  {
    badge: 'SOLO TRAINER',
    name: 'Trainer',
    price: '$29',
    period: '/ month',
    sub: 'For personal trainers',
    features: [
      'Up to 10 private clients',
      '1-on-1 client home + messaging',
      'Per-client programs & macro assignments',
      'Client progress analytics',
      'Every client gets RYZN Pro included',
    ],
    highlight: false,
  },
  {
    badge: 'MOST POPULAR',
    name: 'Team Coach',
    price: '$79',
    period: '/ month',
    sub: 'For team sports coaches',
    features: [
      'Up to 40 athletes on one team',
      'Programs, session drops & completion boards',
      'Leaderboard + auto-verified goals',
      'Playbook, drills & team resources',
      '2 admin seats included',
      'Every athlete gets RYZN Pro included',
    ],
    highlight: true,
  },
  {
    badge: 'PROGRAMS & ORGS',
    name: 'Organization',
    price: 'Custom',
    period: '',
    sub: 'Schools, clubs & multi-team programs',
    features: [
      'Multiple teams under one roof',
      'Unlimited admin seats',
      'Cross-team analytics',
      'Onboarding for your staff',
      'Direct line to the founder',
    ],
    highlight: false,
  },
];

const Coaches = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-foreground">
      {/* Minimal top bar — logo home link only. The main navbar's hash
          links target homepage sections and would dead-end here. */}
      <nav className="fixed top-3 left-0 right-0 z-[1000] flex justify-center px-4">
        <div className="w-full max-w-[1080px] h-14 rounded-full flex items-center justify-between pl-6 pr-3 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.72)] border border-primary/[0.12] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]">
          <Link to="/" className="flex items-center">
            <RyznWordLogo height={28} />
          </Link>
          <a
            href={contactHref}
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
          >
            GET EARLY ACCESS
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--primary) / 0.14) 0%, transparent 70%)' }}
        />
        <motion.div
          className="relative z-10 max-w-[900px] mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary"
          >
            RYZN FOR COACHES
          </motion.span>
          <motion.h1
            variants={fadeUpVariant}
            className="mt-5 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.25rem)', lineHeight: 1.08 }}
          >
            Coach the team.
            <br />
            <span className="gradient-text">RYZN handles the rest.</span>
          </motion.h1>
          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-muted-foreground text-lg lg:text-xl max-w-[640px] mx-auto leading-relaxed"
          >
            Program the training, drop it to your roster, and watch real completion data
            roll in — workouts, nutrition, and consistency, verified by the app, not the
            group chat.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={contactHref}
              className="px-8 py-4 rounded-[14px] font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
            >
              Get Early Access
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-[14px] font-bold text-sm glass-card text-muted-foreground border border-primary/15 hover:border-primary/30 hover:text-foreground transition-all duration-300"
            >
              See Pricing
            </a>
          </motion.div>
          <motion.p variants={fadeUpVariant} className="mt-4 text-xs text-muted-foreground/60">
            Early access is limited — every coach onboards directly with the founder.
          </motion.p>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-16 lg:py-24">
        <motion.div
          className="max-w-[1200px] mx-auto px-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUpVariant} className="text-center">
            <span className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary">
              THE TOOLKIT
            </span>
            <h2
              className="mt-4 font-bold tracking-tight text-foreground"
              style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
            >
              Everything between the whiteboard and the weight room.
            </h2>
          </motion.div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUpVariant}
                className="dmd-convex rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-[12px] dmd-concave flex items-center justify-center text-primary">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-4 font-bold text-foreground text-base">{f.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing — the app's "RYZN for Coaches" button deep-links here. */}
      <section id="pricing" className="relative py-16 lg:py-24 scroll-mt-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }}
        />
        <motion.div
          className="relative z-10 max-w-[1200px] mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary"
          >
            COACH PRICING
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
          >
            One subscription. Your whole roster included.
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="mt-4 text-muted-foreground text-lg max-w-[620px] mx-auto">
            Your athletes and clients never pay — every seat includes RYZN Pro.
            Founding coaches lock their rate for life.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            {tiers.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUpVariant}
                className="relative dmd-convex rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={
                  t.highlight
                    ? { boxShadow: '0 0 60px hsl(var(--primary) / 0.14), inset 0 1px 0 rgba(255,255,255,0.05)' }
                    : undefined
                }
              >
                <span className="dmd-concave inline-block self-start px-3 py-1 rounded-pill text-primary text-[10px] font-semibold tracking-widest uppercase mb-4">
                  {t.badge}
                </span>
                <h3 className="font-bold text-foreground text-xl">RYZN {t.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{t.sub}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span
                    className={`font-extrabold ${t.highlight ? 'gradient-text' : 'text-foreground'}`}
                    style={{ fontSize: t.price === 'Custom' ? '1.9rem' : '2.5rem' }}
                  >
                    {t.price}
                  </span>
                  {t.period && <span className="text-muted-foreground text-base">{t.period}</span>}
                </div>

                <div className="mt-6 space-y-3 flex-1">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5 font-bold text-sm">✓</span>
                      <span className="text-foreground/80 text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={contactHref}
                  className={`block w-full mt-8 py-3.5 rounded-[14px] font-bold text-sm text-center transition-all duration-300 ${
                    t.highlight
                      ? 'bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary'
                      : 'glass-card text-muted-foreground border border-primary/15 hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {t.price === 'Custom' ? 'Talk to Jack' : 'Get Early Access'}
                </a>
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={fadeUpVariant} className="mt-8 text-xs text-muted-foreground/60">
            Early-access pricing — final plans may change before public launch. Founding coaches keep their rate.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-16 lg:py-24">
        <motion.div
          className="max-w-[760px] mx-auto px-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={fadeUpVariant}
            className="dmd-convex rounded-[24px] p-10 lg:p-12 text-center overflow-hidden relative"
          >
            <div
              className="absolute inset-0 -z-10 pointer-events-none opacity-60"
              style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--primary) / 0.18), transparent 70%)' }}
            />
            <h2
              className="font-bold tracking-tight text-foreground"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.15 }}
            >
              Bring your team to <span className="gradient-text">RYZN</span>.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-[520px] mx-auto">
              Tell me about your team or client roster and I'll set you up personally —
              demo walkthrough, onboarding, and founding-coach pricing.
            </p>
            <a
              href={contactHref}
              className="inline-block mt-8 px-10 py-4 rounded-[14px] font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
            >
              Email {CONTACT_EMAIL}
            </a>
            <p className="mt-3 text-[11px] text-muted-foreground/60">
              Replies come from the founder. Usually same-day.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Coaches;
