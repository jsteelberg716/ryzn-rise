import { useLocation } from 'react-router-dom';

/**
 * Returns true when the visitor is on the Wildcats-exclusive landing
 * (/wildcats). Used to swap CTA text, pricing, and banner copy so
 * students scanning the gym QR code see "Free for Wildcats. Forever."
 */
export const useIsWildcats = () => {
  const { pathname } = useLocation();
  return pathname === '/wildcats' || pathname.startsWith('/wildcats/');
};
