import { useEffect, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import {
  ErmiaLocaleContent,
  JourneyMilestone,
  Locale,
} from '../data/ermiaData';
import { SPRING_CONFIG, ThemeMode } from '../styles/designTokens';
import { ImageReveal } from './ImageReveal';
import { InteractiveProjectCard } from './InteractiveProjectCard';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface JourneyTimelineSectionProps {
  locale: Locale;
  theme: ThemeMode;
  content: ErmiaLocaleContent['journey'];
  onNavigate: (sectionId: string) => void;
  onScrollToElement?: (el: HTMLElement) => void;
}

export function JourneyTimelineSection({
  locale,
  theme,
  content,
  onNavigate,
  onScrollToElement,
}: JourneyTimelineSectionProps) {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(
    content.milestones[0]?.id ?? ''
  );
  const milestoneRefs = useRef<Record<string, HTMLElement | null>>({});
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ['start 72%', 'end 68%'],
  });
  const smoothLineProgress = useSpring(
    scrollYProgress,
    SPRING_CONFIG.timelineLine
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveMilestoneId(entry.target.id.replace('milestone-', ''));
          }
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    for (const milestone of content.milestones) {
      const el = milestoneRefs.current[milestone.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [content.milestones]);

  const jumpToMilestone = (milestoneId: string) => {
    setActiveMilestoneId(milestoneId);
    const el = milestoneRefs.current[milestoneId];
    if (!el) return;
    if (onScrollToElement) {
      onScrollToElement(el);
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isExternal?: boolean
  ) => {
    if (!isExternal && href.startsWith('#')) {
      e.preventDefault();
      onNavigate(href.slice(1));
    }
  };

  const LinkArrow = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  return (
    <section
      id="journey"
      className="border-t border-[var(--ermia-border)] mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <ScrollReveal className="max-w-3xl">
        <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
          <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
            02
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
        <p className="mt-4 text-sm leading-relaxed text-[var(--ermia-text-secondary)] sm:text-base">
          {content.subtitle}
        </p>
      </ScrollReveal>

      {/* Horizontally Scrollable Period Navigation */}
      <div className="mt-10 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)]/90 p-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="px-2 text-xs font-medium text-[var(--ermia-muted)] whitespace-nowrap shrink-0">
            {content.jumpLabel}
          </span>

          <div
            role="tablist"
            aria-label={content.jumpLabel}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
          >
            {content.milestones.map((m) => {
              const isSelected = activeMilestoneId === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => jumpToMilestone(m.id)}
                  className={`relative inline-flex min-h-[38px] items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                    isSelected
                      ? 'text-[var(--ermia-accent-contrast)]'
                      : 'border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text-secondary)] hover:border-[var(--ermia-border-strong)] hover:text-[var(--ermia-text)]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="journey-active-pill"
                      aria-hidden="true"
                      transition={SPRING_CONFIG.tabPill}
                      className="absolute inset-0 rounded-xl bg-[var(--ermia-accent)]"
                    />
                  )}
                  <span className="relative z-10 font-mono tabular-nums opacity-85">
                    {m.number}
                  </span>
                  <span className="relative z-10">{m.year}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start marker */}
      <div className="mt-10 text-center">
        <p className="text-xs text-[var(--ermia-muted)]">{content.startLabel}</p>
      </div>

      {/* Connected Chronological Timeline */}
      <div ref={timelineContainerRef} className="relative mt-8">
        {/* Desktop Center Track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[var(--ermia-border)] lg:block"
        >
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { scaleY: smoothLineProgress, transformOrigin: 'top' }
            }
            className="h-full w-full bg-[var(--ermia-accent)] shadow-[0_0_14px_rgba(var(--ermia-spotlight-rgb),0.4)]"
          />
        </div>

        {/* Mobile Vertical Track */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 w-px bg-[var(--ermia-border)] lg:hidden ${
            locale === 'fa' ? 'right-4' : 'left-4'
          }`}
        >
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { scaleY: smoothLineProgress, transformOrigin: 'top' }
            }
            className="h-full w-full bg-[var(--ermia-accent)]"
          />
        </div>

        <div className="space-y-12 lg:space-y-16">
          {content.milestones.map((milestone: JourneyMilestone, idx: number) => {
            const isEven = idx % 2 === 0;
            const isActive = activeMilestoneId === milestone.id;
            const isHighlight = milestone.importance === 'highlight';

            return (
              <article
                key={milestone.id}
                id={`milestone-${milestone.id}`}
                ref={(el) => {
                  milestoneRefs.current[milestone.id] = el;
                }}
                className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12"
              >
                {/* Glowing Timeline Node */}
                <div
                  aria-hidden="true"
                  className={`absolute top-6 z-20 flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 ${
                    locale === 'fa'
                      ? 'right-[8.5px] lg:right-auto'
                      : 'left-[8.5px]'
                  } ${
                    isActive || isHighlight
                      ? 'scale-110 border-[var(--ermia-accent)] bg-[var(--ermia-accent)] shadow-[0_0_16px_rgba(var(--ermia-spotlight-rgb),0.55)]'
                      : 'border-[var(--ermia-border-strong)] bg-[var(--ermia-bg)]'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ermia-accent-contrast)]" />
                </div>

                {/* Outlined Monumental Period / Chapter Typography */}
                <ScrollReveal
                  delay={0.05}
                  className={`hidden lg:flex lg:col-span-5 ${
                    isEven
                      ? 'lg:order-2 lg:justify-start'
                      : 'lg:order-1 lg:justify-end'
                  }`}
                >
                  <div className="select-none">
                    <p
                      dir="ltr"
                      style={{
                        WebkitTextStroke: isActive
                          ? '1.25px var(--ermia-stroke-active)'
                          : '1px var(--ermia-stroke-inactive)',
                      }}
                      className="font-display text-6xl font-bold tracking-tight text-transparent transition-all duration-300 xl:text-7xl"
                    >
                      {milestone.number}
                    </p>
                    <p className="mt-1.5 font-mono text-xs tabular-nums text-[var(--ermia-muted)]">
                      {milestone.year} · {milestone.category}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Interactive Milestone Content Card */}
                <ScrollReveal
                  className={`${
                    locale === 'fa' ? 'pr-11 lg:pr-0' : 'pl-11 lg:pl-0'
                  } lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <InteractiveProjectCard
                    enableTilt={false}
                    theme={theme}
                    className={`p-6 sm:p-8 ${
                      isHighlight
                        ? 'border-[var(--ermia-accent)]/45 shadow-[0_18px_40px_-24px_rgba(var(--ermia-spotlight-rgb),0.25)]'
                        : isActive
                          ? 'border-[var(--ermia-border-strong)]'
                          : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-[var(--ermia-text-secondary)]">
                        <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                          {milestone.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{milestone.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{milestone.category}</span>
                      </div>

                      {isHighlight && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)]">
                          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                          <span>{content.highlightBadge}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-2xl">
                      {milestone.title}
                    </h3>

                    <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                      {milestone.description}
                    </p>

                    {milestone.image && (
                      <div className="mt-5 overflow-hidden rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)]">
                        <ImageReveal
                          src={milestone.image}
                          alt={milestone.imageAlt ?? milestone.title}
                          title={milestone.title}
                          className="aspect-[16/9] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    )}

                    {!milestone.image && milestone.conceptTag && (
                      <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)] px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-accent)]">
                            <Layers className="h-4 w-4" strokeWidth={1.75} />
                          </div>
                          <div>
                            <p className="font-display text-sm font-medium text-[var(--ermia-text)]">
                              FLOW
                            </p>
                            <p className="text-xs text-[var(--ermia-text-secondary)]">
                              {milestone.conceptTag}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--ermia-muted)]">
                          01 · 02 · 03
                        </span>
                      </div>
                    )}

                    {milestone.whyItMatters && (
                      <div className="mt-5 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 p-4">
                        <p className="text-xs font-medium text-[var(--ermia-accent)]">
                          {content.whyItMattersLabel}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                          {milestone.whyItMatters}
                        </p>
                      </div>
                    )}

                    {milestone.links && milestone.links.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-4 border-t border-[var(--ermia-border)] pt-4">
                        {milestone.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target={link.isExternal ? '_blank' : undefined}
                            rel={
                              link.isExternal
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            onClick={(e) =>
                              handleLinkClick(e, link.href, link.isExternal)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)] transition-opacity duration-150 hover:opacity-80"
                          >
                            <span>{link.label}</span>
                            <LinkArrow className="h-3.5 w-3.5" strokeWidth={2} />
                          </a>
                        ))}
                      </div>
                    )}
                  </InteractiveProjectCard>
                </ScrollReveal>
              </article>
            );
          })}
        </div>
      </div>

      {/* Honest End-of-Timeline Snapshot */}
      <ScrollReveal className="mt-16 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8">
        <p className="text-xs font-medium text-[var(--ermia-accent)]">
          {content.summaryTitle}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {content.summaryItems.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs text-[var(--ermia-muted)]">{item.label}</p>
              <p className="font-display text-base font-medium text-[var(--ermia-text)] sm:text-lg">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
