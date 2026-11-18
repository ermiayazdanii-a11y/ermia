import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLenis } from 'lenis/react';
import {
  ArrowDown,
  ArrowUpLeft,
  ArrowUpRight,
  Maximize2,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Locale } from '../data/ermiaData';
import {
  FLOW_MEDIA_ASSETS,
  type FlowAppMediaScreen,
  type FlowProductLocaleContent,
} from '../data/flowProductData';
import { MOTION_EASE, type ThemeMode } from '../styles/designTokens';
import type { FlowScreenKey } from '../three/flowPhoneModel';
import { evaluateFlowStoryPose } from '../three/flowStoryKeyframes';
import { FlowPhoneMockup } from './FlowPhoneMockup';

const LazyFlowSpatialCanvas = lazy(() => import('./FlowSpatialCanvas'));

interface FlowScrollStoryStageProps {
  locale: Locale;
  theme: ThemeMode;
  product: FlowProductLocaleContent;
  screens: FlowAppMediaScreen[];
  onInspectScreen: (
    screen: FlowAppMediaScreen,
    triggerEl?: HTMLButtonElement | null
  ) => void;
  onJumpToSandbox: () => void;
  onJumpToGallery: () => void;
  onJumpToDownload: () => void;
}

export function FlowScrollStoryStage({
  locale,
  theme,
  product,
  screens,
  onInspectScreen,
  onJumpToSandbox,
  onJumpToGallery,
  onJumpToDownload,
}: FlowScrollStoryStageProps) {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();
  const isRtl = locale === 'fa';
  const ForwardArrow = isRtl ? ArrowUpLeft : ArrowUpRight;

  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const wakeCanvasRef = useRef<(() => void) | null>(null);

  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactStage, setIsCompactStage] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [manualScreenId, setManualScreenId] = useState<FlowScreenKey | null>(
    null
  );

  const chapters = product.storySection.chapters;
  const currentChapter = chapters[activeChapterIdx] ?? chapters[0];
  const resolvedScreenId = (manualScreenId ??
    currentChapter?.screenId ??
    'today-dashboard') as FlowScreenKey;

  const activeScreen = useMemo(
    () => screens.find((s) => s.id === resolvedScreenId) ?? screens[0],
    [screens, resolvedScreenId]
  );

  useEffect(() => {
    setHasMounted(true);
    if (typeof window === 'undefined') return;
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqCompact = window.matchMedia('(max-width: 1023px)');
    const sync = () => {
      setIsMobile(mqMobile.matches);
      setIsCompactStage(mqCompact.matches);
    };
    sync();
    mqMobile.addEventListener('change', sync);
    mqCompact.addEventListener('change', sync);
    return () => {
      mqMobile.removeEventListener('change', sync);
      mqCompact.removeEventListener('change', sync);
    };
  }, []);

  // Scroll listener mutates progressRef synchronously with zero continuous React re-renders
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafLock = false;
    const updateProgress = () => {
      rafLock = false;
      const container = stageContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportSpan = Math.max(
        1,
        rect.height - window.innerHeight * (isCompactStage ? 0.55 : 0.86)
      );
      const raw = Math.max(0, Math.min(1, -rect.top / viewportSpan));
      const prevRaw = progressRef.current;
      progressRef.current = raw;

      if (Math.abs(raw - prevRaw) > 0.002) {
        setManualScreenId((prev) => (prev !== null ? null : prev));
      }

      wakeCanvasRef.current?.();

      const pose = evaluateFlowStoryPose(raw, {
        isRtl,
        isMobile: isCompactStage,
        isDark: theme === 'dark',
      });
      setActiveChapterIdx((prev) =>
        prev === pose.chapterIndex ? prev : pose.chapterIndex
      );
    };

    const onScroll = () => {
      if (!rafLock) {
        rafLock = true;
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isCompactStage, isRtl, theme]);

  const scrollToChapterIndex = useCallback(
    (idx: number) => {
      const targetEl = chapterRefs.current[idx];
      if (!targetEl) return;
      setManualScreenId(null);
      if (lenis && !prefersReducedMotion) {
        lenis.scrollTo(targetEl, {
          offset: isCompactStage ? -310 : -110,
          duration: 0.9,
        });
      } else {
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    },
    [isCompactStage, lenis, prefersReducedMotion]
  );

  const handleFallback = useCallback(() => {
    setWebglFailed(true);
  }, []);

  const canRenderWebGL =
    hasMounted && !webglFailed && !prefersReducedMotion;

  const isDark = theme === 'dark';

  // Non-backdrop-filter translucent Obsidian / Daylight card surface for high WebGL FPS
  const glassCardSurface = isDark
    ? 'border-white/[0.12] bg-[#0c100c]/[0.90] shadow-[0_24px_64px_-24px_rgba(0,0,0,0.85)]'
    : 'border-black/[0.10] bg-[#f8f9f5]/[0.94] shadow-[0_20px_50px_-24px_rgba(23,27,20,0.22)]';

  return (
    <section
      aria-label={product.hero.appName}
      ref={stageContainerRef}
      className="relative mt-6 pb-8"
    >
      {/* =========================================================
          SINGLE STICKY 3D CANVAS STAGE (Desktop full-viewport, Mobile compact)
         ========================================================= */}
      <div className="sticky top-[4.25rem] z-20 h-[44svh] min-h-[288px] w-full overflow-hidden rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 lg:top-20 lg:z-0 lg:h-[calc(100svh-6rem)] lg:min-h-[580px]">
        {/* Atmospheric studio horizon radial glow (zero filter blur / zero backdrop-filter) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 68% 64% at 62% 46%, rgba(216,241,90,0.09) 0%, rgba(125,211,252,0.04) 44%, rgba(9,12,9,0.92) 100%)'
              : 'radial-gradient(ellipse 68% 64% at 62% 46%, rgba(83,106,0,0.08) 0%, rgba(125,211,252,0.07) 44%, rgba(234,237,223,0.92) 100%)',
          }}
        />

        {/* Hairline Top Rim Highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ermia-glass-edge)] to-transparent"
        />

        {/* WebGL 3D Smartphone Canvas or CSS 3D Hardware Fallback */}
        {canRenderWebGL ? (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center p-4">
                <FlowPhoneMockup
                  screen={activeScreen}
                  theme={theme}
                  size={isMobile ? 'compact' : 'hero'}
                  enable3DTilt={false}
                  priorityLoad
                />
              </div>
            }
          >
            <LazyFlowSpatialCanvas
              progressRef={progressRef}
              manualScreenId={manualScreenId}
              theme={theme}
              isRtl={isRtl}
              isMobile={isMobile}
              isCenteredStage={isCompactStage}
              wakeRef={wakeCanvasRef}
              onFallback={handleFallback}
              onInspectActiveScreen={() => onInspectScreen(activeScreen)}
            />
          </Suspense>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4">
            <FlowPhoneMockup
              screen={activeScreen}
              theme={theme}
              size={isMobile ? 'compact' : 'hero'}
              enable3DTilt={!prefersReducedMotion}
              priorityLoad
              inspectAriaLabel={`${product.screensSection.openFullscreenLabel}: ${activeScreen.screenName}`}
              onInspect={(btn) => onInspectScreen(activeScreen, btn)}
            />
          </div>
        )}

        {/* Top HUD Strip inside 3D Stage (Milestone Jumper + Active Screen Name) */}
        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2 sm:inset-x-5 sm:top-4">
          <div
            className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium ${glassCardSurface}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ermia-accent)]" />
            <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
              {currentChapter.index}
            </span>
            <span className="hidden text-[var(--ermia-text)] sm:inline">
              {activeScreen.screenName}
            </span>
          </div>

          {/* Clickable Milestone Dots / Step Bar */}
          <nav
            aria-label={product.storySection.jumpToChapterAria}
            className={`pointer-events-auto flex items-center gap-1 rounded-full border px-2 py-1 ${glassCardSurface}`}
          >
            {chapters.map((ch, idx) => {
              const active = idx === activeChapterIdx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => scrollToChapterIndex(idx)}
                  aria-label={`${ch.index} · ${ch.title} (${ch.progressPercent}%)`}
                  title={`${ch.title} (${ch.progressPercent}%)`}
                  className={`flex h-6 items-center justify-center rounded-full px-1.5 font-mono text-[10px] tabular-nums transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--ermia-accent)] font-semibold text-[var(--ermia-accent-contrast)]'
                      : 'text-[var(--ermia-text-secondary)] hover:text-[var(--ermia-text)]'
                  }`}
                >
                  {ch.progressPercent}%
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom HUD Action Bar inside Stage */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-4">
          <span className="hidden items-center gap-1.5 rounded-full border border-[var(--ermia-border)] bg-[var(--ermia-bg)]/85 px-3 py-1 font-mono text-[10px] text-[var(--ermia-muted)] lg:inline-flex">
            <Sparkles className="h-3 w-3 text-[var(--ermia-accent)]" />
            <span>{product.storySection.inspect3DHint}</span>
          </span>

          <button
            type="button"
            onClick={(e) => onInspectScreen(activeScreen, e.currentTarget)}
            className={`pointer-events-auto ms-auto inline-flex min-h-[34px] items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${glassCardSurface}`}
          >
            <Maximize2 className="h-3 w-3 text-[var(--ermia-accent)]" />
            <span>{product.storySection.inspectCurrentScreenCta}</span>
          </button>
        </div>

        {/* Bottom mobile mask edge so scrolled cards pass cleanly */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--ermia-bg)]/70 to-transparent lg:hidden"
        />
      </div>

      {/* =========================================================
          REAL DOCUMENT-FLOW STORY CHAPTERS (Zero Overlap, Full SEO & RTL)
         ========================================================= */}
      <div className="relative z-10 mt-6 space-y-6 lg:-mt-[calc(100svh-6rem)] lg:space-y-12 lg:px-6 lg:pb-10 lg:pointer-events-none">
        {/* CHAPTER 00 (0%): PRODUCT HERO HEADER ("Your day. Your space.") */}
        <div
          ref={(el) => {
            chapterRefs.current[0] = el;
          }}
          className="lg:flex lg:min-h-[calc(100svh-7.5rem)] lg:items-center"
        >
          <motion.header
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: MOTION_EASE.cinematic }}
            className={`pointer-events-auto w-full rounded-3xl border p-6 sm:p-8 lg:w-[48%] ${glassCardSurface}`}
          >
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[18px] border border-[var(--ermia-border-strong)] bg-[#0b0e12] shadow-lg sm:h-16 sm:w-16">
                <picture className="block h-full w-full">
                  <source
                    srcSet={FLOW_MEDIA_ASSETS.icon.webpSrc}
                    type="image/webp"
                  />
                  <img
                    src={FLOW_MEDIA_ASSETS.icon.src}
                    alt={
                      locale === 'fa'
                        ? FLOW_MEDIA_ASSETS.icon.altFa
                        : FLOW_MEDIA_ASSETS.icon.altEn
                    }
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </picture>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--ermia-accent)]">
                  <Smartphone className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>{product.hero.platformTag}</span>
                </div>
                <p className="font-display text-xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-2xl">
                  {product.hero.appName}
                </p>
              </div>
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.15rem,4.4vw,3.65rem)] font-semibold leading-[1.05] tracking-tight text-[var(--ermia-text)] text-balance">
              {product.hero.headline}
            </h1>

            <p className="mt-3.5 font-display text-base font-medium leading-snug text-[var(--ermia-text)]/90 sm:text-lg">
              {product.hero.subtitle}
            </p>

            <p className="mt-3 text-sm leading-[1.8] text-[var(--ermia-text-secondary)]">
              {product.hero.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onJumpToGallery}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--ermia-accent)] px-5 py-2 text-xs font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 shadow-[0_12px_28px_-12px_rgba(var(--ermia-spotlight-rgb),0.45)] transition-colors duration-150 hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer sm:text-sm"
              >
                <span>{product.hero.primaryShowcaseCta}</span>
                <ForwardArrow className="h-4 w-4" strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={onJumpToSandbox}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-surface)] px-4 py-2 text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer sm:text-sm"
              >
                <span>{product.hero.secondaryDemoCta}</span>
              </button>

              <button
                type="button"
                onClick={onJumpToDownload}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-3.5 py-2 text-xs font-medium text-[var(--ermia-text-secondary)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
              >
                <span>{product.downloadSection.kicker}</span>
              </button>
            </div>

            {/* Interactive Screen Selector driving 3D Hardware OLED Screen */}
            <div className="mt-6 border-t border-[var(--ermia-border)] pt-4">
              <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--ermia-muted)]">
                <span>{product.hero.inspectScreensLabel}</span>
                <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                  {product.hero.screensCountLabel}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {screens.map((scr, idx) => {
                  const selected = scr.id === activeScreen.id;
                  return (
                    <button
                      key={scr.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setManualScreenId(scr.id as FlowScreenKey);
                        wakeCanvasRef.current?.();
                      }}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        selected
                          ? 'border-[var(--ermia-accent)] bg-[var(--ermia-accent)]/14 text-[var(--ermia-accent)]'
                          : 'border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-text-secondary)] hover:border-[var(--ermia-border-strong)] hover:text-[var(--ermia-text)]'
                      }`}
                    >
                      <span className="font-mono text-[10px] tabular-nums opacity-75">
                        0{idx + 1}
                      </span>
                      <span>{scr.screenName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 flex items-center gap-2 font-mono text-[11px] text-[var(--ermia-muted)]">
              <ArrowDown className="h-3.5 w-3.5 text-[var(--ermia-accent)]" />
              <span>{product.storySection.scrollHint}</span>
            </p>
          </motion.header>
        </div>

        {/* CHAPTERS 01..07 (15%..100%): Alternating Start / End / Center cards paired with 3D pose */}
        {chapters.slice(1).map((ch, sliceIdx) => {
          const idx = sliceIdx + 1;
          // Alternating alignment opposite 3D smartphone horizontal trajectory:
          // 01 (15%): Phone End -> Card Start
          // 02 (30%): Phone Start -> Card End
          // 03 (45%): Phone End -> Card Start
          // 04 (60%): Phone Start -> Card End
          // 05 (75%): Phone End -> Card Start
          // 06 (90%) & 07 (100%): Centered transition beneath/below centered hero phone
          const isEndAligned = idx === 2 || idx === 4;
          const isCenterFinal = idx >= 6;
          const visiblePanels = isMobile
            ? ch.floatingPanels.slice(0, 1)
            : ch.floatingPanels;

          return (
            <div
              key={ch.id}
              ref={(el) => {
                chapterRefs.current[idx] = el;
              }}
              className={`lg:flex lg:items-center ${
                isCenterFinal
                  ? 'lg:min-h-[36vh] lg:justify-center'
                  : 'lg:min-h-[54vh]'
              }`}
            >
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, ease: MOTION_EASE.cinematic }}
                className={`pointer-events-auto w-full rounded-3xl border p-5 sm:p-7 ${glassCardSurface} ${
                  isCenterFinal
                    ? 'lg:mx-auto lg:max-w-2xl lg:text-center'
                    : isEndAligned
                      ? 'lg:ms-auto lg:w-[44%]'
                      : 'lg:w-[44%]'
                }`}
              >
                <div
                  className={`flex flex-wrap items-center gap-2 text-xs ${
                    isCenterFinal ? 'lg:justify-center' : 'justify-between'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-[var(--ermia-accent)]">
                    <span className="tabular-nums">{ch.index}</span>
                    <span aria-hidden="true" className="text-[var(--ermia-muted)]">
                      ·
                    </span>
                    <span>{ch.progressPercent}%</span>
                  </div>
                  <span className="rounded-lg border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--ermia-text-secondary)]">
                    {ch.statusTag}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)]">
                  {ch.title}
                </h2>
                <p className="mt-1 font-mono text-xs text-[var(--ermia-accent)]">
                  {ch.subtitle}
                </p>
                <p className="mt-3 text-sm leading-[1.8] text-[var(--ermia-text-secondary)]">
                  {ch.description}
                </p>

                {visiblePanels.length > 0 && (
                  <div
                    className={`mt-5 grid gap-2.5 ${
                      visiblePanels.length > 1
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1'
                    }`}
                  >
                    {visiblePanels.map((panel) => (
                      <div
                        key={panel.eyebrow}
                        className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)]/85 p-3.5 text-start"
                      >
                        <p className="font-mono text-[10px] tracking-wider text-[var(--ermia-accent)]">
                          {panel.eyebrow}
                        </p>
                        <p className="mt-1 font-display text-sm font-medium text-[var(--ermia-text)]">
                          {panel.value}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--ermia-muted)]">
                          {panel.meta}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {idx === chapters.length - 1 && (
                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={onJumpToDownload}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--ermia-accent)] px-6 py-2.5 text-xs font-semibold text-[var(--ermia-accent-contrast)] transition-colors hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer sm:text-sm"
                    >
                      <span>{product.storySection.releaseTransitionCta}</span>
                      <ArrowDown className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
