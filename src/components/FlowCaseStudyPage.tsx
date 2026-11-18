import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLenis } from 'lenis/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Github,
  Layers,
  X,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ErmiaLocaleContent, Locale } from '../data/ermiaData';
import {
  FLOW_PRODUCT_CONTENT,
  FLOW_SCREENS_BY_LOCALE,
  FlowAppMediaScreen,
  FlowFeatureModule,
  FlowFeatureStatus,
} from '../data/flowProductData';
import { useModalFocusTrap } from '../hooks/useModalFocusTrap';
import { MOTION_EASE, ThemeMode } from '../styles/designTokens';
import { FlowDownloadCenter } from './FlowDownloadCenter';
import { FlowInteractiveDemo } from './FlowInteractiveDemo';
import { FlowPhoneMockup } from './FlowPhoneMockup';
import { FlowScreenshotGallery } from './FlowScreenshotGallery';
import { FlowScrollStoryStage } from './FlowScrollStoryStage';
import { InteractiveProjectCard } from './InteractiveProjectCard';
import { SectionTransition } from './SectionTransition';

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
  const lenis = useLenis();
  const study = projectsContent.caseStudyPage;
  const project = projectsContent.featured;
  const product = FLOW_PRODUCT_CONTENT[locale];
  const screens = FLOW_SCREENS_BY_LOCALE[locale];

  const [activeModuleId, setActiveModuleId] = useState(
    product.modules[0]?.id ?? 'dashboard'
  );
  const [galleryScreenId, setGalleryScreenId] = useState(
    screens[0]?.id ?? 'today-dashboard'
  );
  const [lightboxScreen, setLightboxScreen] =
    useState<FlowAppMediaScreen | null>(null);

  const lightboxDialogRef = useRef<HTMLDivElement | null>(null);
  const closeLightboxRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const downloadSectionRef = useRef<HTMLDivElement | null>(null);
  const demoSectionRef = useRef<HTMLDivElement | null>(null);
  const gallerySectionRef = useRef<HTMLElement | null>(null);
  const moduleItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const manualModuleLockUntilRef = useRef(0);

  const isRtl = locale === 'fa';
  const homeHref = isRtl ? '/fa/' : '/';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRtl ? ArrowUpLeft : ArrowUpRight;
  const PrevLightboxIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextLightboxIcon = isRtl ? ChevronLeft : ChevronRight;

  // Desktop scroll-linked Explore FLOW storytelling via IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < manualModuleLockUntilRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const rawId = entry.target.getAttribute('data-module-id');
            const matched = product.modules.find((m) => m.id === rawId);
            if (matched) setActiveModuleId(matched.id as FlowFeatureModule['id']);
          }
        }
      },
      {
        rootMargin: '-34% 0px -46% 0px',
        threshold: 0.15,
      }
    );

    for (const mod of product.modules) {
      const el = moduleItemRefs.current[mod.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [product.modules]);

  const activeModule = useMemo(
    () =>
      product.modules.find((m) => m.id === activeModuleId) ??
      product.modules[0],
    [product.modules, activeModuleId]
  );

  const activeModuleScreen = useMemo(() => {
    if (!activeModule?.screenId) return null;
    return screens.find((s) => s.id === activeModule.screenId) ?? null;
  }, [activeModule, screens]);

  const lightboxIndex = useMemo(() => {
    if (!lightboxScreen) return -1;
    return screens.findIndex((s) => s.id === lightboxScreen.id);
  }, [lightboxScreen, screens]);

  const stepLightbox = useCallback(
    (delta: -1 | 1) => {
      if (screens.length === 0) return;
      const curr = lightboxIndex >= 0 ? lightboxIndex : 0;
      const next = (curr + delta + screens.length) % screens.length;
      setLightboxScreen(screens[next]);
    },
    [lightboxIndex, screens]
  );

  const handleCloseLightbox = useCallback(() => {
    setLightboxScreen(null);
  }, []);

  useEffect(() => {
    if (!lightboxScreen) return;
    const onArrowKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepLightbox(isRtl ? -1 : 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepLightbox(isRtl ? 1 : -1);
      }
    };
    window.addEventListener('keydown', onArrowKey);
    return () => window.removeEventListener('keydown', onArrowKey);
  }, [lightboxScreen, isRtl, stepLightbox]);

  useModalFocusTrap({
    isOpen: Boolean(lightboxScreen),
    dialogRef: lightboxDialogRef,
    initialFocusRef: closeLightboxRef,
    triggerRef: lastTriggerRef,
    onClose: handleCloseLightbox,
    lenis,
  });

  const scrollToSectionElement = (el: HTMLElement | null) => {
    if (!el) return;
    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(el, { offset: -88, duration: 0.9 });
    } else {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const renderStatusIcon = (status: FlowFeatureStatus) => {
    if (status === 'available') {
      return (
        <CheckCircle2
          className="h-3.5 w-3.5 shrink-0 text-[var(--ermia-accent)]"
          strokeWidth={2}
        />
      );
    }
    if (status === 'in_development') {
      return (
        <Clock3
          className="h-3.5 w-3.5 shrink-0 text-[var(--ermia-text-secondary)]"
          strokeWidth={1.75}
        />
      );
    }
    return (
      <Compass
        className="h-3.5 w-3.5 shrink-0 text-[var(--ermia-muted)]"
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

      {/* =========================================================
          1 & 2. REAL 3D PRODUCT HERO + 0%–100% SCROLL STORY STAGE
         ========================================================= */}
      <FlowScrollStoryStage
        locale={locale}
        theme={theme}
        product={product}
        screens={screens}
        onInspectScreen={(screen, btn) => {
          if (btn) lastTriggerRef.current = btn;
          setLightboxScreen(screen);
        }}
        onJumpToSandbox={() => scrollToSectionElement(demoSectionRef.current)}
        onJumpToGallery={() => scrollToSectionElement(gallerySectionRef.current)}
        onJumpToDownload={() => scrollToSectionElement(downloadSectionRef.current)}
      />

      <div className="my-10">
        <SectionTransition indexLabel="01" sectionLabel={product.downloadSection.kicker} />
      </div>

      {/* =========================================================
          100% SCROLL TARGET: RELEASE & DISTRIBUTION CENTER
         ========================================================= */}
      <div ref={downloadSectionRef}>
        <FlowDownloadCenter
          locale={locale}
          copy={product.downloadSection}
          onNavigateContact={() => onNavigateHome('contact')}
        />
      </div>

      <div className="my-12">
        <SectionTransition indexLabel="02" sectionLabel={product.modulesSection.kicker} />
      </div>

      {/* =========================================================
          2. EXPLORE FLOW — 7 MODULES + DESKTOP SCROLL STORYTELLING
         ========================================================= */}
      <section aria-labelledby="flow-modules-heading">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
            <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
              01
            </span>
            <span aria-hidden="true" className="text-[var(--ermia-muted)]">
              ·
            </span>
            <span>{product.modulesSection.kicker}</span>
          </div>
          <h2
            id="flow-modules-heading"
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl text-balance"
          >
            {product.modulesSection.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
            {product.modulesSection.subtitle}
          </p>
          <p className="mt-2 text-xs text-[var(--ermia-muted)]">
            {product.modulesSection.scrollSyncHint}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Interactive List of All 7 Feature Modules */}
          <div className="space-y-3 lg:col-span-5">
            {product.modules.map((mod) => {
              const isSelected = mod.id === activeModule.id;
              return (
                <button
                  key={mod.id}
                  ref={(el) => {
                    moduleItemRefs.current[mod.id] = el;
                  }}
                  data-module-id={mod.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    manualModuleLockUntilRef.current = Date.now() + 900;
                    setActiveModuleId(mod.id);
                  }}
                  className={`flex w-full flex-col gap-2 rounded-2xl border p-4 text-start transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] sm:p-5 cursor-pointer ${
                    isSelected
                      ? 'border-[var(--ermia-accent)] bg-[var(--ermia-surface)] shadow-sm'
                      : 'border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/65 hover:border-[var(--ermia-accent)]/45 hover:bg-[var(--ermia-surface)]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-3 text-xs">
                    <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                      {mod.index}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0">
                      {renderStatusIcon(mod.status)}
                      <span>{product.statusLabels[mod.status]}</span>
                    </span>
                  </div>
                  <p className="font-display text-lg font-medium text-[var(--ermia-text)]">
                    {mod.title}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--ermia-text-secondary)]">
                    {mod.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Sticky Module Detail + Real App Frame Panel */}
          <div className="lg:sticky lg:top-24 lg:col-span-7">
            <div className="rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeModule.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -6 }
                  }
                  transition={{ duration: 0.24, ease: MOTION_EASE.cinematic }}
                  className="grid grid-cols-1 items-center gap-8 md:grid-cols-12"
                >
                  <div className="space-y-4 md:col-span-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--ermia-accent)]">
                      <span className="font-mono tabular-nums">
                        {activeModule.index}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1.5 text-[var(--ermia-text)]">
                        {renderStatusIcon(activeModule.status)}
                        <span>{product.statusLabels[activeModule.status]}</span>
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)]">
                      {activeModule.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
                      {activeModule.summary}
                    </p>

                    <ul className="space-y-2.5 border-t border-[var(--ermia-border)] pt-4">
                      {activeModule.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ermia-text)]/88 sm:text-sm"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ermia-accent)]"
                          />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {activeModuleScreen && (
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryScreenId(activeModuleScreen.id);
                          scrollToSectionElement(gallerySectionRef.current);
                        }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                      >
                        <span>{product.modulesSection.inspectScreenCta}</span>
                        <ForwardArrow className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center md:col-span-6">
                    {activeModuleScreen ? (
                      <FlowPhoneMockup
                        screen={activeModuleScreen}
                        theme={theme}
                        size="compact"
                        enable3DTilt={false}
                        inspectAriaLabel={`${product.screensSection.openFullscreenLabel}: ${activeModuleScreen.screenName}`}
                        onInspect={(btn) => {
                          lastTriggerRef.current = btn;
                          setLightboxScreen(activeModuleScreen);
                        }}
                      />
                    ) : (
                      <div className="flex aspect-[1080/2460] w-[228px] flex-col items-center justify-center rounded-[32px] border border-dashed border-[var(--ermia-border-strong)] bg-[var(--ermia-bg)] p-6 text-center sm:w-[252px]">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-accent)]">
                          <Layers className="h-5 w-5" strokeWidth={1.75} />
                        </div>
                        <p className="font-display text-base font-medium text-[var(--ermia-text)]">
                          {activeModule.title}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-[var(--ermia-muted)]">
                          {product.modulesSection.noScreenshotNote}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <div className="my-12">
        <SectionTransition indexLabel="03" sectionLabel={product.demo.kicker} />
      </div>

      {/* =========================================================
          4. INTERACTIVE WEB SANDBOX DEMO
         ========================================================= */}
      <div ref={demoSectionRef}>
        <FlowInteractiveDemo
          locale={locale}
          copy={product.demo}
          onJumpToRealScreen={(screenId) => {
            setGalleryScreenId(screenId);
            scrollToSectionElement(gallerySectionRef.current);
          }}
        />
      </div>

      <div className="my-12">
        <SectionTransition indexLabel="04" sectionLabel={product.screensSection.kicker} />
      </div>

      {/* =========================================================
          5. INTERACTIVE SCREENSHOT GALLERY
         ========================================================= */}
      <section
        ref={gallerySectionRef}
        id="flow-screenshot-gallery"
        aria-labelledby="flow-gallery-heading"
        className="scroll-mt-24 py-4"
      >
        <div className="mb-8 max-w-3xl">
          <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
            <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
              04
            </span>
            <span aria-hidden="true" className="text-[var(--ermia-muted)]">
              ·
            </span>
            <span>{product.screensSection.kicker}</span>
          </div>
          <h2
            id="flow-gallery-heading"
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl text-balance"
          >
            {product.screensSection.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
            {product.screensSection.subtitle}
          </p>
        </div>

        <FlowScreenshotGallery
          locale={locale}
          theme={theme}
          screens={screens}
          activeScreenId={galleryScreenId}
          onSelectScreen={setGalleryScreenId}
          onOpenLightbox={(screen, btn) => {
            lastTriggerRef.current = btn;
            setLightboxScreen(screen);
          }}
          copy={product.screensSection}
        />
      </section>

      <div className="my-12">
        <SectionTransition indexLabel="05" sectionLabel={study.designPrinciplesHeading} />
      </div>

      {/* =========================================================
          DESIGN RESTRAINT & TECHNICAL LEARNING CONTEXT
         ========================================================= */}
      <section aria-labelledby="flow-principles-heading" className="py-4">
        <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
          05 · {study.designPrinciplesHeading}
        </span>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
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
      </section>

      {/* Return Footer */}
      <footer className="mt-16 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8">
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

      {/* Accessible Fullscreen Screenshot Lightbox Dialog */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {lightboxScreen && (
              <motion.div
                ref={lightboxDialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={lightboxScreen.screenName}
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
                  className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] shadow-2xl"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[var(--ermia-border)] px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-[var(--ermia-text)]">
                        {lightboxScreen.screenName}
                      </p>
                      <p className="text-xs text-[var(--ermia-muted)]">
                        {lightboxScreen.screenSubtitle} · 0{Math.max(0, lightboxIndex) + 1} / 0{screens.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={product.screensSection.previousLabel}
                        onClick={() => stepLightbox(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                      >
                        <PrevLightboxIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={product.screensSection.nextLabel}
                        onClick={() => stepLightbox(1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                      >
                        <NextLightboxIcon className="h-4 w-4" />
                      </button>
                      <button
                        ref={closeLightboxRef}
                        type="button"
                        aria-label="Close preview"
                        onClick={handleCloseLightbox}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div
                    tabIndex={0}
                    data-lenis-prevent
                    className="flex max-h-[78vh] items-center justify-center overflow-auto overscroll-contain bg-[#090d12] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ermia-accent)] sm:p-6"
                  >
                    <picture className="block max-h-[72vh] w-auto">
                      <source
                        srcSet={lightboxScreen.webpSrc}
                        type="image/webp"
                      />
                      <img
                        src={lightboxScreen.src}
                        alt={lightboxScreen.alt}
                        referrerPolicy="no-referrer"
                        className="max-h-[72vh] w-auto rounded-2xl border border-white/15 object-contain"
                      />
                    </picture>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </article>
  );
}

export default FlowCaseStudyPage;
