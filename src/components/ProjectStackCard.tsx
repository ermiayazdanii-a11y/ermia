import { ReactNode, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useMotionProfile } from '../hooks/useMotionProfile';
import { MOTION_EASE, REVEAL_VIEWPORT, ThemeMode } from '../styles/designTokens';
import { InteractiveProjectCard } from './InteractiveProjectCard';

interface ProjectStackCardProps {
  index: number;
  total: number;
  id?: string;
  theme: ThemeMode;
  children: ReactNode;
}

/**
 * Sticky depth-stack container for desktop (lg+) that smoothly scales down and
 * recesses cards as newer project chapters enter, while staying cleanly unclipped
 * and legible on mobile viewports.
 */
export function ProjectStackCard({
  index,
  total,
  id,
  theme,
  children,
}: ProjectStackCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion, allowParallax, allow3DTilt, revealDurationMultiplier } =
    useMotionProfile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 18%', 'end start'],
  });

  const isLast = index === total - 1;
  const targetScale = isLast ? 1 : 1 - (total - 1 - index) * 0.024;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : -1.4]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    [1, isLast ? 1 : 0.92, isLast ? 1 : 0.84]
  );

  const stickyTopOffsetPx = 88 + index * 14;

  return (
    <div
      id={id}
      ref={containerRef}
      style={{ zIndex: 10 + index, top: `${stickyTopOffsetPx}px` }}
      className="perspective-stage relative scroll-mt-24 lg:sticky"
    >
      <motion.div
        initial={
          prefersReducedMotion ? false : { opacity: 0, y: 26, scale: 0.985 }
        }
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={{
          duration: 0.65 * revealDurationMultiplier,
          ease: MOTION_EASE.cinematic,
        }}
        style={
          allowParallax
            ? {
                scale,
                rotateX,
                opacity,
              }
            : undefined
        }
        className="origin-top will-change-transform"
      >
        <InteractiveProjectCard
          theme={theme}
          enableTilt={allow3DTilt}
          tiltStrength="subtle"
          className="shadow-[0_24px_64px_-28px_rgba(0,0,0,0.52)]"
        >
          {children}
        </InteractiveProjectCard>
      </motion.div>
    </div>
  );
}
