import { useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { SPRING_CONFIG, ThemeMode } from '../styles/designTokens';

interface CursorSpotlightProps {
  theme: ThemeMode;
}

export function CursorSpotlight({ theme }: CursorSpotlightProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Raw pointer motion values (never cause React re-renders)
  const pointerX = useMotionValue(-640);
  const pointerY = useMotionValue(-640);
  const targetOpacity = useMotionValue(0);

  // Smooth spring interpolation for controlled trailing inertia
  const smoothX = useSpring(pointerX, SPRING_CONFIG.spotlight);
  const smoothY = useSpring(pointerY, SPRING_CONFIG.spotlight);
  const smoothOpacity = useSpring(
    targetOpacity,
    SPRING_CONFIG.spotlightOpacity
  );

  const isDark = theme === 'dark';
  const spotlightBackground = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, ${
    isDark
      ? 'rgba(216, 241, 90, 0.14) 0%, rgba(216, 241, 90, 0.05) 34%, rgba(137, 145, 123, 0.018) 58%, transparent 76%'
      : 'rgba(83, 106, 0, 0.1) 0%, rgba(83, 106, 0, 0.035) 36%, transparent 74%'
  })`;

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setIsFinePointer(false);
      return;
    }

    const pointerQuery = window.matchMedia('(pointer: fine)');
    const updatePointerCapability = () => {
      setIsFinePointer(pointerQuery.matches);
    };
    updatePointerCapability();
    pointerQuery.addEventListener('change', updatePointerCapability);

    return () => {
      pointerQuery.removeEventListener('change', updatePointerCapability);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isFinePointer || prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        return;
      }
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
      targetOpacity.set(1);
    };

    const handleMouseLeave = () => {
      targetOpacity.set(0);
    };

    const handleBlur = () => {
      targetOpacity.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isFinePointer, prefersReducedMotion, pointerX, pointerY, targetOpacity]);

  // Touch device / reduced-motion static ambient lighting fallback
  if (!isFinePointer || prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background: isDark
            ? 'radial-gradient(620px circle at 50% 22%, rgba(216, 241, 90, 0.085), rgba(137, 145, 123, 0.025) 45%, transparent 75%)'
            : 'radial-gradient(620px circle at 50% 22%, rgba(83, 106, 0, 0.07), transparent 75%)',
        }}
      />
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        background: spotlightBackground,
        opacity: smoothOpacity,
      }}
    />
  );
}
