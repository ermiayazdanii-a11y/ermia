import { ArrowUpLeft, ArrowUpRight, Github } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ErmiaLocaleContent, Locale } from '../data/ermiaData';
import {
  REVEAL_VIEWPORT,
  ScrollReveal,
  staggerContainerVariants,
  staggerItemVariants,
} from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface AboutSectionProps {
  locale: Locale;
  content: ErmiaLocaleContent['about'];
}

export function AboutSection({ locale, content }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const ExternalArrow = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      id="about"
      className="bg-[var(--ermia-bg-secondary)]/70 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
              <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                01
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
            <p className="mt-4 text-sm leading-[1.85] text-[var(--ermia-text-secondary)] sm:text-base">
              {content.intro}
            </p>
          </div>

          <a
            href={SITE_CONFIG.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] items-center gap-2.5 self-start rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] px-4 py-2 text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] lg:self-end"
          >
            <Github className="h-4 w-4 text-[var(--ermia-accent)]" strokeWidth={1.75} />
            <span>{content.githubCtaLabel}</span>
            <span dir="ltr" className="font-mono text-[var(--ermia-muted)]">
              @{SITE_CONFIG.githubUsername}
            </span>
            <ExternalArrow className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
        </ScrollReveal>

        {/* Staggered 4-Pillar Editorial Grid */}
        <motion.div
          variants={prefersReducedMotion ? undefined : staggerContainerVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-border)] md:grid-cols-2"
        >
          {content.pillars.map((pillar) => (
            <motion.div
              key={pillar.index}
              variants={prefersReducedMotion ? undefined : staggerItemVariants}
              className="group relative flex flex-col justify-between bg-[var(--ermia-surface)] p-6 transition-colors duration-200 hover:bg-[var(--ermia-bg-secondary)] sm:p-8"
            >
              <div>
                <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
                  {pillar.index}
                </span>
                <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-[var(--ermia-text)] transition-colors duration-150 group-hover:text-[var(--ermia-accent)]">
                  {pillar.heading}
                </h3>
                <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text-secondary)]">
                  {pillar.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
