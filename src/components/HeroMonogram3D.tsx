import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import {
  MOTION_EASE,
  SPRING_CONFIG,
  ThemeMode,
} from '../styles/designTokens';

interface HeroMonogram3DProps {
  theme: ThemeMode;
  ariaLabel: string;
}

export function HeroMonogram3D({ theme, ariaLabel }: HeroMonogram3DProps) {
  const stageRef = useRef<HTMLButtonElement | null>(null);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [tiltState, setTiltState] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const rawRotateX = useMotionValue(8);
  const rawRotateY = useMotionValue(-12);
  const rawGlintX = useMotionValue(35);
  const rawGlintY = useMotionValue(25);

  const rotateX = useSpring(rawRotateX, SPRING_CONFIG.monogram3d);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG.monogram3d);
  const glintX = useSpring(rawGlintX, SPRING_CONFIG.spotlight);
  const glintY = useSpring(rawGlintY, SPRING_CONFIG.spotlight);

  const isDark = theme === 'dark';
  const glassSheen = useMotionTemplate`radial-gradient(circle at ${glintX}% ${glintY}%, ${
    isDark
      ? 'rgba(216, 241, 90, 0.34) 0%, rgba(240, 241, 233, 0.14) 40%, transparent 72%'
      : 'rgba(255, 255, 255, 0.92) 0%, rgba(83, 106, 0, 0.16) 44%, transparent 74%'
  })`;

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setIsFinePointer(false);
      return;
    }
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setIsFinePointer(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [prefersReducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (
      !isFinePointer ||
      prefersReducedMotion ||
      (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
    ) {
      return;
    }
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawRotateY.set(Math.max(-1, Math.min(1, nx)) * 20);
    rawRotateX.set(Math.max(-1, Math.min(1, -ny)) * 18);
    rawGlintX.set(50 + nx * 36);
    rawGlintY.set(50 + ny * 36);
  };

  const handlePointerLeave = () => {
    rawRotateX.set(8);
    rawRotateY.set(-12);
    rawGlintX.set(35);
    rawGlintY.set(25);
  };

  // Tactile tap/keyboard 3D inspection impulse (works cleanly on mobile touch & keyboard)
  const handleInspect = () => {
    if (prefersReducedMotion) return;
    const nextAngle = tiltState % 2 === 0 ? 22 : -20;
    setTiltState((prev) => prev + 1);
    animate(rawRotateY, [nextAngle, -nextAngle * 0.45, -12], {
      duration: 0.68,
      ease: MOTION_EASE.cinematic,
    });
    animate(rawRotateX, [16, -6, 8], {
      duration: 0.68,
      ease: MOTION_EASE.cinematic,
    });
  };

  return (
    <motion.button
      ref={stageRef}
      type="button"
      onClick={handleInspect}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={ariaLabel}
      initial={
        prefersReducedMotion ? false : { opacity: 0, scale: 0.88, y: 10 }
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      transition={{ duration: 0.65, delay: 0.22, ease: MOTION_EASE.cinematic }}
      className="perspective-stage group/prism relative flex h-16 w-16 items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] sm:h-22 sm:w-22 cursor-pointer"
    >
      {/* Subtle ambient backlight halo behind the 3D artifact (no CSS blur filter) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-10 rounded-full opacity-80 transition-opacity duration-300 group-hover/prism:opacity-100"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--ermia-spotlight-rgb), 0.24) 0%, rgba(var(--ermia-spotlight-rgb), 0.06) 45%, transparent 72%)',
        }}
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
              }
        }
        className="preserve-3d relative h-full w-full will-change-transform"
      >
        {/* Depth Plane -1: Deep Extruded Rim Edge */}
        <div
          aria-hidden="true"
          style={{ transform: 'translateZ(-6px)' }}
          className="absolute inset-0 rounded-2xl border border-[var(--ermia-accent)]/25 bg-[var(--ermia-bg)]/80"
        />

        {/* Depth Plane 0: Anodized Chrome / Obsidian Backing Prism */}
        <div
          aria-hidden="true"
          style={{ transform: 'translateZ(0px)' }}
          className="absolute inset-0 rounded-2xl border border-[var(--ermia-border-strong)] shadow-[0_18px_36px_-14px_rgba(0,0,0,0.65)]"
        >
          <div
            className="h-full w-full rounded-2xl"
            style={{
              background:
                'linear-gradient(145deg, var(--ermia-chrome-start) 0%, var(--ermia-chrome-mid) 52%, var(--ermia-chrome-end) 100%)',
            }}
          />
        </div>

        {/* Depth Plane 1: Translucent Liquid Glass Refractive Slab */}
        <div
          aria-hidden="true"
          style={{ transform: 'translateZ(12px)' }}
          className="absolute inset-1 rounded-[12px] border border-[var(--ermia-glass-edge)] backdrop-blur-md"
        >
          <motion.div
            className="h-full w-full rounded-[11px]"
            style={{ background: glassSheen }}
          />
        </div>

        {/* Depth Plane 2: Floating Brushed Chrome & Accent E Monogram */}
        <div
          aria-hidden="true"
          style={{ transform: 'translateZ(24px)' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 44 44"
            fill="none"
            className="h-9 w-9 sm:h-10 sm:w-10 drop-shadow-[0_6px_14px_rgba(0,0,0,0.34)]"
          >
            <path
              d="M13 13H31M13 22H25M13 31H31"
              stroke="var(--ermia-text)"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle cx="30.5" cy="22" r="2.6" fill="var(--ermia-accent)" />
          </svg>
        </div>
      </motion.div>
    </motion.button>
  );
}
