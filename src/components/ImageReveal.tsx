import { useState } from 'react';
import { Layers } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  MOTION_EASE,
  MOTION_TIMING,
  REVEAL_VIEWPORT,
} from '../styles/designTokens';

interface ImageRevealProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
  delay?: number;
}

export function ImageReveal({
  src,
  alt,
  title,
  className = '',
  containerClassName = '',
  lazy = true,
  delay = 0.05,
}: ImageRevealProps) {
  const [hasError, setHasError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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

  if (prefersReducedMotion) {
    return (
      <div className={`overflow-hidden ${containerClassName}`}>
        <img
          src={src}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={className}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        clipPath: 'inset(10% 0% 10% 0% round 12px)',
        scale: 1.04,
      }}
      whileInView={{
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0% round 12px)',
        scale: 1,
      }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: MOTION_TIMING.cinematic,
        delay,
        ease: MOTION_EASE.cinematic,
      }}
      className={`overflow-hidden ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={className}
      />
    </motion.div>
  );
}
