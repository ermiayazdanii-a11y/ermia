import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import {
  MOTION_EASE,
  MOTION_TIMING,
  PORTRAIT_IMAGE_PATH,
} from '../styles/designTokens';

interface HeroPortraitProps {
  src?: string;
  alt: string;
}

export function HeroPortrait({
  src = PORTRAIT_IMAGE_PATH,
  alt,
}: HeroPortraitProps) {
  const [imageMissing, setImageMissing] = useState(false);
  const [isFineDesktop, setIsFineDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const parallaxX = useSpring(rawX, { stiffness: 120, damping: 24 });
  const parallaxY = useSpring(rawY, { stiffness: 120, damping: 24 });

  useEffect(() => {
    setImageMissing(false);
  }, [src]);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setIsFineDesktop(false);
      return;
    }
    const pointerQuery = window.matchMedia('(pointer: fine) and (min-width: 768px)');
    const update = () => setIsFineDesktop(pointerQuery.matches);
    update();
    pointerQuery.addEventListener('change', update);
    return () => pointerQuery.removeEventListener('change', update);
  }, [prefersReducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isFineDesktop || prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    rawX.set(Math.max(-1, Math.min(1, normX)) * -6);
    rawY.set(Math.max(-1, Math.min(1, normY)) * -5);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto flex w-full max-w-[270px] items-center justify-center sm:max-w-[310px] lg:max-w-[340px]"
    >
      {/* Subtle dual-theme atmospheric accent aura behind the portrait */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 top-4 bottom-6 -z-10 rounded-full opacity-90 blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse at 50% 44%, rgba(var(--ermia-spotlight-rgb), 0.22) 0%, rgba(var(--ermia-spotlight-rgb), 0.06) 46%, transparent 74%)',
        }}
      />

      {/* Editorial vertical crop keeping Ermia's natural appearance and colors intact */}
      <motion.div
        initial={
          prefersReducedMotion
            ? false
            : {
                opacity: 0,
                scale: 1.045,
                clipPath: 'inset(10% 6% 14% 6% round 24px)',
                filter: 'blur(8px)',
              }
        }
        animate={{
          opacity: 1,
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0% round 24px)',
          filter: 'blur(0px)',
        }}
        transition={{
          duration: MOTION_TIMING.cinematic + 0.12,
          ease: MOTION_EASE.cinematic,
        }}
        style={
          isFineDesktop && !prefersReducedMotion
            ? { x: parallaxX, y: parallaxY }
            : undefined
        }
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] will-change-transform"
      >
        {!imageMissing ? (
          <img
            src={src}
            alt={alt}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImageMissing(true)}
            className="h-full w-full object-cover object-[50%_38%]"
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="flex h-full w-full flex-col items-center justify-center bg-[var(--ermia-bg-secondary)] p-6 text-center"
          >
            <span className="font-display text-lg font-semibold tracking-[0.2em] text-[var(--ermia-text)]">
              ERMIA
            </span>
          </div>
        )}

        {/* Delicate bottom edge fade leaving the entire face & hair accessories unobstructed */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[var(--ermia-bg)]/85 via-[var(--ermia-bg)]/25 to-transparent"
        />
      </motion.div>
    </div>
  );
}
