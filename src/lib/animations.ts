export const EASING = {
  smooth: [0.16, 1, 0.3, 1] as const,
  easeOut: [0.0, 0.0, 0.2, 1.0] as const,
  easeInOut: [0.4, 0.0, 0.2, 1.0] as const,
  overshoot: [0.34, 1.56, 0.64, 1] as const,
}

export const SPRING = {
  default: { type: 'spring' as const, stiffness: 280, damping: 22 },
  bounce: { type: 'spring' as const, stiffness: 400, damping: 15 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
}

export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  medium: 0.5,
  slow: 0.7,
  verySlow: 1.2,
  dramatic: 1.8,
}

export const STAGGER = {
  tight: 0.05,
  normal: 0.08,
  loose: 0.12,
  dramatic: 0.2,
}

// Reusable animation variants
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASING.smooth, delay },
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.normal,
      delayChildren: 0.2,
    },
  },
}

export const wordReveal = {
  hidden: {
    opacity: 0,
    y: 40,
    clipPath: 'inset(100% 0% 0% 0%)',
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: DURATION.medium,
      ease: EASING.smooth,
    },
  },
}
