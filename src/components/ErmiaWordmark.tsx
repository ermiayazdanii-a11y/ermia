import { motion, useReducedMotion } from 'motion/react';
import { MOTION_EASE } from '../styles/designTokens';

interface ErmiaWordmarkProps {
  size?: 'sm' | 'lg';
  animateEntrance?: boolean;
}

export function ErmiaWordmark({
  size = 'sm',
  animateEntrance = false,
}: ErmiaWordmarkProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animateEntrance && !prefersReducedMotion;

  if (size === 'lg') {
    return (
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: MOTION_EASE.cinematic }}
        className="inline-flex items-center justify-center gap-3 select-none"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect
            x="1.25"
            y="1.25"
            width="33.5"
            height="33.5"
            rx="9"
            stroke="var(--ermia-accent)"
            strokeOpacity="0.65"
            strokeWidth="1.25"
          />
          <motion.path
            d="M11 12H25M11 18H21M11 24H25"
            stroke="var(--ermia-text)"
            strokeWidth="1.85"
            strokeLinecap="round"
            initial={shouldAnimate ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.72,
              delay: 0.12,
              ease: MOTION_EASE.cinematic,
            }}
          />
          <motion.circle
            cx="24.5"
            cy="18"
            r="1.9"
            fill="var(--ermia-accent)"
            initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.45,
              ease: MOTION_EASE.cinematic,
            }}
          />
        </svg>
        <span className="font-display text-2xl font-semibold tracking-[0.26em] text-[var(--ermia-text)] sm:text-3xl">
          ERMIA
        </span>
      </motion.div>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width="20"
        height="20"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="33"
          rx="9"
          stroke="var(--ermia-accent)"
          strokeOpacity="0.65"
          strokeWidth="1.5"
        />
        <path
          d="M11 12H25M11 18H21M11 24H25"
          stroke="var(--ermia-text)"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle cx="24.5" cy="18" r="2" fill="var(--ermia-accent)" />
      </svg>
      <span className="font-display text-sm font-semibold tracking-[0.2em] text-[var(--ermia-text)]">
        ERMIA
      </span>
    </span>
  );
}
