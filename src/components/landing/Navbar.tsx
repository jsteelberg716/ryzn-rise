import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { EASING, DURATION } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import RyznIconLogo from '@/components/RyznIconLogo';
import { useIsWildcats } from '@/hooks/useIsWildcats';

// Hash-anchor links jump to in-page sections; route links navigate to
// dedicated pages. Reviews lives on its own page so it can host the
// live-from-Supabase grid + realtime subscription without bloating
// the homepage.
const hashLinks = ['Features', 'How It Works', 'Pricing', 'FAQ'];
// Order matters — sits left-to-right in the rendered nav. Scan
// goes between the hash anchors and Reviews so users discover the
// RyznTag info page in the obvious "see what else this product
// has" path. Reviews stays anchored far-right per Jack's spec.
// `external: true` means the destination is a static file served by
// Vercel (e.g. public/scan/index.html), not a React Router route.
// React Router would otherwise client-side-navigate to /scan, miss
// the route table, and render NotFound (404). Use a plain anchor so
// the browser does a full page load and hits the static file.
const routeLinks = [
  { label: 'Scan',        to: '/scan/',   external: true },
  { label: 'For Coaches', to: '/coaches', external: false },
  { label: 'Reviews',     to: '/reviews', external: false },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isWildcats = useIsWildcats();

  // The nav bar CONTENTS are always visible. At the very top of the page
  // the container is transparent (no glass, no border) so only the logo,
  // links + CTA float over the hero. Once the visitor scrolls past the
  // fold, the glass fill + border + shadow fade in, condensing it into
  // the floating pill. Passive listener; primed on mount for deep links.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-[1000] flex justify-center px-4 transition-all duration-500 ease-out ${
        isWildcats ? 'top-[52px]' : 'top-3'
      }`}
    >
      <div
        className={`w-full max-w-[1080px] h-14 rounded-full flex items-center justify-between pl-6 pr-3 transition-all duration-500 ease-out ${
          scrolled
            ? 'backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.72)] border border-primary/[0.12] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border border-transparent shadow-none'
        }`}
      >
        <a href="#" className="flex items-center">
          <RyznWordLogo height={28} />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {hashLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="text-muted-foreground text-[0.875rem] font-medium tracking-wide hover:text-foreground transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link}
            </a>
          ))}
          {routeLinks.map((link) => {
            const className = "text-muted-foreground text-[0.875rem] font-medium tracking-wide hover:text-foreground transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full";
            return link.external ? (
              <a key={link.label} href={link.to} className={className}>{link.label}</a>
            ) : (
              <Link key={link.label} to={link.to} className={className}>{link.label}</Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={isWildcats ? '#pricing' : 'https://apps.apple.com/us/app/ryzn/id6761982333'}
            {...(isWildcats ? {} : { target: '_blank', rel: 'noopener' })}
            className="cta-primary px-5 py-2.5 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground text-sm font-semibold"
          >
            {isWildcats ? 'Claim Free Account' : 'Get RYZN'}
          </a>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal }}
            className="fixed inset-0 z-[1001] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            <button className="absolute top-5 right-6 text-foreground" onClick={() => setMobileOpen(false)}>
              <X size={28} />
            </button>
            {hashLinks.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, ease: EASING.smooth }}
                className="text-2xl font-semibold text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </motion.a>
            ))}
            {routeLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: (hashLinks.length + i) * 0.1,
                  ease: EASING.smooth,
                }}
              >
                {link.external ? (
                  <a
                    href={link.to}
                    className="text-2xl font-semibold text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.to}
                    className="text-2xl font-semibold text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
            <div className="mb-4">
              <RyznIconLogo size={40} />
            </div>
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              href={isWildcats ? '#pricing' : 'https://apps.apple.com/us/app/ryzn/id6761982333'}
              {...(isWildcats ? {} : { target: '_blank', rel: 'noopener' })}
              onClick={() => setMobileOpen(false)}
              className="mt-4 px-8 py-3 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground font-semibold"
            >
              {isWildcats ? 'Claim Free Account' : 'Get RYZN'}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
