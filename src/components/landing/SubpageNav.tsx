import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import RyznWordLogo from '@/components/RyznWordLogo';

// Shared nav for the standalone subpages (Coaches, Reviews). Keeps the
// top bar CONSISTENT across every page so visitors can hop between Scan,
// For Coaches and Reviews from anywhere — the homepage sections are
// reached via /#hash anchors (full-load + scroll on the home route).
// `current` highlights the active page; `cta` swaps the right-hand button
// (App Store on Reviews, "Become a coach" mailto on Coaches).

const hashLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

type PageKey = 'coaches' | 'reviews' | 'scan';

const routeLinks: { label: string; to: string; external: boolean; key: PageKey }[] = [
  { label: 'Scan', to: '/scan/', external: true, key: 'scan' },
  { label: 'For Coaches', to: '/coaches', external: false, key: 'coaches' },
  { label: 'Reviews', to: '/reviews', external: false, key: 'reviews' },
];

interface SubpageNavProps {
  current?: PageKey;
  cta: { label: string; href: string; external?: boolean };
}

const linkClass =
  "text-muted-foreground text-[0.875rem] font-medium tracking-wide hover:text-foreground transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full";
const currentClass =
  "text-foreground text-[0.875rem] font-semibold tracking-wide relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary";

const SubpageNav = ({ current, cta }: SubpageNavProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-3 left-0 right-0 z-[1000] flex justify-center px-4">
      <div className="w-full max-w-[1080px] h-14 rounded-full flex items-center justify-between pl-6 pr-3 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.72)] border border-primary/[0.12] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)]">
        <Link to="/" className="flex items-center">
          <RyznWordLogo height={28} />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {hashLinks.map((link) => (
            <a key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
          {routeLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.to}
                className={current === link.key ? currentClass : linkClass}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={current === link.key ? currentClass : linkClass}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:flex items-center">
          <a
            href={cta.href}
            {...(cta.external ? { target: '_blank', rel: 'noopener' } : {})}
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-primary to-accent-green text-foreground cta-primary transition-all duration-300"
          >
            {cta.label}
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[1001] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-7"
          >
            <button
              className="absolute top-5 right-6 text-foreground"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            {hashLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-2xl font-semibold text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {routeLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="text-2xl font-semibold text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-2xl font-semibold text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href={cta.href}
              {...(cta.external ? { target: '_blank', rel: 'noopener' } : {})}
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent-green text-foreground font-semibold"
            >
              {cta.label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default SubpageNav;
