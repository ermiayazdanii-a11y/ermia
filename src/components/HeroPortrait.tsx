import { useEffect, useRef, useState } from 'react';
import {
  animate,
  MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  MOTION_EASE,
  MOTION_TIMING,
  PORTRAIT_CUTOUT_FALLBACK_PATH,
  PORTRAIT_CUTOUT_PATH,
  PORTRAIT_IMAGE_PATH,
  SPRING_CONFIG,
  ThemeMode,
} from '../styles/designTokens';
import { HeroMonogram3D } from './HeroMonogram3D';
import { KineticBrandTitle } from './KineticBrandTitle';

interface HeroPortraitProps {
  cutoutSrc?: string;
  cutoutFallbackSrc?: string;
  src?: string;
  alt: string;
  theme?: ThemeMode;
  monogramAriaLabel?: string;
  scrollProgress?: MotionValue<number>;
}

export function HeroPortrait({
  cutoutSrc = PORTRAIT_CUTOUT_PATH,
  cutoutFallbackSrc = PORTRAIT_CUTOUT_FALLBACK_PATH,
  src = PORTRAIT_IMAGE_PATH,
  alt,
  theme = 'dark',
  monogramAriaLabel = 'Interactive 3D ERMIA monogram — click or tap to tilt',
  scrollProgress,
}: HeroPortraitProps) {
  const [fallbackStep, setFallbackStep] = useState<0 | 1 | 2 | 3>(0);
  const [isFineDesktop, setIsFineDesktop] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const fallbackZero = useMotionValue(0);
  const activeScroll = scrollProgress ?? fallbackZero;

  // Synchronized scroll depth separation: background text drifts slightly down while foreground subject lifts
  const textScrollY = useTransform(activeScroll, [0, 1], [0, 30]);
  const subjectScrollY = useTransform(activeScroll, [0, 1], [0, -18]);
  const haloScrollScale = useTransform(activeScroll, [0, 1], [1, 1.09]);
  const stageRotateXScroll = useTransform(activeScroll, [0, 1], [0, 2.2]);

  // Pointer-reactive multi-plane 3D parallax rig (fine desktop) + mobile tap impulse
  const rawNormX = useMotionValue(0);
  const rawNormY = useMotionValue(0);
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(32);
  const sheenOpacity = useMotionValue(0);
  const tapScale = useMotionValue(1);

  const smoothNormX = useSpring(rawNormX, SPRING_CONFIG.heroTilt);
  const smoothNormY = useSpring(rawNormY, SPRING_CONFIG.heroTilt);
  const smoothSheenOpacity = useSpring(
    sheenOpacity,
    SPRING_CONFIG.spotlightOpacity
  );
  const smoothTapScale = useSpring(tapScale, SPRING_CONFIG.magnetic);

  const haloX = useTransform(smoothNormX, [-1, 1], [6, -6]);
  const haloY = useTransform(smoothNormY, [-1, 1], [5, -5]);

  const textX = useTransform(smoothNormX, [-1, 1], [13, -13]);
  const textY = useTransform(smoothNormY, [-1, 1], [7, -7]);
  const textRotateY = useTransform(smoothNormX, [-1, 1], [-2.5, 2.5]);
  const textRotateX = useTransform(smoothNormY, [-1, 1], [2.2, -2.2]);

  const fgX = useTransform(smoothNormX, [-1, 1], [-15, 15]);
  const fgY = useTransform(smoothNormY, [-1, 1], [-9, 9]);
  const fgRotateY = useTransform(smoothNormX, [-1, 1], [-5.2, 5.2]);
  const fgRotateX = useTransform(smoothNormY, [-1, 1], [4.5, -4.5]);

  const sheenBackground = useMotionTemplate`radial-gradient(380px circle at ${sheenX}% ${sheenY}%, rgba(var(--ermia-spotlight-rgb), 0.14), rgba(245, 166, 35, 0.08) 42%, transparent 72%)`;

  useEffect(() => {
    setFallbackStep(0);
  }, [cutoutSrc, cutoutFallbackSrc, src]);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setIsFineDesktop(false);
      return;
    }
    const pointerQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 768px)'
    );
    const update = () => setIsFineDesktop(pointerQuery.matches);
    update();
    pointerQuery.addEventListener('change', update);
    return () => pointerQuery.removeEventListener('change', update);
  }, [prefersReducedMotion]);

  const activeImageSrc =
    fallbackStep === 0
      ? cutoutSrc
      : fallbackStep === 1
        ? cutoutFallbackSrc
        : src;
  const isTransparentCutout = fallbackStep < 2;

  const handleImageError = () => {
    setFallbackStep((prev) => (prev < 3 ? ((prev + 1) as 0 | 1 | 2 | 3) : 3));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      !isFineDesktop ||
      prefersReducedMotion ||
      (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
    ) {
      return;
    }
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normX = Math.max(
      -1,
      Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2))
    );
    const normY = Math.max(
      -1,
      Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2))
    );
    rawNormX.set(normX);
    rawNormY.set(normY);
    sheenX.set(((e.clientX - rect.left) / rect.width) * 100);
    sheenY.set(((e.clientY - rect.top) / rect.height) * 100);
    sheenOpacity.set(1);
  };

  const handlePointerLeave = () => {
    rawNormX.set(0);
    rawNormY.set(0);
    sheenOpacity.set(0);
  };

  // Tactile mobile tap impulse giving responsive 3D depth without pointer overhead
  const handleStageTap = () => {
    if (isFineDesktop || prefersReducedMotion) return;
    animate(tapScale, [1, 1.028, 1], {
      duration: 0.44,
      ease: MOTION_EASE.cinematic,
    });
    animate(rawNormY, [0, -0.3, 0], {
      duration: 0.44,
      ease: MOTION_EASE.cinematic,
    });
  };

  const isDark = theme === 'dark';

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleStageTap}
      className="perspective-stage relative mx-auto flex h-[232px] w-full max-w-4xl items-end justify-center overflow-visible border-b border-[var(--ermia-border)] px-2 sm:h-[312px] lg:h-[372px]"
    >
      {/* Layer 0: Architectural Frame Backplate & Photographic Studio Lighting */}
      <motion.div
        aria-hidden="true"
        style={
          prefersReducedMotion
            ? undefined
            : {
                x: isFineDesktop ? haloX : 0,
                y: isFineDesktop ? haloY : 0,
                scale: haloScrollScale,
                z: isFineDesktop ? -42 : 0,
              }
        }
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.78, ease: MOTION_EASE.cinematic }}
        className="pointer-events-none absolute inset-x-3 top-2 bottom-0 -z-10 overflow-hidden rounded-t-[28px] border-x border-t border-[var(--ermia-border)]/75 sm:inset-x-8"
      >
        {/* Top glass specular hairline */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ermia-glass-edge)] to-transparent" />

        {/* Subtle studio vignette surface */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 74% 80% at 50% 42%, rgba(23, 27, 22, 0.82) 0%, rgba(9, 12, 9, 0.24) 66%, transparent 100%)'
              : 'radial-gradient(ellipse 74% 80% at 50% 42%, rgba(255, 255, 255, 0.86) 0%, rgba(234, 237, 223, 0.3) 66%, transparent 100%)',
          }}
        />

        {/* Soft multi-stop studio rim light (pure radial gradient falloff, no CSS filter blur) */}
        <div
          className="animate-ambient-a absolute left-1/2 top-[10%] h-[230px] w-[280px] -translate-x-1/2 rounded-full opacity-90 sm:h-[310px] sm:w-[400px]"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 56% 36%, rgba(245, 166, 35, 0.14) 0%, rgba(var(--ermia-spotlight-rgb), 0.16) 36%, rgba(var(--ermia-spotlight-rgb), 0.04) 58%, transparent 76%)'
              : 'radial-gradient(circle at 56% 36%, rgba(245, 166, 35, 0.11) 0%, rgba(var(--ermia-spotlight-rgb), 0.12) 38%, rgba(var(--ermia-spotlight-rgb), 0.03) 60%, transparent 76%)',
          }}
        />

        {/* Precision optical aperture ring framing the portrait depth */}
        <div className="absolute left-1/2 top-[48%] h-[192px] w-[192px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--ermia-border)]/80 sm:h-[268px] sm:w-[268px] lg:h-[324px] lg:w-[324px]" />
      </motion.div>

      {/* Layer 1 (z-10): Oversized Readable HTML ERMIA Typography BEHIND the Subject */}
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                x: isFineDesktop ? textX : 0,
                y: textScrollY,
                translateY: isFineDesktop ? textY : 0,
                rotateX: isFineDesktop ? textRotateX : 0,
                rotateY: isFineDesktop ? textRotateY : 0,
                z: isFineDesktop ? -14 : 0,
                transformStyle: 'preserve-3d',
              }
        }
        className="pointer-events-none absolute inset-x-0 top-[46%] z-10 flex -translate-y-1/2 items-center justify-center sm:top-[44%]"
      >
        <KineticBrandTitle
          variant="behindSubject"
          delay={0.05}
          scrollProgress={activeScroll}
        />
      </motion.div>

      {/* Layer 2 (z-20): Transparent Foreground Portrait Subject Overlapping Center Typography */}
      <motion.div
        initial={
          prefersReducedMotion
            ? false
            : {
                opacity: 0,
                scale: 1.05,
                y: 22,
                clipPath: 'inset(12% 0% 100% 0%)',
              }
        }
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
        }}
        transition={{
          duration: MOTION_TIMING.cinematic + 0.08,
          delay: 0.1,
          ease: MOTION_EASE.cinematic,
        }}
        style={
          prefersReducedMotion
            ? undefined
            : {
                x: isFineDesktop ? fgX : 0,
                y: subjectScrollY,
                translateY: isFineDesktop ? fgY : 0,
                rotateX: isFineDesktop ? fgRotateX : stageRotateXScroll,
                rotateY: isFineDesktop ? fgRotateY : 0,
                scale: smoothTapScale,
                z: isFineDesktop ? 24 : 0,
                transformStyle: 'preserve-3d',
              }
        }
        className="relative z-20 flex h-[222px] w-[222px] items-end justify-center sm:h-[292px] sm:w-[292px] lg:h-[346px] lg:w-[346px]"
      >
        {fallbackStep < 3 ? (
          <img
            src={activeImageSrc}
            alt={alt}
            width={1254}
            height={1254}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className={
              isTransparentCutout
                ? 'h-full w-full select-none object-contain object-bottom drop-shadow-[0_26px_42px_rgba(0,0,0,0.52)]'
                : 'h-[92%] w-[86%] select-none rounded-[36px] border border-[var(--ermia-border-strong)] object-cover object-[50%_35%] shadow-[0_26px_48px_-18px_rgba(0,0,0,0.65)]'
            }
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="flex h-[85%] w-[85%] items-center justify-center rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]"
          >
            <span className="font-display text-lg font-semibold tracking-[0.2em] text-[var(--ermia-text)]">
              ERMIA
            </span>
          </div>
        )}

        {/* Fine-pointer cursor rim sheen across subject contour */}
        {isFineDesktop && !prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
            style={{
              background: sheenBackground,
              opacity: smoothSheenOpacity,
            }}
          />
        )}
      </motion.div>

      {/* Atmospheric Plinth Mist grounding bottom edge cleanly against baseline divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-[var(--ermia-bg)] via-[var(--ermia-bg)]/55 to-transparent sm:h-12"
      />

      {/* Layer 3 (z-30): Restrained Balanced 3D Liquid Glass & Brushed Chrome Monogram */}
      <div
        className="absolute end-3 bottom-3 z-30 sm:end-10 sm:bottom-5"
        style={{ transform: isFineDesktop ? 'translateZ(46px)' : undefined }}
      >
        <HeroMonogram3D theme={theme} ariaLabel={monogramAriaLabel} />
      </div>
    </div>
  );
}
