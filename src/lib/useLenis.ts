import { useEffect } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  useEffect(() => {
    // Lenis applies a `transform: translate3d(...)` to the page content
    // to do smooth-scroll. That transform creates a CSS containing block,
    // which on touch devices makes `position: fixed` descendants pin to
    // the wrapper instead of the viewport — they scroll with the page
    // instead of staying anchored. (Symptom: chat bubble + Download FAB
    // drifting up as you scroll the mobile site.) Native iOS / Android
    // momentum is already buttery, so we just skip Lenis on touch.
    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
