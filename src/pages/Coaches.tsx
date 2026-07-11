import { useEffect } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import Footer from '@/components/landing/Footer';

// RYZN for Coaches — image-led Trainer Mode page. NO PRICING anywhere:
// deals are closed directly over email (Jack, 2026-07-11).
//
// UNPUBLISHED: this route ships in the bundle but is intentionally NOT
// linked from the navbar, footer, or sitemap. The iOS app's "RYZN for
// Coaches" buttons deep-link to /coaches#pricing — that anchor now
// lives on the final "invite-only" CTA section, so old links land on
// the register block instead of a dead hash.

const CONTACT_EMAIL = 'hello@ryznrise.com';
const CONTACT_SUBJECT = encodeURIComponent('RYZN for Coaches — Register My Team');
const CONTACT_BODY = encodeURIComponent(
  "Hi Jack,\n\nI'm a coach/trainer interested in RYZN for Coaches.\n\nSport / discipline:\nTeam or client count:\nWhat I'm looking for:\n"
);
const contactHref = `mailto:${CONTACT_EMAIL}?subject=${CONTACT_SUBJECT}&body=${CONTACT_BODY}`;

// Real-world photography (Unsplash CDN, license-free).
const IMG = {
  hero: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2000&q=80&auto=format&fit=crop',
  roster: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1400&q=80&auto=format&fit=crop',
  program: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1400&q=80&auto=format&fit=crop',
  work: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1400&q=80&auto=format&fit=crop',
  cta: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=2000&q=80&auto=format&fit=crop',
};

// Three image-led bands. Copy is deliberately tight — the photo sells,
// the bullets confirm.
const bands = [
  {
    img: IMG.roster,
    alt: 'Team celebrating a win on the court',
    eyebrow: 'THE ROSTER',
    title: 'Your whole team, live.',
    points: [
      { icon: Users, text: 'Invite the roster with one code' },
      { icon: Trophy, text: 'Weekly leaderboard from real logs' },
      { icon: CheckCircle2, text: 'Auto-verified — nothing self-reported' },
    ],
  },
  {
    img: IMG.program,
    alt: 'Athlete pressing a barbell overhead in the rack',
    eyebrow: 'THE PROGRAM',
    title: 'Write it once. Drop it to everyone.',
    points: [
      { icon: ClipboardList, text: 'Multi-week programs & session drops' },
      { icon: Dumbbell, text: '150+ lifts, full conditioning library' },
      { icon: CheckCircle2, text: 'Completion boards — who did the work' },
    ],
  },
  {
    img: IMG.work,
    alt: 'Athlete grinding out pull-ups in a dark gym',
    eyebrow: 'THE ATHLETES',
    title: 'See who\u2019s putting in the work.',
    points: [
      { icon: LineChart, text: 'Per-athlete food & consistency scores' },
      { icon: MessageSquare, text: 'Assign macros, message directly' },
      { icon: BookOpen, text: 'Playbook, drills & team resources' },
    ],
  },
];

const extras = [
  { icon: MessageSquare, text: 'Private-client mode for trainers' },
  { icon: ShieldCheck, text: 'Admin seats for your staff' },
  { icon: Trophy, text: 'Athletes get RYZN Pro included' },
];

const Coaches = () => {
  // The app deep-links to /coaches#pricing. On a cold SPA load the
  // browser's native hash scroll fires before React mounts the section
  // (and Lenis owns the scroll on desktop), so we scroll manually.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -96, immediate: true });
      else el.scrollIntoView({ behavior: 'smooth' }); // touch: native scroll
    }, 100);
    return () => clearTimeout(t);
  }, []);

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
            BECOME A COACH
          </a>
        </div>
      </nav>

      {/* Hero — full-bleed real-world photo, minimal copy. */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <img
          src={IMG.hero}
          alt="Sprinter set in the starting blocks on a track"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        {/* Readability + brand grade over the photo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(8,8,12,0.96) 0%, rgba(8,8,12,0.55) 45%, rgba(8,8,12,0.35) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 100%, hsl(var(--primary) / 0.16) 0%, transparent 70%)',
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pb-20 lg:pb-28"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-[rgba(8,8,14,0.6)] backdrop-blur-md border border-primary/25"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            RYZN for Coaches
          </motion.span>
          <motion.h1
            variants={fadeUpVariant}
            className="mt-6 font-extrabold tracking-[-0.03em] text-foreground max-w-[820px]"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', lineHeight: 1.02 }}
          >
            Your team.
            <br />
            <span className="gradient-text">One app.</span>
          </motion.h1>
          <motion.p
            variants={fadeUpVariant}
            className="mt-5 text-foreground/80 text-lg lg:text-xl max-w-[520px] leading-relaxed"
          >
            Program the training. Watch verified work roll in. No spreadsheets, no group chats.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={contactHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-pill font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
            >
              Become a RYZN Coach
              <ArrowRight size={16} />
            </a>
            <a
              href="#toolkit"
              className="px-8 py-4 rounded-pill font-semibold text-sm text-foreground/80 bg-[rgba(8,8,14,0.55)] backdrop-blur-md border border-white/10 hover:border-primary/40 hover:text-foreground transition-all duration-300"
            >
              See it in action
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Image-led feature bands — photo sells, three bullets confirm. */}
      <section id="toolkit" className="relative py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 space-y-24 lg:space-y-32">
          {bands.map((band, i) => (
            <motion.div
              key={band.title}
              className={`flex flex-col gap-10 lg:gap-16 items-center ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              }`}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {/* Photo */}
              <motion.div variants={fadeUpVariant} className="w-full lg:w-[55%]">
                <div className="relative rounded-[24px] overflow-hidden group">
                  <img
                    src={band.img}
                    alt={band.alt}
                    loading="lazy"
                    className="w-full h-[320px] lg:h-[440px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(8,8,12,0.45) 0%, transparent 45%)',
                      boxShadow: 'inset 0 0 0 1px hsl(var(--primary) / 0.15)',
                      borderRadius: '24px',
                    }}
                  />
                  <div
                    className="absolute -inset-6 -z-10 blur-[50px] opacity-50"
                    style={{
                      background:
                        'radial-gradient(ellipse 60% 60% at 50% 60%, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </motion.div>

              {/* Copy */}
              <div className="w-full lg:w-[45%]">
                <motion.span
                  variants={fadeUpVariant}
                  className="dmd-concave inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary"
                >
                  {band.eyebrow}
                </motion.span>
                <motion.h2
                  variants={fadeUpVariant}
                  className="mt-4 font-bold tracking-tight text-foreground"
                  style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
                >
                  {band.title}
                </motion.h2>
                <div className="mt-7 space-y-4">
                  {band.points.map((p) => (
                    <motion.div
                      key={p.text}
                      variants={fadeUpVariant}
                      className="flex items-center gap-4"
                    >
                      <div className="w-9 h-9 shrink-0 rounded-[10px] dmd-concave flex items-center justify-center text-primary">
                        <p.icon size={17} />
                      </div>
                      <span className="text-foreground/85 text-[1.0625rem]">{p.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extras — one quiet pill row, no card wall. */}
      <section className="relative pb-6">
        <motion.div
          className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {extras.map((e) => (
            <motion.span
              key={e.text}
              variants={fadeUpVariant}
              className="dmd-convex inline-flex items-center gap-2.5 px-5 py-2.5 rounded-pill text-sm text-foreground/75"
            >
              <e.icon size={15} className="text-primary" />
              {e.text}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Register — invite-only, deals closed directly. Keeps the
          id="pricing" anchor so existing iOS deep-links land here. */}
      <section id="pricing" className="relative py-24 lg:py-32 mt-16 overflow-hidden scroll-mt-24">
        <img
          src={IMG.cta}
          alt="Athletes running at dawn"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(8,8,12,0.97) 0%, rgba(8,8,12,0.72) 50%, rgba(8,8,12,0.95) 100%)',
          }}
        />
        <motion.div
          className="relative z-10 max-w-[760px] mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary bg-[rgba(8,8,14,0.6)] backdrop-blur-md border border-primary/25"
          >
            Invite-only
          </motion.span>
          <motion.h2
            variants={fadeUpVariant}
            className="mt-5 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', lineHeight: 1.08 }}
          >
            Bring your team to <span className="gradient-text">RYZN</span>.
          </motion.h2>
          <motion.p
            variants={fadeUpVariant}
            className="mt-5 text-foreground/75 text-lg leading-relaxed max-w-[540px] mx-auto"
          >
            Coaching on RYZN is invite-only. Tell me about your team and I&apos;ll set you up
            personally — your athletes never pay a cent.
          </motion.p>
          <motion.div variants={fadeUpVariant}>
            <a
              href={contactHref}
              className="inline-flex items-center gap-2 mt-9 px-10 py-4 rounded-pill font-bold text-sm bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
            >
              Register as a Coach
              <ArrowRight size={16} />
            </a>
          </motion.div>
          <motion.p variants={fadeUpVariant} className="mt-4 text-xs text-foreground/45">
            {CONTACT_EMAIL} — replies come from the founder, usually same-day.
          </motion.p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Coaches;
