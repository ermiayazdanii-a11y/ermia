import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { ArrowUpLeft, ArrowUpRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ErmiaLocaleContent,
  JournalEntry,
  Locale,
} from '../data/ermiaData';
import { MOTION_EASE } from '../styles/designTokens';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface JournalSectionProps {
  locale: Locale;
  content: ErmiaLocaleContent['journal'];
}

export function JournalSection({ locale, content }: JournalSectionProps) {
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (!activeEntry) return;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveEntry(null);
    };
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
      window.removeEventListener('keydown', onKey);
      lastTriggerRef.current?.focus();
    };
  }, [activeEntry, lenis]);

  const ReadArrow = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      id="journal"
      className="border-t border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/70 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
            <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
              05
            </span>
            <span aria-hidden="true" className="text-[var(--ermia-muted)]">
              ·
            </span>
            <span>{content.kicker}</span>
          </div>
          <TextReveal
            as="h2"
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl text-balance"
          >
            {content.title}
          </TextReveal>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ermia-text-secondary)] sm:text-base">
            {content.subtitle}
          </p>
        </ScrollReveal>

        {/* Clean Editorial List */}
        <ScrollReveal
          delay={0.08}
          className="mt-10 divide-y divide-[var(--ermia-border)] border-y border-[var(--ermia-border)]"
        >
          {content.entries.map((entry) => (
            <article key={entry.id}>
              <button
                type="button"
                onClick={(e) => {
                  lastTriggerRef.current = e.currentTarget;
                  setActiveEntry(entry);
                }}
                className="group grid w-full grid-cols-1 gap-4 py-7 text-start transition-colors duration-200 hover:bg-[var(--ermia-surface)]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] lg:grid-cols-12 lg:items-baseline lg:gap-8 lg:px-4 cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ermia-text-secondary)] lg:col-span-4">
                  <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                    {entry.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.dateLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.readTime}</span>
                </div>

                <div className="lg:col-span-6">
                  <h3 className="font-display text-xl font-medium tracking-tight text-[var(--ermia-text)] transition-colors duration-150 group-hover:text-[var(--ermia-accent)]">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
                    {entry.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-start lg:col-span-2 lg:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--ermia-accent)]">
                    <span>{content.readNoteLabel}</span>
                    <ReadArrow className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                </div>
              </button>
            </article>
          ))}
        </ScrollReveal>
      </div>

      {/* Animated Journal Reader Modal with Focus Restoration & Lenis Isolation */}
      <AnimatePresence>
        {activeEntry && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-note-title"
            data-lenis-prevent
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ermia-bg)]/92 p-4 backdrop-blur-xl sm:p-6"
          >
            <div
              aria-hidden="true"
              onClick={() => setActiveEntry(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, scale: 0.97, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }
              }
              transition={{ duration: 0.25, ease: MOTION_EASE.cinematic }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-surface)] shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[var(--ermia-border)] px-6 py-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ermia-text-secondary)]">
                  <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                    {activeEntry.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeEntry.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeEntry.readTime}</span>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={content.closeAria}
                  onClick={() => setActiveEntry(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)] text-[var(--ermia-text)] transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <div
                data-lenis-prevent
                className="overflow-y-auto px-6 py-7 sm:px-8 sm:py-8"
              >
                <h2
                  id="journal-note-title"
                  className="font-display text-2xl font-semibold leading-snug tracking-tight text-[var(--ermia-text)] sm:text-3xl text-balance"
                >
                  {activeEntry.title}
                </h2>
                <p className="mt-4 border-b border-[var(--ermia-border)] pb-5 text-sm leading-[1.75] text-[var(--ermia-text)]/85 sm:text-base">
                  {activeEntry.excerpt}
                </p>

                <div className="mt-6 space-y-5">
                  {activeEntry.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-sm leading-[1.85] text-[var(--ermia-text-secondary)] sm:text-base"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
