import { ReactNode, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'motion/react';
import { useMotionProfile } from '../hooks/useMotionProfile';
import { MOTION_EASE, SPRING_CONFIG, ThemeMode } from '../styles/designTokens';

interface InteractiveProjectCardProps {
  children: ReactNode;
  className?: string;
  enableTilt?: boolean;
  tiltStrength?: 'subtle' | 'medium';
  theme?: ThemeMode;
}

export function InteractiveProjectCard({
  children,
  className = '',
  enableTilt = true,
  tiltStrength = 'medium',
  theme,
}: InteractiveProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion, isFineDesktop } = useMotionProfile();

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

  const radialHighlight = useMotionTemplate`radial-gradient(460px circle at ${mouseX}px ${mouseY}px, ${
    isLight
      ? 'rgba(83, 106, 0, 0.11), rgba(83, 106, 0, 0.03) 45%, transparent 72%'
      : 'rgba(216, 241, 90, 0.16), rgba(137, 145, 123, 0.045) 44%, transparent 72%'
  })`;

  const rimHighlight = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, ${
    isLight ? 'rgba(83, 106, 0, 0.42)' : 'rgba(216, 241, 90, 0.5)'
  }, transparent 72%)`;

  const maxDeg = tiltStrength === 'subtle' ? 1.65 : 3.4;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      !isFineDesktop ||
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
      rotateYRaw.set(normalizedX * maxDeg);
      rotateXRaw.set(-normalizedY * maxDeg);
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
        enableTilt && isFineDesktop && !prefersReducedMotion
          ? { perspective: 1200 }
          : undefined
      }
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={
          !isFineDesktop || prefersReducedMotion
            ? undefined
            : {
                rotateX: enableTilt ? rotateX : 0,
                rotateY: enableTilt ? rotateY : 0,
                transformStyle: 'preserve-3d',
              }
        }
        whileHover={
          isFineDesktop && !prefersReducedMotion ? { y: -2.5 } : undefined
        }
        whileTap={prefersReducedMotion ? undefined : { scale: 0.996 }}
        transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
        className={`group relative overflow-hidden rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)]/95 transition-colors duration-200 hover:border-[var(--ermia-accent)]/50 ${className}`}
      >
        {/* Subtle top inner glass specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[var(--ermia-glass-edge)] to-transparent"
        />

        {/* Cursor-reactive perimeter border glow on desktop */}
        {isFineDesktop && !prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl p-[1px]"
            style={{
              background: rimHighlight,
              opacity: smoothSpotOpacity,
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}

        {/* Cursor-reactive surface illumination */}
        {isFineDesktop && !prefersReducedMotion && (
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
