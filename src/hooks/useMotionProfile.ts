import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface MotionProfile {
  prefersReducedMotion: boolean;
  isFineDesktop: boolean;
  isMidTierMobile: boolean;
  allowParallax: boolean;
  allow3DTilt: boolean;
  revealDurationMultiplier: number;
}

/**
 * Runtime motion profile respecting prefers-reduced-motion, pointer precision,
 * and mid-range Android / constrained mobile hardware budgets so desktop gets
 * full layered choreography while mid-tier phones stay locked near 60fps.
 */
export function useMotionProfile(): MotionProfile {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [capabilities, setCapabilities] = useState({
    isFineDesktop: false,
    isMidTierMobile: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const desktopMq = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 1024px)'
    );
    const coarseMq = window.matchMedia('(pointer: coarse)');

    const evaluate = () => {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isAndroid = /Android/i.test(ua);
      const cores =
        typeof navigator !== 'undefined' && navigator.hardwareConcurrency
          ? navigator.hardwareConcurrency
          : 8;
      const memory =
        typeof navigator !== 'undefined' &&
        'deviceMemory' in navigator &&
        typeof (navigator as Navigator & { deviceMemory?: number }).deviceMemory ===
          'number'
          ? ((navigator as Navigator & { deviceMemory?: number })
              .deviceMemory as number)
          : 8;

      const constrainedDevice =
        coarseMq.matches || isAndroid || cores <= 4 || memory <= 4;

      setCapabilities({
        isFineDesktop: desktopMq.matches,
        isMidTierMobile: !desktopMq.matches && constrainedDevice,
      });
    };

    evaluate();
    desktopMq.addEventListener('change', evaluate);
    coarseMq.addEventListener('change', evaluate);
    return () => {
      desktopMq.removeEventListener('change', evaluate);
      coarseMq.removeEventListener('change', evaluate);
    };
  }, []);

  return {
    prefersReducedMotion,
    isFineDesktop: !prefersReducedMotion && capabilities.isFineDesktop,
    isMidTierMobile: capabilities.isMidTierMobile,
    allowParallax: !prefersReducedMotion && !capabilities.isMidTierMobile,
    allow3DTilt: !prefersReducedMotion && capabilities.isFineDesktop,
    revealDurationMultiplier: capabilities.isMidTierMobile ? 0.78 : 1,
  };
}
