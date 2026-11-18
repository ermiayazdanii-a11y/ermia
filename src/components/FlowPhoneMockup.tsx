import { useEffect, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { MOTION_EASE, SPRING_CONFIG, ThemeMode } from '../styles/designTokens';

export interface PhoneMockupScreen {
  id: string;
  src: string;
  webpSrc?: string;
  alt: string;
  caption?: string;
}

interface FlowPhoneMockupProps {
  screen: PhoneMockupScreen;
  theme?: ThemeMode;
  enable3DTilt?: boolean;
  priorityLoad?: boolean;
  size?: 'hero' | 'showcase' | 'compact';
  onInspect?: (triggerEl: HTMLButtonElement) => void;
  inspectAriaLabel?: string;
  className?: string;
}

export function FlowPhoneMockup({
  screen,
  theme = 'dark',
  enable3DTilt = true,
  priorityLoad = false,
  size = 'showcase',
  onInspect,
  inspectAriaLabel = 'Inspect full-resolution screenshot',
  className = '',
}: FlowPhoneMockupProps) {
  const prefersReducedMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [canHoverTilt, setCanHoverTilt] = useState(false);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(25);
  const sheenOpacity = useMotionValue(0);

  const rotateX = useSpring(rotateXRaw, SPRING_CONFIG.heroTilt);
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG.heroTilt);
  const smoothSheenOpacity = useSpring(
    sheenOpacity,
    SPRING_CONFIG.spotlightOpacity
  );

  const isDark = theme === 'dark';
  const glassSheen = useMotionTemplate`radial-gradient(280px circle at ${sheenX}% ${sheenY}%, ${
    isDark
      ? 'rgba(240, 241, 233, 0.14), transparent 70%'
      : 'rgba(255, 255, 255, 0.28), transparent 70%'
  })`;

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion || !enable3DTilt) {
      setCanHoverTilt(false);
      return;
    }
    const mq = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 768px)'
    );
    const sync = () => setCanHoverTilt(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [prefersReducedMotion, enable3DTilt]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHoverTilt || !frameRef.current) return;
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
      return;
    }
    const rect = frameRef.current.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    rotateYRaw.set((px - 0.5) * 11);
    rotateXRaw.set((0.5 - py) * 9);
    sheenX.set(px * 100);
    sheenY.set(py * 100);
    sheenOpacity.set(1);
  };

  const handlePointerLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
    sheenOpacity.set(0);
  };

  const widthClass =
    size === 'hero'
      ? 'w-[258px] sm:w-[292px] lg:w-[310px]'
      : size === 'compact'
        ? 'w-[228px] sm:w-[252px]'
        : 'w-[250px] sm:w-[280px] lg:w-[296px]';

  const screenContent = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={screen.id}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={
          prefersReducedMotion ? undefined : { opacity: 0, scale: 1.01 }
        }
        transition={{ duration: 0.28, ease: MOTION_EASE.cinematic }}
        className="h-full w-full"
      >
        <picture className="block h-full w-full">
          {screen.webpSrc && <source srcSet={screen.webpSrc} type="image/webp" />}
          <img
            src={screen.src}
            alt={screen.alt}
            loading={priorityLoad ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            className="block h-full w-full select-none object-contain bg-[#0c141d]"
          />
        </picture>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={canHoverTilt ? { perspective: 1100 } : undefined}
      className={`relative mx-auto select-none ${widthClass} ${className}`}
    >
      {/* Ambient radial stage halo (pure gradient falloff, no expensive blur filter) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 opacity-85"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 45%, rgba(var(--ermia-spotlight-rgb), 0.16) 0%, rgba(105, 198, 224, 0.08) 38%, transparent 72%)'
            : 'radial-gradient(ellipse at 50% 45%, rgba(var(--ermia-spotlight-rgb), 0.14) 0%, rgba(65, 125, 150, 0.07) 40%, transparent 72%)',
        }}
      />

      {/* Lightweight CSS 3D Phone Hardware Shell */}
      <motion.div
        style={
          canHoverTilt
            ? {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        className={`relative rounded-[42px] border p-[9px] transition-shadow duration-300 will-change-transform ${
          isDark
            ? 'border-white/15 bg-gradient-to-b from-[#23262c] via-[#131519] to-[#0b0d10] shadow-[0_36px_80px_-22px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.18)]'
            : 'border-black/15 bg-gradient-to-b from-[#30343d] via-[#1c1f24] to-[#121418] shadow-[0_32px_70px_-24px_rgba(18,22,16,0.42),inset_0_1px_0_rgba(255,255,255,0.22)]'
        }`}
      >
        {/* Subtle physical side buttons for realistic silhouette */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -end-[2px] top-24 h-12 w-[2.5px] rounded-e-full bg-white/15"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -end-[2px] top-40 h-16 w-[2.5px] rounded-e-full bg-white/15"
        />

        {/* Inner Display Glass matching exact 1080:2460 Android capture proportions */}
        <div className="relative aspect-[1080/2460] w-full overflow-hidden rounded-[33px] bg-[#0b121a] ring-1 ring-white/10">
          {/* Subtle top specular reflection hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          />

          {/* Interactive fine-pointer light reflection across glass */}
          {canHoverTilt && (
            <motion.div
              aria-hidden="true"
              style={{ background: glassSheen, opacity: smoothSheenOpacity }}
              className="pointer-events-none absolute inset-0 z-20"
            />
          )}

          {onInspect ? (
            <button
              type="button"
              onClick={(e) => onInspect(e.currentTarget)}
              aria-label={inspectAriaLabel}
              className="group relative block h-full w-full overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
            >
              {screenContent}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute end-3 top-10 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
            </button>
          ) : (
            <div className="relative h-full w-full overflow-hidden">
              {screenContent}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
