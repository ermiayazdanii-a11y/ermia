import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Compass,
  Github,
  Layers,
  Minus,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ErmiaLocaleContent, Locale } from '../data/ermiaData';
import { MOTION_EASE, ThemeMode } from '../styles/designTokens';
import { CrtDigitalPreview } from './CrtDigitalPreview';
import { InteractiveProjectCard } from './InteractiveProjectCard';

interface FlowCaseStudyPageProps {
  locale: Locale;
  theme: ThemeMode;
  projectsContent: ErmiaLocaleContent['projects'];
  navContent: ErmiaLocaleContent['nav'];
  onNavigateHome: (sectionId?: string) => void;
}

export function FlowCaseStudyPage({
  locale,
  theme,
  projectsContent,
  navContent,
  onNavigateHome,
}: FlowCaseStudyPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const study = projectsContent.caseStudyPage;
  const project = projectsContent.featured;
  const [selectedLayerIdx, setSelectedLayerIdx] = useState(0);
  const activeLayer = study.layers[selectedLayerIdx] ?? study.layers[0];

  const homeHref = locale === 'fa' ? '/fa/' : '/';
  const BackIcon = locale === 'fa' ? ArrowRight : ArrowLeft;
  const ForwardArrow = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

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
    <article className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 sm:pt-32">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs text-[var(--ermia-text-secondary)]"
      >
        <a
          href={homeHref}
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome('projects');
          }}
          className="inline-flex min-h-[36px] items-center gap-1.5 font-medium text-[var(--ermia-text)] transition-colors hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
        >
          <BackIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>{study.backToPortfolio}</span>
        </a>
        <span aria-hidden="true" className="text-[var(--ermia-muted)]">
          ·
        </span>
        <span className="text-[var(--ermia-accent)]">
          {study.breadcrumbCurrent}
        </span>
      </nav>

      {/* Editorial Hero Header */}
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: MOTION_EASE.cinematic }}
        className="mt-8 border-b border-[var(--ermia-border)] pb-12"
      >
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
          <Layers className="h-4 w-4" strokeWidth={1.75} />
          <span>{study.pageKicker}</span>
          <span aria-hidden="true" className="text-[var(--ermia-muted)]">
            ·
          </span>
          <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
            {projectsContent.devStateBadge}
          </span>
        </div>

        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-[var(--ermia-text)] text-balance">
          {study.pageTitle}
        </h1>

        <p className="mt-5 max-w-3xl text-sm leading-[1.85] text-[var(--ermia-text-secondary)] sm:text-base">
          {study.pageLead}
        </p>

        {/* Honest Summary Facts Strip */}
        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--ermia-border)] pt-7 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[var(--ermia-muted)]">
              {projectsContent.purposeLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--ermia-text)]">
              {project.purpose}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--ermia-muted)]">
              {projectsContent.conceptLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--ermia-text)]">
              {project.mainConcept}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--ermia-muted)]">
              {projectsContent.designLabel}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--ermia-text)]">
              {project.designDirection}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Section 01: Interactive 3-Layer Daily Flow Architecture */}
      <section aria-labelledby="flow-arch-heading" className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
              01 · ARCHITECTURE
            </span>
            <h2
              id="flow-arch-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl"
            >
              {study.architectureHeading}
            </h2>
          </div>
          <p className="text-xs text-[var(--ermia-text-secondary)]">
            {projectsContent.conceptLayerHint}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            {study.layers.map((layer, idx) => {
              const active = idx === selectedLayerIdx;
              return (
                <button
                  key={layer.number}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedLayerIdx(idx)}
                  className={`flex w-full flex-col gap-2 rounded-2xl border p-5 text-start transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                    active
                      ? 'border-[var(--ermia-accent)] bg-[var(--ermia-surface)] shadow-sm'
                      : 'border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/65 hover:border-[var(--ermia-accent)]/40 hover:bg-[var(--ermia-surface)]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2 text-xs">
                    <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                      {layer.number} · {layer.role}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[var(--ermia-text-secondary)] whitespace-nowrap shrink-0">
                      {renderStageIcon(layer.stage)}
                      <span>{projectsContent.stageLabels[layer.stage]}</span>
                    </span>
                  </div>
                  <p className="font-display text-lg font-medium text-[var(--ermia-text)]">
                    {layer.name}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <CrtDigitalPreview className="h-full rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ermia-border)] pb-4 text-xs">
                <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                  LAYER {activeLayer.number} · {activeLayer.role}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ermia-text-secondary)]">
                  {renderStageIcon(activeLayer.stage)}
                  <span>{projectsContent.stageLabels[activeLayer.stage]}</span>
                </span>
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)]">
                {activeLayer.name}
              </h3>
              <p className="mt-3 text-sm leading-[1.85] text-[var(--ermia-text-secondary)] sm:text-base">
                {activeLayer.summary}
              </p>

              <ul className="mt-6 space-y-3 border-t border-[var(--ermia-border)] pt-5">
                {activeLayer.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start gap-3 text-xs leading-relaxed text-[var(--ermia-text)]/90 sm:text-sm"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ermia-accent)]"
                      strokeWidth={2}
                    />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CrtDigitalPreview>
          </div>
        </div>
      </section>

      {/* Section 02: Design Restraint & Technical Study Alignment */}
      <section aria-labelledby="flow-principles-heading" className="mt-20">
        <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
          02 · DESIGN & DISCIPLINE
        </span>
        <h2
          id="flow-principles-heading"
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl"
        >
          {study.designPrinciplesHeading}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {study.designPrinciples.map((principle) => (
            <InteractiveProjectCard
              key={principle.title}
              theme={theme}
              enableTilt={false}
              className="h-full p-6"
            >
              <h3 className="font-display text-lg font-medium text-[var(--ermia-text)]">
                {principle.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
                {principle.body}
              </p>
            </InteractiveProjectCard>
          ))}
        </div>
      </section>

      {/* Section 03: Honest Progress, Python Stack & Past Experiments Comparison */}
      <section aria-labelledby="flow-progress-heading" className="mt-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="flow-progress-heading"
              className="font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)]"
            >
              {projectsContent.progressLabel}
            </h2>
            <div className="mt-5 divide-y divide-[var(--ermia-border)] rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] px-5">
              {project.progressSteps.map((step) => (
                <div key={step.phase} className="flex items-start gap-3 py-4">
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
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)]">
              {project.comparisonTitle}
            </h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-5">
              <table className="w-full min-w-[480px] border-collapse text-start">
                <thead>
                  <tr className="border-b border-[var(--ermia-border)] text-xs font-medium text-[var(--ermia-text-secondary)]">
                    <th className="py-2.5 pe-4 text-start font-medium">
                      {projectsContent.comparisonHeaders.aspect}
                    </th>
                    <th className="py-2.5 px-3 text-start font-medium text-[var(--ermia-muted)]">
                      {projectsContent.comparisonHeaders.earlier}
                    </th>
                    <th className="py-2.5 ps-3 text-start font-medium text-[var(--ermia-accent)]">
                      {projectsContent.comparisonHeaders.flow}
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

            {/* Study Alignment */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {project.technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-4"
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
      </section>

      {/* Honest Release Status & Return Footer */}
      <footer className="mt-20 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[var(--ermia-accent)]">
              {study.statusNoteTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
              {study.statusNoteBody}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-4 py-2 text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)]"
            >
              <Github className="h-4 w-4 text-[var(--ermia-accent)]" />
              <span>{navContent.projects} · GitHub</span>
            </a>

            <a
              href={`${homeHref}#journal`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome('journal');
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--ermia-accent)] px-5 py-2 text-xs font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 transition-colors hover:bg-[var(--ermia-accent-hover)]"
            >
              <span>{study.nextChapterCta}</span>
              <ForwardArrow className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default FlowCaseStudyPage;
