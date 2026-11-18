import {
  MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { MOTION_EASE } from '../styles/designTokens';

const LETTERS = ['E', 'R', 'M', 'I', 'A'] as const;
const LETTER_SPREAD_OFFSETS = [-16, -7, 0, 7, 16] as const;

interface KineticBrandTitleProps {
  className?: string;
  variant?: 'inline' | 'behindSubject';
  delay?: number;
  scrollProgress?: MotionValue<number>;
}

export function KineticBrandTitle({
  className = '',
  variant = 'inline',
  delay = 0.04,
  scrollProgress,
}: KineticBrandTitleProps) {
  const prefersReducedMotion = useReducedMotion();
  const isBehind = variant === 'behindSubject';
  const fallbackZero = useMotionValue(0);
  const activeScroll = scrollProgress ?? fallbackZero;

  // Scroll-synchronized subtle horizontal letter spread & vertical tension
  const spread0 = useTransform(
    activeScroll,
    [0, 1],
    [0, LETTER_SPREAD_OFFSETS[0]]
  );
  const spread1 = useTransform(
    activeScroll,
    [0, 1],
    [0, LETTER_SPREAD_OFFSETS[1]]
  );
  const spread2 = useTransform(
    activeScroll,
    [0, 1],
    [0, LETTER_SPREAD_OFFSETS[2]]
  );
  const spread3 = useTransform(
    activeScroll,
    [0, 1],
    [0, LETTER_SPREAD_OFFSETS[3]]
  );
  const spread4 = useTransform(
    activeScroll,
    [0, 1],
    [0, LETTER_SPREAD_OFFSETS[4]]
  );
  const letterScaleY = useTransform(activeScroll, [0, 1], [1, 0.94]);
  const spreads = [spread0, spread1, spread2, spread3, spread4];

  const containerClasses = isBehind
    ? `inline-flex items-baseline justify-center gap-[0.02em] sm:gap-[0.03em] select-none ${className}`
    : `inline-flex items-baseline gap-1 sm:gap-1.5 select-none ${className}`;

  const glyphClasses = isBehind
    ? 'inline-block font-display text-[clamp(3.55rem,20.2vw,11.75rem)] font-bold leading-[0.86] tracking-[0.03em] bg-gradient-to-b from-[var(--ermia-text)] via-[var(--ermia-text)] to-[var(--ermia-text-secondary)] bg-clip-text text-transparent drop-shadow-[0_14px_32px_rgba(0,0,0,0.22)]'
    : 'inline-block font-display text-[clamp(2.65rem,7.2vw,5.25rem)] font-bold leading-[0.94] tracking-[0.06em] text-[var(--ermia-text)] transition-colors duration-150';

  if (prefersReducedMotion) {
    return (
      <div
        dir="ltr"
        aria-label="ERMIA"
        className={`inline-flex items-baseline justify-center select-none ${className}`}
      >
        <span
          className={
            isBehind
              ? 'font-display text-[clamp(3.55rem,20.2vw,11.75rem)] font-bold leading-[0.86] tracking-[0.03em] text-[var(--ermia-text)]'
              : 'font-display text-5xl font-bold tracking-[0.18em] text-[var(--ermia-text)] sm:text-6xl lg:text-7xl'
          }
        >
          ERMIA
        </span>
      </div>
    );
  }

  return (
    <div dir="ltr" aria-label="ERMIA" className={containerClasses}>
      {LETTERS.map((char, idx) => (
        <motion.span
          key={char}
          aria-hidden="true"
          style={
            isBehind
              ? {
                  x: spreads[idx],
                  scaleY: letterScaleY,
                }
              : undefined
          }
          className={`inline-block overflow-hidden ${isBehind ? 'px-[0.015em] py-2' : 'py-1'}`}
        >
          <motion.span
            initial={{
              y: '108%',
              opacity: 0,
            }}
            animate={{
              y: '0%',
              opacity: 1,
            }}
            whileHover={
              isBehind
                ? undefined
                : {
                    y: -4,
                    color: 'var(--ermia-accent)',
                    transition: { duration: 0.18, ease: MOTION_EASE.cinematic },
                  }
            }
            transition={{
              duration: isBehind ? 0.78 : 0.7,
              delay: delay + idx * 0.055,
              ease: MOTION_EASE.cinematic,
            }}
            className={glyphClasses}
          >
            {char}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}
