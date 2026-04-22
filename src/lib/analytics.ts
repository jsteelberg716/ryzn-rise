import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * RYZN Analytics — custom, free, self-hosted.
 *
 * - Fire-and-forget POST to /api/track on every route change.
 * - One anonymous visitor ID stored in localStorage.
 * - Skips localhost, the /analytics dashboard page, and prefetch bots.
 * - Dev mode logs instead of POSTing.
 */

const VISITOR_KEY = 'ryzn_vid';
const DEV = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id =
        (crypto as any)?.randomUUID?.() ??
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function deviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function screenBucket(): string {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 640) return '<640';
  if (w < 1024) return '640-1024';
  if (w < 1440) return '1024-1440';
  return '1440+';
}

let lastTrackedPath: string | null = null;

/** Extract ?ref= / ?utm_source= / ?src= from the current URL — sticky for the session. */
function readAndStoreSource(): string {
  if (typeof window === 'undefined') return '';
  try {
    const params = new URLSearchParams(window.location.search);
    const fresh =
      params.get('ref') ||
      params.get('src') ||
      params.get('utm_source') ||
      '';
    if (fresh) {
      sessionStorage.setItem('ryzn_source', fresh.toLowerCase().slice(0, 24));
      return fresh.toLowerCase().slice(0, 24);
    }
    return sessionStorage.getItem('ryzn_source') || '';
  } catch {
    return '';
  }
}

async function sendTrack(path: string) {
  if (typeof window === 'undefined') return;

  // Dedupe rapid fires
  if (lastTrackedPath === path) return;
  lastTrackedPath = path;

  // Skip the analytics dashboard itself so you don't inflate your own numbers
  if (path.startsWith('/analytics')) return;

  const payload = {
    path,
    referrer: document.referrer || '',
    source: readAndStoreSource(),
    visitorId: getVisitorId(),
    device: deviceType(),
    screen: screenBucket(),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
  };

  if (DEV) {
    // In dev, just log — no backend required to see it working
    // eslint-disable-next-line no-console
    console.log('[analytics] (dev)', payload);
    return;
  }

  try {
    const body = JSON.stringify(payload);
    // sendBeacon is best-effort but never delays navigation
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
      return;
    }
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    /* swallow — analytics must never break the page */
  }
}

/**
 * <AnalyticsTracker /> — mount once inside <BrowserRouter>.
 * Tracks every route change via React Router.
 */
export function AnalyticsTracker() {
  const location = useLocation();
  const mountedRef = useRef(false);

  useEffect(() => {
    // Fire on first mount too
    const path = location.pathname + (location.search || '');
    sendTrack(path);
    mountedRef.current = true;
  }, [location.pathname, location.search]);

  return null;
}

/** Manually fire a custom event (for CTA clicks, etc.) */
export function trackEvent(name: string) {
  void sendTrack(`/event/${encodeURIComponent(name)}`);
}
