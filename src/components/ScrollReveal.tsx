import { ReactNode } from 'react';
import { motion, useReducedMotion, Variants } from 'motion/react';
import {
  MOTION_EASE,
  MOTION_TIMING,
  REVEAL_VIEWPORT,
} from '../styles/designTokens';

export const CINEMATIC_EASE = MOTION_EASE.cinematic;
export { REVEAL_VIEWPORT };

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 20,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{
        duration: MOTION_TIMING.reveal,
        delay,
        ease: MOTION_EASE.cinematic,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: MOTION_EASE.cinematic,
    },
  },
};
