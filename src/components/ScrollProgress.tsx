import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import { Locale } from '../data/ermiaData';
import { MOTION_EASE, SPRING_CONFIG } from '../styles/designTokens';

interface ScrollProgressProps {
  locale: Locale;
  activeSection: string;
  sectionLabels: Record<string, string>;
  showSectionBadge?: boolean;
}

const SECTION_ORDER = [
  'home',
  'about',
  'journey',
  'projects',
  'skills',
  'journal',
  'today',
  'contact',
] as const;

export function ScrollProgress({
  locale,
  activeSection,
  sectionLabels,
  showSectionBadge = true,
}: ScrollProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING_CONFIG.scrollProgress);

  const activeIndex = Math.max(
    0,
    SECTION_ORDER.indexOf(activeSection as (typeof SECTION_ORDER)[number])
  );
  const indexFormatted = String(activeIndex + 1).padStart(2, '0');
  const totalFormatted = String(SECTION_ORDER.length).padStart(2, '0');
  const currentLabel = sectionLabels[activeSection] ?? sectionLabels.home;

  return (
    <>
      {/* Top 2px animated page scroll progress line */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
      >
        <motion.div
          className="h-full w-full bg-[var(--ermia-accent)] shadow-[0_0_10px_rgba(var(--ermia-spotlight-rgb),0.45)]"
          style={{
            scaleX: prefersReducedMotion ? scrollYProgress : scaleX,
            transformOrigin: locale === 'fa' ? 'right' : 'left',
          }}
        />
      </div>

      {/* Restrained desktop current-section index indicator */}
      {showSectionBadge && (
        <aside
          aria-label={locale === 'fa' ? 'بخش فعال صفحه' : 'Current section indicator'}
          className={`pointer-events-none fixed bottom-6 z-30 hidden xl:flex items-center gap-2.5 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 px-3.5 py-2 backdrop-blur-md ${
            locale === 'fa' ? 'left-6' : 'right-6'
          }`}
        >
          <span className="font-mono text-[11px] tabular-nums text-[var(--ermia-accent)]">
            {indexFormatted}
            <span className="text-[var(--ermia-muted)]"> / {totalFormatted}</span>
          </span>
          <span aria-hidden="true" className="text-[var(--ermia-muted)]">
            ·
          </span>
          <div className="relative min-w-[72px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSection}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
                className="block text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap"
              >
                {currentLabel}
              </motion.span>
            </AnimatePresence>
          </div>
        </aside>
      )}
    </>
  );
}
