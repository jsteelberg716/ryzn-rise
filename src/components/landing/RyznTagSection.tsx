import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

/// Desktop landing section that mirrors the mobile /scan experience.
/// Replaces the "Your program. Your schedule. Your rules." (WorkoutPrograms)
/// section in the main scroll — surfaces the NFC tap-to-lift flow to
/// desktop visitors who'd otherwise never see it (mobile users hit the
/// dedicated /scan landing via Instagram links or direct tag taps).
///
/// The animation iframes /scan/v1/?embed=1 — that query flag activates
/// the page's embed mode (hides nav, footer, the post-hero CTA, and all
/// non-hero sections) so only the phone-taps-puck-sheet-rise animation
/// shows. Single source of truth for the animation itself.
const RyznTagSection = () => {
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

      {/* Full-width animation panel. iframe is sized to the natural
          height the embed needs (eyebrow + heading + stage) so the
          phone animation reads at desktop scale. */}
      <motion.div
        className="max-w-[1200px] mx-auto mt-10 lg:mt-14 px-6"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <iframe
          src="/scan/v1/?embed=1"
          title="RYZN tag scan animation"
          scrolling="no"
          loading="lazy"
          className="block w-full border-0"
          style={{ height: 'clamp(560px, 70vh, 800px)' }}
        />
      </motion.div>

      <motion.div
        className="max-w-[1200px] mx-auto mt-10 px-6 text-center"
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="visible"
      >
        <a
          href="/scan"
          className="dmd-convex inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          See the full demo
          <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </section>
  );
};

export default RyznTagSection;
