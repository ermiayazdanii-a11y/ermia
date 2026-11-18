import { useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useMotionProfile } from '../hooks/useMotionProfile';
import {
  MOTION_EASE,
  MOTION_TIMING,
  REVEAL_VIEWPORT,
} from '../styles/designTokens';

interface ImageRevealProps {
  src: string;
  webpSrc?: string;
  alt: string;
  title?: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
  delay?: number;
  parallax?: boolean;
}

export function ImageReveal({
  src,
  webpSrc,
  alt,
  title,
  className = '',
  containerClassName = '',
  lazy = true,
  delay = 0.04,
  parallax = true,
}: ImageRevealProps) {
  const [hasError, setHasError] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion, allowParallax, revealDurationMultiplier } =
    useMotionProfile();

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const innerY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[var(--ermia-bg-secondary)] p-6 text-center ${containerClassName} ${className}`}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-accent)]">
          <Layers className="h-5 w-5" strokeWidth={1.5} />
        </div>
        {title && (
          <p className="font-display text-sm font-medium text-[var(--ermia-text)]">
            {title}
          </p>
        )}
      </div>
    );
  }

  const imageElement = (
    <picture className="block h-full w-full">
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
      />
    </picture>
  );

  if (prefersReducedMotion) {
    return (
      <div className={`overflow-hidden ${containerClassName}`}>
        {imageElement}
      </div>
    );
  }

  return (
    <motion.div
      ref={frameRef}
      initial={{
        opacity: 0,
        clipPath: 'inset(10% 0% 10% 0% round 12px)',
        scale: 1.045,
      }}
      whileInView={{
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0% round 12px)',
        scale: 1,
      }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: MOTION_TIMING.cinematic * revealDurationMultiplier,
        delay,
        ease: MOTION_EASE.cinematic,
      }}
      className={`overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={parallax && allowParallax ? { y: innerY, scale: 1.04 } : undefined}
        className="h-full w-full will-change-transform"
      >
        {imageElement}
      </motion.div>
    </motion.div>
  );
}
