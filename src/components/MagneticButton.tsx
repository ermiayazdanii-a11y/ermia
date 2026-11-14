import { ButtonHTMLAttributes, ReactNode, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { SPRING_CONFIG } from '../styles/designTokens';

interface MagneticButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
  > {
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.18,
  type = 'button',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG.magnetic);
  const springY = useSpring(y, SPRING_CONFIG.magnetic);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (
      prefersReducedMotion ||
      (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
    ) {
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-6, Math.min(6, offsetX)));
    y.set(Math.max(-5, Math.min(5, offsetY)));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
