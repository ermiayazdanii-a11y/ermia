import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Compass,
  Layers,
  Maximize2,
  Minus,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ErmiaLocaleContent,
  FlowScreenshot,
  Locale,
  MEDIA_ASSETS,
} from '../data/ermiaData';
import { useModalFocusTrap } from '../hooks/useModalFocusTrap';
import { useMotionProfile } from '../hooks/useMotionProfile';
import {
  MOTION_EASE,
  REVEAL_VIEWPORT,
  SPRING_CONFIG,
  ThemeMode,
} from '../styles/designTokens';
import { FlowDeviceShowcase } from './FlowDeviceShowcase';
import { ImageReveal } from './ImageReveal';
import { LiquidImageTrail } from './LiquidImageTrail';
import { ProjectStackCard } from './ProjectStackCard';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface ProjectsSectionProps {
  locale: Locale;
  theme: ThemeMode;
  content: ErmiaLocaleContent['projects'];
  onOpenCaseStudy: () => void;
}

type FlowChapterId =
  | 'project-card-overview'
  | 'project-card-concept'
  | 'project-card-progress'
  | 'project-card-architecture';

const FLOW_CHAPTER_IDS: FlowChapterId[] = [
  'project-card-overview',
  'project-card-concept',
  'project-card-progress',
  'project-card-architecture',
];

export function ProjectsSection({
  locale,
  theme,
  content,
  onOpenCaseStudy,
}: ProjectsSectionProps) {
  const [activeChapter, setActiveChapter] = useState<FlowChapterId>(
    'project-card-overview'
  );
  const [activeConceptIdx, setActiveConceptIdx] = useState(0);
  const [lightboxShot, setLightboxShot] = useState<FlowScreenshot | null>(null);
  const lightboxDialogRef = useRef<HTMLDivElement | null>(null);
  const closeLightboxRef = useRef<HTMLButtonElement | null>(null);
  const lastShotTriggerRef = useRef<HTMLButtonElement | null>(null);
  const chapterNavRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { prefersReducedMotion, revealDurationMultiplier } = useMotionProfile();
  const lenis = useLenis();
  const project = content.featured;
  const activeFeature =
    project.features[activeConceptIdx] ?? project.features[0];
  const StudyArrow = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  const chapters = useMemo<{ id: FlowChapterId; num: string; label: string }[]>(
    () => [
      { id: 'project-card-overview', num: '01', label: content.tabs.overview },
      { id: 'project-card-concept', num: '02', label: content.tabs.concept },
      {
        id: 'project-card-progress',
        num: '03',
        label: content.tabs.progress,
      },
      {
        id: 'project-card-architecture',
        num: '04',
        label: content.tabs.architecture,
      },
    ],
    [
      content.tabs.overview,
      content.tabs.concept,
      content.tabs.progress,
      content.tabs.architecture,
    ]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id as FlowChapterId);
          }
        }
      },
      {
        rootMargin: '-28% 0px -55% 0px',
        threshold: 0.08,
      }
    );

    for (const id of FLOW_CHAPTER_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const jumpToChapter = (chapterId: FlowChapterId) => {
    setActiveChapter(chapterId);
    const el = document.getElementById(chapterId);
    if (!el) return;
    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(el, { offset: -88, duration: 0.95 });
    } else {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const handleChapterKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    const isRtl =
      typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = isRtl
        ? (idx - 1 + chapters.length) % chapters.length
        : (idx + 1) % chapters.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = isRtl
        ? (idx + 1) % chapters.length
        : (idx - 1 + chapters.length) % chapters.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = chapters.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const target = chapters[nextIdx];
      chapterNavRefs.current[target.id]?.focus();
      jumpToChapter(target.id);
    }
  };

  const handleCloseLightbox = useCallback(() => {
    setLightboxShot(null);
  }, []);

  useModalFocusTrap({
    isOpen: Boolean(lightboxShot),
    dialogRef: lightboxDialogRef,
    initialFocusRef: closeLightboxRef,
    triggerRef: lastShotTriggerRef,
    onClose: handleCloseLightbox,
    lenis,
  });

  const renderStageIcon = (stage: 'implemented' | 'planned' | 'conceptual') => {
    if (stage === 'implemented') {
      return (
        <CheckCircle2
          className="h-3.5 w-3.5 text-[var(--ermia-accent)]"
          strokeWidth={2}
        />
      );
    }
    if (stage === 'planned') {
      return (
        <Clock3
          className="h-3.5 w-3.5 text-[var(--ermia-text-secondary)]"
          strokeWidth={1.75}
        />
      );
    }
    return (
      <Compass
        className="h-3.5 w-3.5 text-[var(--ermia-muted)]"
        strokeWidth={1.75}
      />
    );
  };

  return (
    <section
      id="projects"
      className="scroll-mt-24 bg-[var(--ermia-bg-secondary)]/70 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header + Designated Liquid Image Trail Canopy */}
        <LiquidImageTrail
          images={[
            MEDIA_ASSETS.portrait,
            MEDIA_ASSETS.portraitCutout,
            '/favicon-192x192.png',
          ]}
          minDistance={56}
          maxItems={5}
          className="rounded-3xl p-2 -m-2 sm:p-4 sm:-m-4"
        >
          <ScrollReveal className="max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
              <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                03
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
        </LiquidImageTrail>

        {/* Accessible Quick-Jump Chapter Strip for Sticky Sequence */}
        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)]/95 p-2.5 lg:flex-row lg:items-center lg:justify-between">
          <nav
            aria-label="FLOW Project Stack Navigation"
            className="flex items-center gap-1.5 overflow-x-auto"
          >
            {chapters.map((ch, idx) => {
              const isSelected = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  ref={(el) => {
                    chapterNavRefs.current[ch.id] = el;
                  }}
                  type="button"
                  aria-current={isSelected ? 'location' : undefined}
                  onClick={() => jumpToChapter(ch.id)}
                  onKeyDown={(e) => handleChapterKeyDown(e, idx)}
                  className={`relative inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                    isSelected
                      ? 'text-[var(--ermia-accent-contrast)]'
                      : 'text-[var(--ermia-text-secondary)] hover:bg-[var(--ermia-bg-secondary)] hover:text-[var(--ermia-text)]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="flow-stack-active-pill"
                      aria-hidden="true"
                      transition={SPRING_CONFIG.tabPill}
                      className="absolute inset-0 rounded-xl bg-[var(--ermia-accent)]"
                    />
                  )}
                  <span className="relative z-10 font-mono tabular-nums opacity-80">
                    {ch.num}
                  </span>
                  <span className="relative z-10">{ch.label}</span>
                </button>
              );
            })}
          </nav>

          <a
            href="/projects/flow"
            onClick={(e) => {
              e.preventDefault();
              onOpenCaseStudy();
            }}
            className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-bg)] px-4 py-2 text-xs font-medium text-[var(--ermia-accent)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:bg-[var(--ermia-accent)] hover:text-[var(--ermia-accent-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
          >
            <span>{content.openCaseStudyLabel}</span>
            <StudyArrow className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </div>

        {/* Cinematic Sticky Project Stack (4 Preserved FLOW Chapters) */}
        <div className="mt-8 space-y-8 lg:space-y-12">
          {/* STACK CARD 01: FLOW Identity, Purpose & CRT Digital Concept Preview */}
          <ProjectStackCard
            id="project-card-overview"
            index={0}
            total={4}
            theme={theme}
          >
            <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
              <div className="relative flex min-h-[290px] flex-col justify-between gap-4 border-b border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-5 sm:p-8 lg:col-span-6 lg:border-b-0 lg:border-e">
                <FlowDeviceShowcase
                  variant="compact"
                  conceptPreviewLabel={content.conceptPreviewLabel}
                  stageLabels={content.stageLabels}
                  screenshots={project.screenshots}
                  onOpenScreenshot={(shot, triggerEl) => {
                    lastShotTriggerRef.current = triggerEl;
                    setLightboxShot(shot);
                  }}
                  activeLayer={{
                    number: `0${activeConceptIdx + 1}`,
                    name: activeFeature?.title ?? project.title,
                    stage: activeFeature?.stage ?? 'conceptual',
                    role: activeFeature?.stateLabel ?? project.subtitle,
                    summary: activeFeature?.detail ?? project.mainConcept,
                  }}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-xs text-[var(--ermia-muted)]">
                    <span>{content.conceptLayerHint}</span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={activeConceptIdx}
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.16, ease: MOTION_EASE.cinematic }}
                        className="font-mono tabular-nums text-[var(--ermia-accent)]"
                      >
                        0{activeConceptIdx + 1}/0{project.features.length}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {project.features.map((feat, i) => {
                      const selected = i === activeConceptIdx;
                      return (
                        <button
                          key={feat.title}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setActiveConceptIdx(i)}
                          className={`relative flex w-full items-center justify-between gap-2.5 overflow-hidden rounded-xl border px-3.5 py-2.5 text-start transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                            selected
                              ? 'border-[var(--ermia-accent)]/65 bg-[var(--ermia-surface)]'
                              : 'border-[var(--ermia-border)] bg-[var(--ermia-surface)]/65 hover:border-[var(--ermia-accent)]/35 hover:bg-[var(--ermia-surface)]'
                          }`}
                        >
                          {selected && (
                            <motion.span
                              layoutId="flow-concept-active"
                              aria-hidden="true"
                              transition={SPRING_CONFIG.tabPill}
                              className="pointer-events-none absolute inset-0 rounded-xl bg-[var(--ermia-accent)]/8 ring-1 ring-inset ring-[var(--ermia-accent)]/35"
                            />
                          )}
                          <div className="relative z-10 flex min-w-0 items-center gap-2.5">
                            <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
                              0{i + 1}
                            </span>
                            <span className="truncate font-display text-xs font-medium text-[var(--ermia-text)] sm:text-sm">
                              {feat.title}
                            </span>
                          </div>
                          <span className="relative z-10 shrink-0">
                            {renderStageIcon(feat.stage)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[var(--ermia-text-secondary)]">
                    <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                      {project.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{project.subtitle}</span>
                  </div>

                  <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                    {project.introduction}
                  </p>

                  <div className="mt-6 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4">
                    <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                      {content.purposeLabel}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                      {project.purpose}
                    </p>
                  </div>
                </div>

                {/* Confirmed Tech / Learning Alignment */}
                <div className="mt-7 border-t border-[var(--ermia-border)] pt-5">
                  <p className="text-xs font-medium text-[var(--ermia-muted)]">
                    {content.techLabel}
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {project.technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-3 transition-colors duration-150 hover:border-[var(--ermia-accent)]/45"
                      >
                        <p className="font-display text-sm font-medium text-[var(--ermia-text)]">
                          {tech.name}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-[var(--ermia-text-secondary)]">
                          {tech.levelNote}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ProjectStackCard>

          {/* STACK CARD 02: Concept, Design Direction & Planned Features */}
          <ProjectStackCard
            id="project-card-concept"
            index={1}
            total={4}
            theme={theme}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--ermia-border)] pb-4">
                <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
                  <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                    02
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{content.tabs.concept}</span>
                </div>
                <span className="font-mono text-xs text-[var(--ermia-muted)]">
                  FLOW
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-5 sm:p-6">
                  <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                    {content.conceptLabel}
                  </h4>
                  <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                    {project.mainConcept}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-5 sm:p-6">
                  <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                    {content.designLabel}
                  </h4>
                  <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                    {project.designDirection}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-medium text-[var(--ermia-text-secondary)]">
                  {content.featuresLabel}
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {project.features.map((feat) => (
                    <div
                      key={feat.title}
                      className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4 transition-colors duration-150 hover:border-[var(--ermia-accent)]/35"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-display text-base font-medium text-[var(--ermia-text)]">
                          {feat.title}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)]">
                          {renderStageIcon(feat.stage)}
                          <span>{feat.stateLabel}</span>
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
                        {feat.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ProjectStackCard>

          {/* STACK CARD 03: Honest Progress & Lessons From Past Experiments */}
          <ProjectStackCard
            id="project-card-progress"
            index={2}
            total={4}
            theme={theme}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--ermia-border)] pb-4">
                <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
                  <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                    03
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{content.tabs.progress}</span>
                </div>
                <span className="font-mono text-xs text-[var(--ermia-muted)]">
                  FLOW
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                    {content.progressLabel}
                  </h4>
                  <div className="mt-3 divide-y divide-[var(--ermia-border)] rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-4 sm:px-5">
                    {project.progressSteps.map((step) => (
                      <div
                        key={step.phase}
                        className="flex items-start gap-3 py-4"
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ermia-accent)]"
                            strokeWidth={2}
                          />
                        ) : (
                          <CircleDot
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              step.status === 'active'
                                ? 'text-[var(--ermia-accent)]'
                                : 'text-[var(--ermia-muted)]'
                            }`}
                            strokeWidth={1.75}
                          />
                        )}
                        <div>
                          <p className="font-display text-sm font-medium text-[var(--ermia-text)]">
                            {step.phase}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--ermia-text-secondary)]">
                            {step.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <h4 className="font-display text-lg font-medium text-[var(--ermia-text)]">
                    {project.comparisonTitle}
                  </h4>
                  <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4">
                    <table className="w-full min-w-[480px] border-collapse text-start">
                      <thead>
                        <tr className="border-b border-[var(--ermia-border)] text-xs font-medium text-[var(--ermia-text-secondary)]">
                          <th className="py-2.5 pe-4 text-start font-medium">
                            {content.comparisonHeaders.aspect}
                          </th>
                          <th className="py-2.5 px-3 text-start font-medium text-[var(--ermia-muted)]">
                            {content.comparisonHeaders.earlier}
                          </th>
                          <th className="py-2.5 ps-3 text-start font-medium text-[var(--ermia-accent)]">
                            {content.comparisonHeaders.flow}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--ermia-border)] text-xs sm:text-sm">
                        {project.comparisonRows.map((row) => (
                          <tr key={row.aspect}>
                            <td className="py-3.5 pe-4 align-top font-medium text-[var(--ermia-text)]">
                              {row.aspect}
                            </td>
                            <td className="py-3.5 px-3 align-top text-[var(--ermia-muted)]">
                              <div className="flex items-start gap-2">
                                <Minus
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                  strokeWidth={2}
                                />
                                <span>{row.earlierExperiments}</span>
                              </div>
                            </td>
                            <td className="py-3.5 ps-3 align-top text-[var(--ermia-text)]/90">
                              <div className="flex items-start gap-2">
                                <Check
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ermia-accent)]"
                                  strokeWidth={2}
                                />
                                <span>{row.flowDirection}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </ProjectStackCard>

          {/* STACK CARD 04: Authentic Development State Showcase & Dedicated Case Study CTA */}
          <ProjectStackCard
            id="project-card-architecture"
            index={3}
            total={4}
            theme={theme}
          >
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ermia-border)] pb-4">
                <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
                  <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                    04
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{content.devStateLabel}</span>
                </div>
                <span className="font-mono text-xs text-[var(--ermia-muted)]">
                  {content.devStateBadge}
                </span>
              </div>

              {project.screenshots.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {project.screenshots.map((shot, shotIdx) => {
                    const isMobileCapture = shot.device === 'mobile';
                    return (
                      <motion.div
                        key={shot.id}
                        initial={
                          prefersReducedMotion ? false : { opacity: 0, y: 14 }
                        }
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={REVEAL_VIEWPORT}
                        transition={{
                          duration: 0.48 * revealDurationMultiplier,
                          delay: prefersReducedMotion ? 0 : shotIdx * 0.055,
                          ease: MOTION_EASE.cinematic,
                        }}
                        className="overflow-hidden rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] transition-colors hover:border-[var(--ermia-accent)]/50"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            lastShotTriggerRef.current = e.currentTarget;
                            setLightboxShot(shot);
                          }}
                          className="group/item relative flex h-full w-full flex-col justify-between overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                        >
                          <div className="flex w-full items-center justify-center bg-[var(--ermia-bg)] p-4">
                            <div
                              className={
                                isMobileCapture
                                  ? 'w-36 overflow-hidden rounded-[22px] border border-white/15 bg-[#0c141d] p-1 shadow-lg transition-transform duration-300 group-hover/item:-translate-y-0.5 sm:w-40'
                                  : 'w-full overflow-hidden rounded-lg transition-transform duration-300 group-hover/item:-translate-y-0.5'
                              }
                            >
                              <ImageReveal
                                src={shot.src}
                                webpSrc={shot.webpSrc}
                                alt={shot.alt}
                                containerClassName={
                                  isMobileCapture
                                    ? 'aspect-[1080/2460] w-full rounded-[17px]'
                                    : 'aspect-[16/10]'
                                }
                                className={
                                  isMobileCapture
                                    ? 'h-full w-full object-contain transition-transform duration-300 group-hover/item:scale-[1.02]'
                                    : 'h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-[1.03]'
                                }
                              />
                            </div>
                          </div>
                          <div className="flex w-full items-center justify-between gap-2 border-t border-[var(--ermia-border)] px-3.5 py-3 text-xs">
                            <span className="truncate font-medium text-[var(--ermia-text)]">
                              {shot.caption}
                            </span>
                            <Maximize2 className="h-3.5 w-3.5 shrink-0 text-[var(--ermia-muted)] transition-transform duration-200 group-hover/item:scale-110 group-hover/item:text-[var(--ermia-accent)]" />
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-6 border-b border-[var(--ermia-border)] pb-5 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--ermia-accent)]">
                        <Layers className="h-4 w-4" strokeWidth={1.75} />
                        <span>FLOW · {content.tabs.architecture}</span>
                      </div>
                      <h4 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-2xl">
                        {content.devStateTitle}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                        {content.devStateBody}
                      </p>
                    </div>

                    <a
                      href="/projects/flow"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenCaseStudy();
                      }}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--ermia-accent)] px-5 py-2.5 text-xs font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 shadow-[0_12px_28px_-12px_rgba(var(--ermia-spotlight-rgb),0.45)] transition-colors duration-150 hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
                    >
                      <span>{content.openCaseStudyLabel}</span>
                      <StudyArrow className="h-4 w-4" strokeWidth={2} />
                    </a>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {content.devStatePillars.map((pillar) => (
                      <div
                        key={pillar.index}
                        className="flex flex-col justify-between rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-4"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                              {pillar.index}
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ermia-text-secondary)]">
                              {renderStageIcon(pillar.stage)}
                              <span>{content.stageLabels[pillar.stage]}</span>
                            </span>
                          </div>
                          <h5 className="mt-3 font-display text-base font-medium text-[var(--ermia-text)]">
                            {pillar.title}
                          </h5>
                          <p className="mt-1.5 text-xs leading-relaxed text-[var(--ermia-text-secondary)]">
                            {pillar.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Honest Roadmap Note + Dedicated FLOW Product Page Link */}
              <div className="mt-6 flex flex-col justify-between gap-5 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 p-5 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium text-[var(--ermia-accent)]">
                    {content.futureNoteTitle}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                    {content.futureNoteBody}
                  </p>
                </div>

                <a
                  href="/projects/flow"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenCaseStudy();
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--ermia-accent)] px-5 py-2.5 text-xs font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 shadow-[0_12px_28px_-12px_rgba(var(--ermia-spotlight-rgb),0.45)] transition-colors duration-150 hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
                >
                  <span>{content.openCaseStudyLabel}</span>
                  <StudyArrow className="h-4 w-4" strokeWidth={2} />
                </a>
              </div>
            </div>
          </ProjectStackCard>
        </div>
      </div>

      {/* Lightbox Dialog for Project Screenshots */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {lightboxShot && (
              <motion.div
                ref={lightboxDialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={lightboxShot.caption}
                tabIndex={-1}
                data-lenis-prevent
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ermia-bg)]/92 p-4 backdrop-blur-xl outline-none sm:p-6"
              >
                <div
                  aria-hidden="true"
                  onClick={handleCloseLightbox}
                  className="absolute inset-0"
                />
                <motion.div
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 0, scale: 0.97 }
                  }
                  transition={{ duration: 0.22, ease: MOTION_EASE.cinematic }}
                  className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] shadow-2xl"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--ermia-border)] px-5 py-3.5">
                    <p className="text-sm font-medium text-[var(--ermia-text)]">
                      {lightboxShot.caption}
                    </p>
                    <button
                      ref={closeLightboxRef}
                      type="button"
                      aria-label="Close preview"
                      onClick={handleCloseLightbox}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div
                    tabIndex={0}
                    data-lenis-prevent
                    className="flex max-h-[76vh] items-center justify-center overflow-auto overscroll-contain bg-[var(--ermia-bg)] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ermia-accent)]"
                  >
                    <div className="overflow-hidden rounded-xl border border-[var(--ermia-border)]">
                      <picture className="block max-h-[70vh] w-auto">
                        {lightboxShot.webpSrc && (
                          <source
                            srcSet={lightboxShot.webpSrc}
                            type="image/webp"
                          />
                        )}
                        <img
                          src={lightboxShot.src}
                          alt={lightboxShot.alt}
                          referrerPolicy="no-referrer"
                          className="max-h-[70vh] w-auto object-contain"
                        />
                      </picture>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
