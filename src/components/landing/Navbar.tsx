import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { EASING, DURATION } from '@/lib/animations';
import RyznWordLogo from '@/components/RyznWordLogo';
import RyznIconLogo from '@/components/RyznIconLogo';

const navLinks = ['Features', 'How It Works', 'Pricing', 'FAQ'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 backdrop-blur-[20px] backdrop-saturate-[180%] bg-[rgba(8,8,14,0.8)] border-b border-primary/[0.1]">
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
        <a href="#" className="flex items-center">
          <RyznWordLogo height={28} />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
              className="text-muted-foreground text-[0.875rem] font-medium tracking-wide hover:text-foreground transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 rounded-pill border border-primary/[0.15] text-muted-foreground text-sm font-medium hover:text-foreground hover:border-primary/40 transition-all duration-200">
            Log In
          </button>
          <button className="cta-primary px-5 py-2.5 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground text-sm font-semibold">
            <span className="shimmer" />
            <span className="relative z-10">Start Free Trial</span>
          </button>
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
            {navLinks.map((link, i) => (
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
            <div className="mb-4">
              <RyznIconLogo size={40} />
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-8 py-3 rounded-pill bg-gradient-to-r from-primary to-accent-green text-foreground font-semibold"
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
