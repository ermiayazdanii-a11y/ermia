import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import {
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Compass,
  Image as ImageIcon,
  Maximize2,
  Minus,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ErmiaLocaleContent, FlowScreenshot } from '../data/ermiaData';
import { MOTION_EASE, SPRING_CONFIG, ThemeMode } from '../styles/designTokens';
import { ImageReveal } from './ImageReveal';
import { InteractiveProjectCard } from './InteractiveProjectCard';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface ProjectsSectionProps {
  theme: ThemeMode;
  content: ErmiaLocaleContent['projects'];
}

type FlowTab = 'overview' | 'concept' | 'progress' | 'lessons';

export function ProjectsSection({ theme, content }: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState<FlowTab>('overview');
  const [lightboxShot, setLightboxShot] = useState<FlowScreenshot | null>(null);
  const closeLightboxRef = useRef<HTMLButtonElement | null>(null);
  const lastShotTriggerRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const project = content.featured;

  const tabs: { key: FlowTab; label: string }[] = [
    { key: 'overview', label: content.tabs.overview },
    { key: 'concept', label: content.tabs.concept },
    { key: 'progress', label: content.tabs.progress },
    { key: 'lessons', label: content.tabs.lessons },
  ];

  useEffect(() => {
    if (!lightboxShot) return;
    closeLightboxRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxShot(null);
    };
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
      window.removeEventListener('keydown', onKeyDown);
      lastShotTriggerRef.current?.focus();
    };
  }, [lightboxShot, lenis]);

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
      className="border-t border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/70 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl text-balance"
          >
            {content.title}
          </TextReveal>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ermia-text-secondary)] sm:text-base">
            {content.subtitle}
          </p>
        </ScrollReveal>

        {/* Dedicated FLOW Interactive Case Study Card */}
        <ScrollReveal delay={0.08} className="mt-10">
          <InteractiveProjectCard theme={theme}>
            {/* Top Concept & Screenshot Preview + Core Identity Header */}
            <div className="grid grid-cols-1 items-stretch border-b border-[var(--ermia-border)] lg:grid-cols-12">
              <div className="relative flex min-h-[290px] flex-col justify-between overflow-hidden bg-[var(--ermia-bg)] p-6 sm:p-8 lg:col-span-6">
                {project.screenshots.length > 0 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      lastShotTriggerRef.current = e.currentTarget;
                      setLightboxShot(project.screenshots[0]);
                    }}
                    className="group/shot relative h-full min-h-[260px] w-full overflow-hidden rounded-xl border border-[var(--ermia-border)] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                  >
                    <ImageReveal
                      src={project.screenshots[0].src}
                      alt={project.screenshots[0].alt}
                      title={project.title}
                      containerClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/shot:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-t from-[var(--ermia-bg)]/90 via-[var(--ermia-bg)]/50 to-transparent p-4">
                      <p className="text-xs font-medium text-[var(--ermia-accent)]">
                        {project.screenshots[0].caption}
                      </p>
                      <Maximize2 className="h-4 w-4 text-[var(--ermia-text)]" />
                    </div>
                  </button>
                ) : (
                  /* Clearly labelled Concept Architecture Preview + Pending Real Screenshots Note */
                  <div className="relative flex h-full flex-col justify-between">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-20 -right-12 h-56 w-56 rounded-full opacity-80 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(var(--ermia-spotlight-rgb), 0.14) 0%, transparent 70%)',
                      }}
                    />

                    <div className="relative z-10 flex items-center justify-between gap-3 text-xs text-[var(--ermia-muted)]">
                      <span className="font-mono tracking-wider text-[var(--ermia-accent)]">
                        FLOW · {content.stageLabels.conceptual.toUpperCase()}
                      </span>
                      <span className="font-mono tabular-nums">
                        {project.index}
                      </span>
                    </div>

                    {/* Interactive Conceptual Architecture Preview */}
                    <div className="relative z-10 my-5 space-y-2.5">
                      {project.features.map((feat, i) => (
                        <div
                          key={feat.title}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] px-4 py-3 transition-colors duration-200 group-hover:border-[var(--ermia-accent)]/35"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
                              0{i + 1}
                            </span>
                            <span className="truncate font-display text-sm font-medium text-[var(--ermia-text)]">
                              {feat.title}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--ermia-text-secondary)] whitespace-nowrap shrink-0">
                            {renderStageIcon(feat.stage)}
                            <span>{content.stageLabels[feat.stage]}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="relative z-10 border-t border-[var(--ermia-border)] pt-4">
                      <p className="text-xs font-medium text-[var(--ermia-accent)]">
                        {project.status}
                      </p>
                    </div>
                  </div>
                )}
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

                  <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] transition-colors duration-200 group-hover:text-[var(--ermia-accent)] sm:text-4xl">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                    {project.introduction}
                  </p>
                </div>

                {/* Confirmed Tech / Learning Alignment */}
                <div className="mt-8 border-t border-[var(--ermia-border)] pt-5">
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

            {/* Interactive Case Study Tabs */}
            <div className="border-b border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 px-4 py-3 sm:px-8">
              <div
                role="tablist"
                aria-label="FLOW Case Study Sections"
                className="flex items-center gap-1.5 overflow-x-auto"
              >
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative min-h-[38px] rounded-xl px-4 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                        isActive
                          ? 'text-[var(--ermia-accent-contrast)]'
                          : 'text-[var(--ermia-text-secondary)] hover:bg-[var(--ermia-surface)]/75 hover:text-[var(--ermia-text)]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="flow-active-tab"
                          aria-hidden="true"
                          transition={SPRING_CONFIG.tabPill}
                          className="absolute inset-0 rounded-xl bg-[var(--ermia-accent)]"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animated Tab Panels */}
            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -6 }
                  }
                  transition={{ duration: 0.22, ease: MOTION_EASE.cinematic }}
                >
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                      <div className="lg:col-span-5">
                        <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                          {content.purposeLabel}
                        </h4>
                        <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                          {project.purpose}
                        </p>
                      </div>

                      <div className="lg:col-span-7">
                        <h4 className="text-xs font-medium text-[var(--ermia-text-secondary)]">
                          {content.featuresLabel}
                        </h4>
                        <div className="mt-3 divide-y divide-[var(--ermia-border)] rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-5">
                          {project.features.map((feat) => (
                            <div key={feat.title} className="py-4">
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
                  )}

                  {activeTab === 'concept' && (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-6">
                        <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                          {content.conceptLabel}
                        </h4>
                        <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                          {project.mainConcept}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-6">
                        <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                          {content.designLabel}
                        </h4>
                        <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text)]/85 sm:text-base">
                          {project.designDirection}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'progress' && (
                    <div>
                      <h4 className="text-xs font-medium text-[var(--ermia-accent)]">
                        {content.progressLabel}
                      </h4>
                      <div className="mt-4 divide-y divide-[var(--ermia-border)] rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-5">
                        {project.progressSteps.map((step) => (
                          <div
                            key={step.phase}
                            className="flex items-start gap-3.5 py-4"
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
                              <p className="font-display text-sm font-medium text-[var(--ermia-text)] sm:text-base">
                                {step.phase}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                                {step.note}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'lessons' && (
                    <div>
                      <h4 className="font-display text-lg font-medium text-[var(--ermia-text)]">
                        {project.comparisonTitle}
                      </h4>
                      <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[560px] border-collapse text-start">
                          <thead>
                            <tr className="border-b border-[var(--ermia-border)] text-xs font-medium text-[var(--ermia-text-secondary)]">
                              <th className="py-3 pe-4 text-start font-medium">
                                {content.comparisonHeaders.aspect}
                              </th>
                              <th className="py-3 px-4 text-start font-medium text-[var(--ermia-muted)]">
                                {content.comparisonHeaders.earlier}
                              </th>
                              <th className="py-3 ps-4 text-start font-medium text-[var(--ermia-accent)]">
                                {content.comparisonHeaders.flow}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--ermia-border)] text-sm">
                            {project.comparisonRows.map((row) => (
                              <tr key={row.aspect}>
                                <td className="py-4 pe-4 align-top font-medium text-[var(--ermia-text)]">
                                  {row.aspect}
                                </td>
                                <td className="py-4 px-4 align-top text-[var(--ermia-muted)]">
                                  <div className="flex items-start gap-2">
                                    <Minus
                                      className="mt-0.5 h-4 w-4 shrink-0"
                                      strokeWidth={2}
                                    />
                                    <span>{row.earlierExperiments}</span>
                                  </div>
                                </td>
                                <td className="py-4 ps-4 align-top text-[var(--ermia-text)]/90">
                                  <div className="flex items-start gap-2">
                                    <Check
                                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ermia-accent)]"
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
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Screenshot Gallery (supports real uploaded screenshots + honest empty slot) */}
            <div className="border-t border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/55 p-6 sm:p-8">
              <p className="text-xs font-medium text-[var(--ermia-accent)]">
                {content.galleryLabel}
              </p>

              {project.screenshots.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {project.screenshots.map((shot) => (
                    <button
                      key={shot.id}
                      type="button"
                      onClick={(e) => {
                        lastShotTriggerRef.current = e.currentTarget;
                        setLightboxShot(shot);
                      }}
                      className="group/item relative overflow-hidden rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-start transition-colors hover:border-[var(--ermia-accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                    >
                      <ImageReveal
                        src={shot.src}
                        alt={shot.alt}
                        containerClassName={
                          shot.device === 'mobile'
                            ? 'aspect-[9/16] max-h-72 mx-auto'
                            : 'aspect-[16/10]'
                        }
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-[1.03]"
                      />
                      <div className="flex items-center justify-between gap-2 border-t border-[var(--ermia-border)] px-4 py-3 text-xs">
                        <span className="truncate font-medium text-[var(--ermia-text)]">
                          {shot.caption}
                        </span>
                        <Maximize2 className="h-3.5 w-3.5 shrink-0 text-[var(--ermia-muted)] group-hover/item:text-[var(--ermia-accent)]" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex items-start gap-4 rounded-xl border border-dashed border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-accent)]">
                    <ImageIcon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-medium text-[var(--ermia-text)]">
                      {content.galleryEmptyTitle}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                      {content.galleryEmptyBody}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </InteractiveProjectCard>
        </ScrollReveal>

        {/* Honest Future Projects Note */}
        <ScrollReveal
          delay={0.1}
          className="mt-8 rounded-2xl border border-dashed border-[var(--ermia-border-strong)] bg-[var(--ermia-surface)]/80 p-6"
        >
          <p className="text-xs font-medium text-[var(--ermia-accent)]">
            {content.futureNoteTitle}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
            {content.futureNoteBody}
          </p>
        </ScrollReveal>
      </div>

      {/* Lightbox Dialog for Project Screenshots */}
      <AnimatePresence>
        {lightboxShot && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={lightboxShot.caption}
            data-lenis-prevent
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ermia-bg)]/92 p-4 backdrop-blur-xl sm:p-6"
          >
            <div
              aria-hidden="true"
              onClick={() => setLightboxShot(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.97 }}
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
                  onClick={() => setLightboxShot(null)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex max-h-[76vh] items-center justify-center overflow-auto bg-[var(--ermia-bg)] p-4">
                <img
                  src={lightboxShot.src}
                  alt={lightboxShot.alt}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto rounded-lg object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
