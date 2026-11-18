import { ButtonHTMLAttributes, ReactNode, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { useMotionProfile } from '../hooks/useMotionProfile';
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
  strength = 0.2,
  type = 'button',
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { prefersReducedMotion, isFineDesktop } = useMotionProfile();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG.magnetic);
  const springY = useSpring(y, SPRING_CONFIG.magnetic);
  const innerX = useTransform(springX, (v) => v * 0.42);
  const innerY = useTransform(springY, (v) => v * 0.42);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (
      !isFineDesktop ||
      prefersReducedMotion ||
      (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
    ) {
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-7, Math.min(7, offsetX)));
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
      style={
        isFineDesktop && !prefersReducedMotion
          ? { x: springX, y: springY }
          : undefined
      }
      whileHover={isFineDesktop && !prefersReducedMotion ? { scale: 1.018 } : undefined}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.965 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className}
      {...props}
    >
      <motion.span
        style={
          isFineDesktop && !prefersReducedMotion
            ? { x: innerX, y: innerY }
            : undefined
        }
        className="inline-flex items-center justify-center [gap:inherit]"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
