import { Link } from 'react-router-dom';
import RyznWordLogo from '@/components/RyznWordLogo';

const footerLinks = {
  Product: ['Features', 'Pricing', 'FAQ', 'Download'],
  Company: ['About', 'Contact', 'Privacy Policy', 'Terms of Service'],
};

const routeMap: Record<string, string> = {
  'Privacy Policy': '/privacy',
};

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-primary/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <RyznWordLogo height={24} />
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              The workout app that trains as hard as you do.
            </p>
            <div className="flex gap-4 mt-4">
              {['Instagram', 'TikTok', 'X'].map((s) => (
                <a key={s} href="#" className="text-muted-foreground/50 hover:text-foreground transition-colors text-xs font-medium uppercase tracking-wider">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-muted-foreground/50 text-xs font-medium tracking-widest uppercase mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    {routeMap[link] ? (
                      <Link to={routeMap[link]} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    ) : (
                      <a href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-muted-foreground/50 text-xs font-medium tracking-widest uppercase mb-4">Download</h4>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-bold text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
              </svg>
              App Store
            </a>
            <p className="text-muted-foreground/40 text-xs mt-2">iOS 15.0+ required</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary/[0.08] flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-muted-foreground/40 text-xs font-medium">© 2026 RYZN. All rights reserved.</p>
          <p className="text-muted-foreground/40 text-xs font-medium">Built for iPhone. Not ported to it.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
