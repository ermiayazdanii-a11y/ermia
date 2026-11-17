import { ReactNode, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { MOTION_EASE, SPRING_CONFIG, ThemeMode } from '../styles/designTokens';

interface InteractiveProjectCardProps {
  children: ReactNode;
  className?: string;
  enableTilt?: boolean;
  theme?: ThemeMode;
}

export function InteractiveProjectCard({
  children,
  className = '',
  enableTilt = true,
  theme,
}: InteractiveProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotOpacity = useMotionValue(0);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);

  const rotateX = useSpring(rotateXRaw, SPRING_CONFIG.cardTilt);
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG.cardTilt);
  const smoothSpotOpacity = useSpring(
    spotOpacity,
    SPRING_CONFIG.spotlightOpacity
  );

  const isLight =
    theme === 'light' ||
    (theme === undefined &&
      typeof document !== 'undefined' &&
      !document.documentElement.classList.contains('dark'));

  const radialHighlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, ${
    isLight
      ? 'rgba(83, 106, 0, 0.095), rgba(83, 106, 0, 0.025) 45%, transparent 72%'
      : 'rgba(216, 241, 90, 0.15), rgba(137, 145, 123, 0.045) 44%, transparent 72%'
  })`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      prefersReducedMotion ||
      (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
    ) {
      return;
    }
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX);
    mouseY.set(localY);
    spotOpacity.set(1);

    if (enableTilt) {
      const normalizedX = (localX / rect.width - 0.5) * 2;
      const normalizedY = (localY / rect.height - 0.5) * 2;
      rotateYRaw.set(normalizedX * 2.75);
      rotateXRaw.set(-normalizedY * 2.75);
    }
  };

  const handlePointerLeave = () => {
    spotOpacity.set(0);
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  return (
    <div
      style={
        enableTilt && !prefersReducedMotion ? { perspective: 1100 } : undefined
      }
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX: enableTilt ? rotateX : 0,
                rotateY: enableTilt ? rotateY : 0,
                transformStyle: 'preserve-3d',
              }
        }
        whileHover={prefersReducedMotion ? undefined : { y: -2 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.996 }}
        transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
        className={`group relative overflow-hidden rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)]/95 transition-colors duration-200 hover:border-[var(--ermia-accent)]/45 ${className}`}
      >
        {/* Subtle top inner glass specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[var(--ermia-glass-edge)] to-transparent"
        />

        {/* Cursor-reactive surface illumination */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: radialHighlight,
              opacity: smoothSpotOpacity,
            }}
          />
        )}

        <div className="relative z-20">{children}</div>
      </motion.div>
    </div>
  );
}
