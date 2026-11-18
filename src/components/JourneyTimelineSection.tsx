import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
} from 'motion/react';
import {
  ErmiaLocaleContent,
  JourneyMilestone,
  Locale,
} from '../data/ermiaData';
import { useMotionProfile } from '../hooks/useMotionProfile';
import {
  MOTION_EASE,
  REVEAL_VIEWPORT,
  SPRING_CONFIG,
  ThemeMode,
} from '../styles/designTokens';
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
  const [showHighlightsOnly, setShowHighlightsOnly] = useState(false);
  const milestoneRefs = useRef<Record<string, HTMLElement | null>>({});
  const periodNavRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion, allow3DTilt, revealDurationMultiplier } =
    useMotionProfile();

  const displayedMilestones = useMemo(
    () =>
      showHighlightsOnly
        ? content.milestones.filter((m) => m.importance === 'highlight')
        : content.milestones,
    [content.milestones, showHighlightsOnly]
  );

  useEffect(() => {
    if (displayedMilestones.length === 0) return;
    setActiveMilestoneId((curr) =>
      displayedMilestones.some((m) => m.id === curr)
        ? curr
        : displayedMilestones[0].id
    );
  }, [displayedMilestones]);

  const activeMilestoneIndex = useMemo(() => {
    const idx = displayedMilestones.findIndex(
      (m) => m.id === activeMilestoneId
    );
    return idx >= 0 ? idx : 0;
  }, [displayedMilestones, activeMilestoneId]);

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
        rootMargin: '-32% 0px -48% 0px',
        threshold: 0.12,
      }
    );

    for (const milestone of displayedMilestones) {
      const el = milestoneRefs.current[milestone.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [displayedMilestones]);

  const handleToggleFilter = () => {
    const next = !showHighlightsOnly;
    const nextMilestones = next
      ? content.milestones.filter((m) => m.importance === 'highlight')
      : content.milestones;
    setShowHighlightsOnly(next);
    if (
      nextMilestones.length > 0 &&
      !nextMilestones.some((m) => m.id === activeMilestoneId)
    ) {
      setActiveMilestoneId(nextMilestones[0].id);
    }
  };

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

  const handlePeriodKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    const list = displayedMilestones;
    if (list.length === 0) return;
    const isRtl = locale === 'fa';
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = isRtl
        ? (idx - 1 + list.length) % list.length
        : (idx + 1) % list.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = isRtl
        ? (idx + 1) % list.length
        : (idx - 1 + list.length) % list.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = list.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const next = list[nextIdx];
      periodNavRefs.current[next.id]?.focus();
      jumpToMilestone(next.id);
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
      className="mx-auto max-w-6xl scroll-mt-24 border-t border-[var(--ermia-border)] px-4 py-20 sm:px-6 sm:py-28"
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
          locale={locale}
          splitWords
          scrollKinetic
          className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl text-balance"
        >
          {content.title}
        </TextReveal>
        <p className="mt-4 text-sm leading-relaxed text-[var(--ermia-text-secondary)] sm:text-base">
          {content.subtitle}
        </p>
      </ScrollReveal>

      {/* Horizontally Scrollable Period Navigation + Progressive Focus Toggle */}
      <div className="mt-10 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)]/95 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-xs font-medium text-[var(--ermia-muted)] whitespace-nowrap shrink-0">
              {content.jumpLabel}
            </span>

            <button
              type="button"
              aria-pressed={showHighlightsOnly}
              onClick={handleToggleFilter}
              className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                showHighlightsOnly
                  ? 'border-[var(--ermia-accent)] bg-[var(--ermia-accent)]/12 text-[var(--ermia-accent)]'
                  : 'border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text-secondary)] hover:text-[var(--ermia-text)]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>
                {showHighlightsOnly
                  ? content.turningPointsLabel
                  : content.allMilestonesLabel}
              </span>
            </button>
          </div>

          <nav
            aria-label={content.jumpLabel}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
          >
            {displayedMilestones.map((m, idx) => {
              const isSelected = activeMilestoneId === m.id;
              return (
                <button
                  key={m.id}
                  ref={(el) => {
                    periodNavRefs.current[m.id] = el;
                  }}
                  type="button"
                  aria-current={isSelected ? 'location' : undefined}
                  onClick={() => jumpToMilestone(m.id)}
                  onKeyDown={(e) => handlePeriodKeyDown(e, idx)}
                  className={`relative inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
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
          </nav>
        </div>
      </div>

      {/* Start indicator aligned directly above the rail center */}
      <div className="mt-10 flex items-center text-xs font-mono text-[var(--ermia-muted)] lg:justify-center">
        <span>{content.startLabel}</span>
      </div>

      {/*
        RESTORED ALTERNATING 3-COLUMN DESKTOP CSS GRID & COMPACT MOBILE VERTICAL RAIL:
        - Desktop (lg+): symmetric [1fr | 72px center timeline | 1fr], gap-x-0.
          Even entries -> Card in Col 1 (start), opposite chapter label in Col 3 (end).
          Odd entries  -> Card in Col 3 (end), opposite chapter label in Col 1 (start).
          Central connecting line runs along left-1/2 (-translate-x-1/2) — exact horizontal center of the 72px middle column.
          Horizontal connectors span strictly inside Column 2 from marker perimeter to card edge.
        - Mobile (< lg): single-sided [32px rail | gap-x-3 | 1fr card], line centered at start-[16px].
      */}
      <div ref={timelineContainerRef} className="relative mt-6">
        {/* Continuous vertical timeline line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-7 bottom-7 start-[16px] w-[1.5px] -translate-x-1/2 bg-[var(--ermia-border)] sm:start-[20px] rtl:translate-x-1/2 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 rtl:lg:-translate-x-1/2"
        >
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { scaleY: smoothLineProgress, transformOrigin: 'top' }
            }
            className="h-full w-full bg-[var(--ermia-accent)] shadow-[0_0_12px_rgba(var(--ermia-spotlight-rgb),0.45)]"
          />
        </div>

        <div className="space-y-9 sm:space-y-12 lg:space-y-14">
          {displayedMilestones.map((milestone: JourneyMilestone, idx: number) => {
            const isActive = idx === activeMilestoneIndex;
            const isCompleted = idx < activeMilestoneIndex;
            const isHighlight = milestone.importance === 'highlight';
            const isStartSideCard = idx % 2 === 0;

            return (
              <article
                key={milestone.id}
                id={`milestone-${milestone.id}`}
                ref={(el) => {
                  milestoneRefs.current[milestone.id] = el;
                }}
                className="relative grid grid-cols-[32px_minmax(0,1fr)] items-start gap-x-3 sm:grid-cols-[40px_minmax(0,1fr)] sm:gap-x-4 lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] lg:gap-x-0"
              >
                {/* Opposite Desktop Empty Column holding clean Chapter Number & Year OUTSIDE text cards */}
                <div
                  className={`hidden lg:row-start-1 lg:flex lg:flex-col lg:pt-5 ${
                    isStartSideCard
                      ? 'lg:col-start-3 lg:items-start lg:ps-5 lg:text-start'
                      : 'lg:col-start-1 lg:items-end lg:pe-5 lg:text-end'
                  }`}
                >
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={REVEAL_VIEWPORT}
                    transition={{
                      duration: 0.45 * revealDurationMultiplier,
                      ease: MOTION_EASE.cinematic,
                    }}
                    className="select-none"
                  >
                    <span
                      className={`block font-mono text-4xl font-semibold tabular-nums leading-none tracking-tight transition-colors duration-200 ${
                        isActive
                          ? 'text-[var(--ermia-accent)]'
                          : isCompleted
                            ? 'text-[var(--ermia-text)]/70'
                            : 'text-[var(--ermia-muted)]/60'
                      }`}
                    >
                      {milestone.number}
                    </span>
                    <span className="mt-2 block font-display text-base font-medium text-[var(--ermia-text)]">
                      {milestone.year}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--ermia-muted)]">
                      {milestone.date}
                    </span>
                  </motion.div>
                </div>

                {/* Dedicated Central / Left Timeline Rail Column (strictly isolated markers & connectors) */}
                <div className="relative col-start-1 row-start-1 flex h-16 items-start justify-center pt-6 lg:col-start-2 lg:row-start-1">
                  {/* Horizontal connector linking active/completed marker toward its card without overlapping text */}
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      scaleX: isActive ? 1 : isCompleted ? 0.65 : 0.4,
                      opacity: isActive ? 1 : isCompleted ? 0.55 : 0.25,
                    }}
                    transition={SPRING_CONFIG.timelineConnector}
                    className={`pointer-events-none hidden lg:block absolute top-[35px] h-px w-[calc(50%-10px)] ${
                      isActive
                        ? 'bg-[var(--ermia-accent)] shadow-[0_0_8px_rgba(var(--ermia-spotlight-rgb),0.55)]'
                        : 'bg-[var(--ermia-border-strong)]'
                    } ${
                      isStartSideCard
                        ? 'start-0 origin-right rtl:origin-left'
                        : 'end-0 origin-left rtl:origin-right'
                    }`}
                  />

                  {/* Mobile single-sided horizontal connector */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-[35px] end-0 h-px w-[calc(50%-8px)] lg:hidden ${
                      isActive
                        ? 'bg-[var(--ermia-accent)]'
                        : 'bg-[var(--ermia-border-strong)]/70'
                    }`}
                  />

                  <motion.button
                    type="button"
                    onClick={() => jumpToMilestone(milestone.id)}
                    aria-label={`${milestone.number} ${milestone.title}`}
                    aria-current={isActive ? 'step' : undefined}
                    initial={prefersReducedMotion ? false : { scale: 0.72, opacity: 0 }}
                    whileInView={{ scale: isActive ? 1.15 : 1, opacity: 1 }}
                    viewport={REVEAL_VIEWPORT}
                    transition={SPRING_CONFIG.timelineMarker}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                  >
                    {/* Restrained glowing lime aura on active node only */}
                    {isActive && (
                      <motion.span
                        aria-hidden="true"
                        layoutId="journey-active-halo"
                        transition={SPRING_CONFIG.timelineMarker}
                        className="pointer-events-none absolute inset-0 rounded-full bg-[var(--ermia-accent)]/20 ring-1 ring-[var(--ermia-accent)]/45 shadow-[0_0_16px_rgba(var(--ermia-spotlight-rgb),0.4)]"
                      />
                    )}

                    {/* Center dot cleanly anchored on top of the line */}
                    <span
                      aria-hidden="true"
                      className={`relative block rounded-full border-2 transition-colors duration-200 ${
                        isActive
                          ? 'h-3.5 w-3.5 border-[var(--ermia-accent)] bg-[var(--ermia-accent)]'
                          : isCompleted
                            ? 'h-3 w-3 border-[var(--ermia-accent)]/80 bg-[var(--ermia-accent)]/75'
                            : isHighlight
                              ? 'h-3 w-3 border-[var(--ermia-accent)]/55 bg-[var(--ermia-bg)]'
                              : 'h-2.5 w-2.5 border-[var(--ermia-border-strong)] bg-[var(--ermia-bg)]'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Dedicated Alternating Content Card Column */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? false
                      : {
                          opacity: 0,
                          x: isStartSideCard ? -16 : 16,
                          y: 12,
                        }
                  }
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{
                    duration: 0.56 * revealDurationMultiplier,
                    ease: MOTION_EASE.cinematic,
                  }}
                  className={`col-start-2 min-w-0 lg:row-start-1 ${
                    isStartSideCard ? 'lg:col-start-1' : 'lg:col-start-3'
                  }`}
                >
                  <InteractiveProjectCard
                    enableTilt={allow3DTilt}
                    tiltStrength="subtle"
                    theme={theme}
                    className={`p-5 sm:p-6 ${
                      isActive
                        ? 'border-[var(--ermia-accent)]/60 shadow-[0_18px_40px_-24px_rgba(var(--ermia-spotlight-rgb),0.32)]'
                        : isHighlight
                          ? 'border-[var(--ermia-border-strong)]'
                          : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-[var(--ermia-text-secondary)]">
                        <span className="font-mono tabular-nums text-[var(--ermia-accent)] lg:hidden">
                          {milestone.number}
                        </span>
                        <span aria-hidden="true" className="lg:hidden">
                          ·
                        </span>
                        <span className="lg:hidden">{milestone.date}</span>
                        <span aria-hidden="true" className="lg:hidden">
                          ·
                        </span>
                        <span>{milestone.category}</span>
                      </div>

                      {isHighlight && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)]">
                          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
                          <span>{content.highlightBadge}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-[var(--ermia-text)] sm:text-xl">
                      {milestone.title}
                    </h3>

                    <p className="mt-3 text-sm leading-[1.8] text-[var(--ermia-text)]/85 sm:leading-[1.85]">
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
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-accent)]">
                            <Layers className="h-4 w-4" strokeWidth={1.75} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-sm font-medium text-[var(--ermia-text)]">
                              FLOW
                            </p>
                            <p className="truncate text-xs text-[var(--ermia-text-secondary)]">
                              {milestone.conceptTag}
                            </p>
                          </div>
                        </div>
                        <span className="hidden sm:inline font-mono text-[11px] text-[var(--ermia-muted)] shrink-0">
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
                            className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)] transition-opacity duration-150 hover:opacity-80"
                          >
                            <span>{link.label}</span>
                            <LinkArrow className="h-3.5 w-3.5" strokeWidth={2} />
                          </a>
                        ))}
                      </div>
                    )}
                  </InteractiveProjectCard>
                </motion.div>
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
