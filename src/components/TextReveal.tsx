import { ElementType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  MOTION_EASE,
  MOTION_TIMING,
  REVEAL_VIEWPORT,
} from '../styles/designTokens';

interface TextRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function TextReveal({
  children,
  as = 'div',
  className = '',
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        {...(immediate
          ? { animate: { y: '0%', opacity: 1 } }
          : {
              whileInView: { y: '0%', opacity: 1 },
              viewport: REVEAL_VIEWPORT,
            })}
        transition={{
          duration: MOTION_TIMING.cinematic,
          delay,
          ease: MOTION_EASE.cinematic,
        }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    </div>
  );
}
