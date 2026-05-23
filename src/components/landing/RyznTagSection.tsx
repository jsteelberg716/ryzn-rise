import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Nfc, Dumbbell, Repeat } from 'lucide-react';

/// Desktop landing section that mirrors the mobile /scan experience.
/// Replaces the "Your program. Your schedule. Your rules." (WorkoutPrograms)
/// section in the main scroll — surfaces the NFC tap-to-lift flow to
/// desktop visitors who'd otherwise never see it.
///
/// Layout: the iframe spans the FULL container width on desktop,
/// and the explanation column is absolutely positioned on top of
/// its right ~42 % with `backdrop-filter: blur` — so the exiting
/// phone visually slides UNDER the text column (and the liquid-glass
/// blur only reads when there's something behind it). A subtle 1 px
/// left border on the text column gives the "harsh line" Jack asked
/// to keep.
///
/// On mobile, the layout collapses to a vertical stack — the iframe
/// stays full-width and the text column drops below it. The
/// backdrop-filter overlay only fires at lg+ breakpoints.
const RyznTagSection = () => {
  const beats = [
    {
      icon: Nfc,
      title: 'Tap',
      copy: 'Touch your phone to any RYZN tag on a machine, rack, or bench.',
    },
    {
      icon: Dumbbell,
      title: 'Lift',
      copy: 'The exercise opens instantly. Log sets, hit your weight, send it.',
    },
    {
      icon: Repeat,
      title: 'Repeat',
      copy: 'Tap the next tag for the next lift. No menus. No typing.',
    },
  ];

  return (
    <section className="relative bg-card pt-16 lg:pt-20 pb-20 lg:pb-28 section-glow section-inset">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.span
          variants={fadeUpVariant}
          className="dmd-concave inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-primary"
        >
          RYZN TAGS
        </motion.span>
        <motion.h2
          variants={fadeUpVariant}
          className="mt-4 font-bold tracking-tight text-foreground"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}
        >
          Tap the tag. <span className="gradient-text">Open the lift.</span>
        </motion.h2>
        <motion.p
          variants={fadeUpVariant}
          className="mt-4 text-muted-foreground mx-auto max-w-[640px] text-[1.0625rem]"
        >
          A tiny NFC sticker on every machine. Phone to puck — RYZN opens to
          the right exercise, set count and weight ready to go.
        </motion.p>
      </motion.div>

      <motion.div
        className="relative max-w-[1200px] mx-auto mt-12 lg:mt-16 px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Animation iframe — spans the full container width. The
            phone's exit translate(150%) carries it under the absolute
            text column overlay on the right ~42% of this area before
            it disappears past the iframe's right edge. */}
        <motion.div variants={fadeUpVariant} className="w-full">
          <iframe
            src="/scan/v1/?embed=1"
            title="RYZN tag scan animation"
            scrolling="no"
            loading="lazy"
            className="block w-full border-0"
            style={{ height: 'clamp(680px, 75vh, 880px)' }}
          />
        </motion.div>

        {/* Text column — overlays the right portion of the iframe at
            lg+. backdrop-filter blurs whatever sits behind it; nothing
            sits behind it most of the time (just the section bg-card),
            so the "liquid glass" effect is invisible — until the phone
            slides under during its exit animation, at which point the
            phone reads as a soft blurred shape behind the text. The
            1 px left border + faint left-side gradient creates the
            "harsh line" Jack asked to preserve.
            On mobile (< lg) this falls back to a normal stacked
            section below the iframe — no overlay, no backdrop blur. */}
        <motion.div
          variants={fadeUpVariant}
          className="
            mt-8 lg:mt-0 lg:absolute lg:top-0 lg:right-6 lg:bottom-0
            lg:w-[42%] lg:max-w-[480px]
            lg:flex lg:flex-col lg:justify-center
            lg:px-10 lg:py-10
            lg:backdrop-blur-lg lg:[backdrop-filter:blur(18px)_saturate(140%)]
            space-y-6 lg:space-y-7
          "
        >
          {beats.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-4">
              <div className="dmd-concave shrink-0 size-12 rounded-full flex items-center justify-center text-primary">
                <Icon className="size-5" strokeWidth={2.25} />
              </div>
              <div>
                <h3 className="text-foreground font-semibold text-lg">{title}.</h3>
                <p className="text-muted-foreground text-[0.9375rem] mt-1 leading-relaxed">
                  {copy}
                </p>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <a
              href="/scan"
              className="dmd-convex inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              See the full demo
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RyznTagSection;
