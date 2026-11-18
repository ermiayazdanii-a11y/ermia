import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

interface SectionTransitionProps {
  indexLabel?: string;
  sectionLabel?: string;
}

/**
 * Lightweight scroll-linked editorial rule separating major portfolio chapters
 * using compositor-only scaleX and opacity transforms.
 */
export function SectionTransition({
  indexLabel,
  sectionLabel,
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'end 25%'],
  });

  const lineScaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0.24, 1, 0.72]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.85, 0.35]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="mx-auto max-w-6xl px-4 py-2 sm:px-6"
    >
      <div className="relative flex items-center gap-4">
        {(indexLabel || sectionLabel) && (
          <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-[var(--ermia-muted)] whitespace-nowrap shrink-0">
            {indexLabel && (
              <span className="text-[var(--ermia-accent)]">{indexLabel}</span>
            )}
            {indexLabel && sectionLabel && <span aria-hidden="true">·</span>}
            {sectionLabel && <span>{sectionLabel}</span>}
          </div>
        )}

        <div className="relative h-px flex-1 overflow-hidden bg-[var(--ermia-border)]">
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : {
                    scaleX: lineScaleX,
                    opacity: glowOpacity,
                  }
            }
            className="h-full w-full origin-left rtl:origin-right bg-gradient-to-r rtl:bg-gradient-to-l from-[var(--ermia-accent)]/75 via-[var(--ermia-accent)]/30 to-transparent will-change-transform"
          />
        </div>
      </div>
    </div>
  );
}
