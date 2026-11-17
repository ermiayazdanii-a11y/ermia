import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

interface LiquidPortalDividerProps {
  direction?: 'down' | 'up';
  topBgClass?: string;
  bottomBgClass?: string;
}

/**
 * Scroll-driven lightweight SVG liquid meniscus transition separating major
 * portfolio chapters without continuous shader loops or heavy WebGL canvases.
 */
export function LiquidPortalDivider({
  direction = 'down',
  topBgClass = 'bg-transparent',
  bottomBgClass = 'text-[var(--ermia-bg-secondary)]/70',
}: LiquidPortalDividerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const waveScaleY = useTransform(scrollYProgress, [0, 0.5, 1], [1.22, 0.72, 1.1]);
  const crestShiftX = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none relative h-12 w-full overflow-hidden sm:h-16 ${topBgClass}`}
    >
      {/* Subtle accent meniscus glow along the portal rim */}
      <motion.div
        style={prefersReducedMotion ? undefined : { x: crestShiftX }}
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--ermia-accent)]/30 to-transparent will-change-transform"
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                scaleY: waveScaleY,
                transformOrigin: direction === 'down' ? 'bottom' : 'top',
              }
        }
        className={`h-full w-full will-change-transform ${bottomBgClass}`}
      >
        <svg
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
          className="h-full w-full fill-current"
        >
          {direction === 'down' ? (
            <path d="M0,38 C280,68 540,4 760,34 C990,64 1230,10 1440,36 L1440,64 L0,64 Z" />
          ) : (
            <path d="M0,0 L1440,0 L1440,26 C1210,58 960,6 710,36 C470,64 220,12 0,34 Z" />
          )}
        </svg>
      </motion.div>
    </div>
  );
}
