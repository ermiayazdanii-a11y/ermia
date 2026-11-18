import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Smartphone } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Locale } from '../data/ermiaData';
import type {
  FlowAppMediaScreen,
  FlowProductLocaleContent,
} from '../data/flowProductData';
import { MOTION_EASE, ThemeMode } from '../styles/designTokens';
import { FlowPhoneMockup } from './FlowPhoneMockup';

interface FlowScreenshotGalleryProps {
  locale: Locale;
  theme: ThemeMode;
  screens: FlowAppMediaScreen[];
  activeScreenId: string;
  onSelectScreen: (screenId: string) => void;
  onOpenLightbox: (
    screen: FlowAppMediaScreen,
    triggerEl: HTMLButtonElement
  ) => void;
  copy: FlowProductLocaleContent['screensSection'];
}

export function FlowScreenshotGallery({
  locale,
  theme,
  screens,
  activeScreenId,
  onSelectScreen,
  onOpenLightbox,
  copy,
}: FlowScreenshotGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const isRtl = locale === 'fa';
  const mobileRailRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const pointerDragRef = useRef<{ startX: number; active: boolean } | null>(
    null
  );

  const activeIndex = Math.max(
    0,
    screens.findIndex((s) => s.id === activeScreenId)
  );
  const activeScreen = screens[activeIndex] ?? screens[0];

  const goStep = (delta: -1 | 1) => {
    const nextIdx = (activeIndex + delta + screens.length) % screens.length;
    onSelectScreen(screens[nextIdx].id);
  };

  const handleSelectorKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = isRtl
        ? (idx - 1 + screens.length) % screens.length
        : (idx + 1) % screens.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = isRtl
        ? (idx + 1) % screens.length
        : (idx - 1 + screens.length) % screens.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = screens.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      tabRefs.current[nextIdx]?.focus();
      onSelectScreen(screens[nextIdx].id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const diff = endX - touchStartX;
    setTouchStartX(null);
    if (Math.abs(diff) < 42) return;
    if (diff < 0) {
      goStep(isRtl ? -1 : 1);
    } else {
      goStep(isRtl ? 1 : -1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    pointerDragRef.current = { startX: e.clientX, active: true };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerDragRef.current?.active) return;
    const diff = e.clientX - pointerDragRef.current.startX;
    pointerDragRef.current = null;
    if (Math.abs(diff) < 42) return;
    if (diff < 0) {
      goStep(isRtl ? -1 : 1);
    } else {
      goStep(isRtl ? 1 : -1);
    }
  };

  const handlePointerCancel = () => {
    pointerDragRef.current = null;
  };

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-8">
      {/* Desktop & Tablet Interactive Device Stage */}
      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-5 sm:p-8 lg:grid-cols-12 lg:p-10">
        {/* Left/Start: 3D Smartphone Stage with Pointer Drag & Touch Swipe Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="flex flex-col items-center justify-center select-none lg:col-span-5 lg:cursor-grab lg:active:cursor-grabbing"
        >
          <FlowPhoneMockup
            screen={activeScreen}
            theme={theme}
            size="showcase"
            inspectAriaLabel={`${copy.openFullscreenLabel}: ${activeScreen.screenName}`}
            onInspect={(btn) => onOpenLightbox(activeScreen, btn)}
          />

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => goStep(-1)}
              aria-label={copy.previousLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
            >
              <PrevIcon className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <span className="min-w-[64px] text-center font-mono text-xs tabular-nums text-[var(--ermia-text-secondary)]">
              0{activeIndex + 1} / 0{screens.length}
            </span>

            <button
              type="button"
              onClick={() => goStep(1)}
              aria-label={copy.nextLabel}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
            >
              <NextIcon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <p className="mt-2.5 text-center text-[11px] text-[var(--ermia-muted)]">
            {copy.dragOrSwipeHint}
          </p>
        </div>

        {/* Right/End: Screen Narrative + Interactive Selector Rail */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeScreen.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.24, ease: MOTION_EASE.cinematic }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="inline-flex items-center gap-2 font-mono text-[var(--ermia-accent)]">
                  <Smartphone className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>
                    0{activeIndex + 1} · {activeScreen.screenSubtitle}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => onOpenLightbox(activeScreen, e.currentTarget)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-3 py-1 text-xs font-medium text-[var(--ermia-text-secondary)] whitespace-nowrap shrink-0 transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                >
                  <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  <span>{copy.openFullscreenLabel}</span>
                </button>
              </div>

              <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl">
                {activeScreen.screenName}
              </h3>

              <div className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-5">
                <p className="text-xs font-medium text-[var(--ermia-accent)]">
                  {copy.detailsHeading}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {activeScreen.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ermia-accent)]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Screen Thumbnail Strip (Swipeable Snap on Mobile, 4-Column Grid on Desktop) */}
          <div
            ref={mobileRailRef}
            aria-label="FLOW App Screens"
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible"
          >
            {screens.map((screen, idx) => {
              const isSelected = screen.id === activeScreen.id;
              return (
                <button
                  key={screen.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectScreen(screen.id)}
                  onKeyDown={(e) => handleSelectorKeyDown(e, idx)}
                  className={`group flex min-w-[144px] snap-start flex-col overflow-hidden rounded-2xl border p-2 text-start transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] sm:min-w-0 cursor-pointer ${
                    isSelected
                      ? 'border-[var(--ermia-accent)] bg-[var(--ermia-bg)] shadow-sm'
                      : 'border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/70 hover:border-[var(--ermia-accent)]/45 hover:bg-[var(--ermia-bg)]'
                  }`}
                >
                  <div className="mx-auto aspect-[1080/2460] w-20 overflow-hidden rounded-xl border border-white/10 bg-[#0c141d] sm:w-full sm:max-w-[92px]">
                    <picture className="block h-full w-full">
                      <source srcSet={screen.webpSrc} type="image/webp" />
                      <img
                        src={screen.src}
                        alt={screen.screenName}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </picture>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-1.5 px-1">
                    <span className="truncate text-xs font-medium text-[var(--ermia-text)]">
                      {screen.screenName}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-[var(--ermia-accent)] shrink-0">
                      0{idx + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
