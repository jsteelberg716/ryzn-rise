import { motion } from 'framer-motion';
import ArizonaALogo from '@/components/ArizonaALogo';

/**
 * Fixed top banner shown only on the /wildcats route.
 * Sits above the Navbar — Navbar shifts down to top-11 to make room.
 * Features the University of Arizona "A" logo on both sides of the text.
 */
const WildcatsBanner = () => {
  return (
    <motion.div
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="wildcats-banner-bg fixed top-0 left-0 right-0 z-[1002] h-11 flex items-center justify-center overflow-hidden"
    >
      {/* Subtle animated sheen */}
      <div className="wildcats-banner-sheen absolute inset-0 pointer-events-none" />

      <div className="relative flex items-center gap-3 sm:gap-4">
        <div className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          <ArizonaALogo height={24} />
        </div>
        <span className="font-extrabold text-[0.75rem] md:text-[0.875rem] tracking-[0.18em] uppercase whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          Free for Wildcats. Forever.
        </span>
        <div className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          <ArizonaALogo height={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default WildcatsBanner;
