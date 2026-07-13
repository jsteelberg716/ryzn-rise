import { motion } from 'framer-motion';
import { Camera, Mic, List, Wand2, Heart } from 'lucide-react';
import { fadeUpVariant, staggerContainer, EASING } from '@/lib/animations';

/* =============================================================================
   RYZN "Snap + Voice" Fuel Tracking section.

   Right column is the self-contained plate-slide Fuel animation embedded from
   /public/fuel/index.html (same pattern as the RyznTag scan embed): a plate
   slides in from the left, scan brackets lock on, macros accumulate.
============================================================================ */

const CalorieLoggingSection = () => {
  return (
    <section className="relative bg-background py-20 lg:py-32 section-glow overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 70% 30%, hsl(var(--primary) / 0.1), transparent 70%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(69,183,209,0.06), transparent 60%)',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* ────── Left: copy ────── */}
        <motion.div
          className="flex-1 w-full max-w-[560px]"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            variants={fadeUpVariant}
            className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-accent-green"
          >
            SNAP + VOICE FUEL TRACKING
          </motion.span>

          <motion.h2
            variants={fadeUpVariant}
            className="mt-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.12 }}
          >
            Take a picture. <span className="gradient-text">Speak the details.</span>
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            className="mt-6 text-muted-foreground leading-relaxed text-[1.0625rem]"
          >
            Open the <strong className="text-foreground">Fuel</strong> tab, point the camera at
            a plate, a drink, or a glass of water — RYZN reads what it sees. Then{' '}
            <strong className="text-foreground">hold the mic</strong> and narrate what the camera
            can&apos;t: <em>"no rice, extra chicken,"</em> <em>"cooked in butter,"</em>{' '}
            <em>"half a pint."</em> Vision and voice fuse into one log, stacked against the
            calories you actually burned in the gym.
          </motion.p>

          <motion.div
            variants={fadeUpVariant}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {[
              { icon: Camera,              title: 'Snap to log',    copy: 'One tap — AI IDs the plate and portion in under a second' },
              { icon: Mic,                 title: 'Voice to refine', copy: 'Hold the mic — narrate ingredients, method, restaurant, tweaks', highlight: true },
              { icon: List,                title: 'Meals memory',   copy: 'Re-log yesterday\u2019s lunch or your go-to shake in one tap' },
              { icon: Heart,               title: 'HR + digestion', copy: 'Live gastric + cardiac signal tightens accuracy further' },
            ].map((f) => (
              <div
                key={f.title}
                className={`dmd-convex rounded-2xl p-4 hover:-translate-y-1 transition-all duration-300 flex items-start gap-3 ${
                  f.highlight ? 'relative overflow-hidden' : ''
                }`}
              >
                {f.highlight && (
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)' }}
                  />
                )}
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 relative">
                  <f.icon size={16} className="text-accent-green" />
                </div>
                <div className="min-w-0 relative">
                  <h4 className="text-foreground font-semibold text-[0.9375rem] leading-tight flex items-center gap-1.5">
                    {f.title}
                    {f.highlight && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-accent-green px-1.5 py-0.5 rounded-full bg-accent-green/10">
                        Signature
                      </span>
                    )}
                  </h4>
                  <p className="text-muted-foreground text-xs mt-1 leading-snug">{f.copy}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Voice unlock callout */}
          <motion.div
            variants={fadeUpVariant}
            className="mt-6 dmd-convex rounded-[24px] p-6 relative overflow-hidden"
            style={{ borderColor: 'hsl(var(--primary) / 0.35)' }}
          >
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.2), transparent 70%)' }}
            />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Wand2 size={18} className="text-accent-green" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent-green mb-1">
                  Why voice changes everything
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Cameras read what they see. They can&apos;t see that the rice is gone, that it
                  was fried in butter, or that this is a 6 oz pour — not a 12. Held-mic voice input
                  narrates the details every other app asks you to search, tag, or guess. That&apos;s
                  the difference between an approximation and knowing your true energy balance.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ────── Right: plate-slide Fuel animation (self-contained embed) ────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: EASING.smooth }}
          className="flex-1 flex justify-center w-full"
        >
          {/* pointer-events: none — same scroll-trap fix as the tag
              section: the iframe would swallow wheel/touch and stall
              Lenis. It's a pure animation, so pass gestures through. */}
          {/* loading=eager: lazy fired the iframe's fetch/parse/layout
              exactly as you scrolled onto the section — a visible hitch.
              Load it up-front instead (tiny static page; its rAF loop
              self-pauses while off-screen). svh instead of vh so the
              mobile URL-bar collapse can't resize the iframe mid-scroll. */}
          <iframe
            src="/fuel/index.html"
            title="RYZN Fuel snap-to-log animation"
            scrolling="no"
            loading="eager"
            tabIndex={-1}
            className="block border-0 w-full max-w-[420px] pointer-events-none"
            style={{ height: 'clamp(640px, 82svh, 780px)', background: 'transparent' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CalorieLoggingSection;
