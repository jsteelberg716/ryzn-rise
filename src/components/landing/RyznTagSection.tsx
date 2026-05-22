import { motion } from 'framer-motion';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Nfc, ArrowDown, Repeat } from 'lucide-react';

/// Desktop landing section that mirrors the mobile /scan experience.
/// Replaces the "Your program. Your schedule. Your rules." (WorkoutPrograms)
/// section in the main scroll — surfaces the NFC tap-to-lift flow to
/// desktop visitors who'd otherwise never see it (mobile users hit the
/// dedicated /scan landing via Instagram links or direct tag taps).
///
/// Right column iframes /scan/v1/ so the polished phone-tap-tag-sheet-rise
/// animation is reused without duplication. The iframe is sized + clipped
/// to look like a phone-on-desk preview (~370×720) rather than a page
/// embed.
const RyznTagSection = () => {
  const beats = [
    { icon: Nfc, title: 'Tap', copy: 'Touch your phone to any RYZN tag on a machine, rack, or bench.' },
    { icon: ArrowDown, title: 'Lift', copy: 'The exercise opens instantly. Log sets, hit your weight, send it.' },
    { icon: Repeat, title: 'Repeat', copy: 'Tap the next tag for the next lift. No menus. No typing.' },
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
        className="max-w-[1200px] mx-auto mt-12 lg:mt-16 px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* LEFT — explanation beats */}
        <motion.div variants={fadeUpVariant} className="space-y-6 lg:space-y-8 max-w-[480px] mx-auto lg:mx-0">
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

          <div className="pt-4">
            <a
              href="/scan"
              className="dmd-convex inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              See the full demo
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>

        {/* RIGHT — embedded animation framed as a phone preview */}
        <motion.div
          variants={fadeUpVariant}
          className="flex justify-center lg:justify-end"
        >
          <div
            className="relative rounded-[40px] overflow-hidden shadow-2xl"
            style={{
              width: 'min(370px, 100%)',
              aspectRatio: '370 / 760',
              background: '#000',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5), 0 0 0 8px #111, 0 0 0 9px rgba(255,255,255,0.06)',
            }}
          >
            <iframe
              src="/scan/v1/"
              title="RYZN tag scan animation"
              scrolling="no"
              loading="lazy"
              className="block w-full h-full border-0"
              style={{ borderRadius: 'inherit' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RyznTagSection;
