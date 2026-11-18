import { useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { SPRING_CONFIG } from '../styles/designTokens';

export function AmbientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);

  const pointerX = useMotionValue(-600);
  const pointerY = useMotionValue(-600);
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const lensOpacity = useMotionValue(0);

  const smoothX = useSpring(pointerX, SPRING_CONFIG.spotlight);
  const smoothY = useSpring(pointerY, SPRING_CONFIG.spotlight);
  const smoothNormX = useSpring(normX, SPRING_CONFIG.heroTilt);
  const smoothNormY = useSpring(normY, SPRING_CONFIG.heroTilt);
  const smoothLensOpacity = useSpring(
    lensOpacity,
    SPRING_CONFIG.spotlightOpacity
  );

  // Restrained living displacement of the background coordinate lattice
  const { scrollYProgress } = useScroll();
  const scrollDriftY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const gridShiftX = useTransform(smoothNormX, [-1, 1], [-5, 5]);
  const gridShiftY = useTransform(smoothNormY, [-1, 1], [-5, 5]);

  const activeGridMask = useMotionTemplate`radial-gradient(320px circle at ${smoothX}px ${smoothY}px, black 0%, rgba(0,0,0,0.35) 45%, transparent 74%)`;

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

  useEffect(() => {
    if (!isFinePointer || prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        return;
      }
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      normX.set(nx);
      normY.set(ny);
      lensOpacity.set(1);
    };

    const handleLeave = () => {
      lensOpacity.set(0);
      normX.set(0);
      normY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);
    window.addEventListener('blur', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('blur', handleLeave);
    };
  }, [
    isFinePointer,
    prefersReducedMotion,
    pointerX,
    pointerY,
    normX,
    normY,
    lensOpacity,
  ]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base architectural coordinate hairline grid with gentle desktop pointer drift */}
      <motion.div
        className="absolute -inset-3"
        style={{
          x: isFinePointer && !prefersReducedMotion ? gridShiftX : 0,
          y: isFinePointer && !prefersReducedMotion ? gridShiftY : 0,
          translateY: !prefersReducedMotion ? scrollDriftY : 0,
          backgroundImage:
            'linear-gradient(to right, var(--ermia-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--ermia-grid-line) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 80% 65% at 50% 25%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 65% at 50% 25%, black 35%, transparent 100%)',
        }}
      />

      {/* Living Grid Accent Lens: illuminates grid intersections near fine desktop pointer */}
      {isFinePointer && !prefersReducedMotion && (
        <motion.div
          className="absolute -inset-3"
          style={{
            x: gridShiftX,
            y: gridShiftY,
            opacity: smoothLensOpacity,
            backgroundImage:
              'linear-gradient(to right, rgba(var(--ermia-spotlight-rgb), 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--ermia-spotlight-rgb), 0.14) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: activeGridMask,
            WebkitMaskImage: activeGridMask,
          }}
        />
      )}

      {/* Upper subtle accent atmospheric canopy */}
      <div
        className="animate-ambient-a absolute -top-56 left-1/2 h-[640px] w-[960px] -translate-x-1/2 rounded-full opacity-75"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--ermia-spotlight-rgb), 0.08) 0%, rgba(var(--ermia-spotlight-rgb), 0.022) 44%, transparent 72%)',
        }}
      />

      {/* Lower secondary drift (desktop only) */}
      <div
        className="animate-ambient-b hidden md:block absolute -bottom-48 -left-36 h-[520px] w-[700px] rounded-full opacity-65"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--ermia-spotlight-rgb), 0.05) 0%, rgba(var(--ermia-spotlight-rgb), 0.015) 45%, transparent 74%)',
        }}
      />

      {/* Ultra-fine tactile grain overlay on desktop viewports only */}
      <div
        className="hidden md:block absolute inset-0 opacity-[0.02] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  );
}
