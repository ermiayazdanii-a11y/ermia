import { CheckCircle2, Clock3, Compass, Layers } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ErmiaLocaleContent, FlowScreenshot } from '../data/ermiaData';
import { MOTION_EASE } from '../styles/designTokens';
import { ImageReveal } from './ImageReveal';

export interface ShowcaseLayerItem {
  number: string;
  name: string;
  stage: 'implemented' | 'planned' | 'conceptual';
  role: string;
  summary: string;
  details?: string[];
}

interface FlowDeviceShowcaseProps {
  activeLayer: ShowcaseLayerItem;
  stageLabels: ErmiaLocaleContent['projects']['stageLabels'];
  conceptPreviewLabel: string;
  screenshots?: FlowScreenshot[];
  onOpenScreenshot?: (
    shot: FlowScreenshot,
    triggerEl: HTMLButtonElement
  ) => void;
  variant?: 'compact' | 'sticky';
}

export function FlowDeviceShowcase({
  activeLayer,
  stageLabels,
  conceptPreviewLabel,
  screenshots = [],
  onOpenScreenshot,
  variant = 'sticky',
}: FlowDeviceShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();

  const renderStageIcon = (stage: ShowcaseLayerItem['stage']) => {
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

  if (screenshots.length > 0) {
    const shot = screenshots[0];
    const isMobileCapture = shot.device === 'mobile';
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-surface)] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--ermia-border-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ermia-border-strong)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--ermia-accent)]" />
          </div>
          <span className="truncate font-mono text-[11px] text-[var(--ermia-text-secondary)]">
            {shot.caption}
          </span>
        </div>

        {onOpenScreenshot ? (
          <button
            type="button"
            onClick={(e) => onOpenScreenshot(shot, e.currentTarget)}
            className="group/shot relative block w-full overflow-hidden bg-[var(--ermia-bg)] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
          >
            {isMobileCapture ? (
              <div className="flex items-center justify-center py-5 px-4">
                <div className="w-[188px] overflow-hidden rounded-[26px] border border-white/15 bg-[#0c141d] p-1.5 shadow-[0_24px_48px_-18px_rgba(0,0,0,0.72)] transition-transform duration-500 ease-out group-hover/shot:scale-[1.02]">
                  <ImageReveal
                    src={shot.src}
                    webpSrc={shot.webpSrc}
                    alt={shot.alt}
                    title={shot.caption}
                    containerClassName="aspect-[1080/2460] w-full rounded-[20px]"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <ImageReveal
                src={shot.src}
                webpSrc={shot.webpSrc}
                alt={shot.alt}
                title={shot.caption}
                containerClassName="aspect-[16/10] w-full"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/shot:scale-[1.025]"
              />
            )}
          </button>
        ) : (
          <ImageReveal
            src={shot.src}
            webpSrc={shot.webpSrc}
            alt={shot.alt}
            title={shot.caption}
            containerClassName={
              isMobileCapture
                ? 'mx-auto my-4 aspect-[1080/2460] max-w-[200px] rounded-[20px]'
                : 'aspect-[16/10] w-full'
            }
            className={
              isMobileCapture ? 'h-full w-full object-contain' : 'h-full w-full object-cover'
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-surface)] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)]">
      {/* Top specular highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ermia-glass-edge)] to-transparent"
      />

      {/* Ambient radial depth behind interactive viewport */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 end-0 h-56 w-56 rounded-full opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--ermia-spotlight-rgb), 0.14) 0%, transparent 70%)',
        }}
      />

      {/* Lightweight Device Top Chrome */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/75 px-4 py-3 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-[var(--ermia-accent)]" strokeWidth={1.75} />
          <span className="font-mono text-[11px] tracking-wide text-[var(--ermia-text)]">
            FLOW
          </span>
        </div>
        <span className="truncate font-mono text-[11px] text-[var(--ermia-muted)]">
          {conceptPreviewLabel}
        </span>
      </div>

      {/* Animated Viewport Body */}
      <div
        className={`relative z-10 ${
          variant === 'sticky' ? 'p-5 sm:p-7' : 'p-4 sm:p-5'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeLayer.number}-${activeLayer.name}`}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: 8, scale: 0.99 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: -6, scale: 0.99 }
            }
            transition={{ duration: 0.24, ease: MOTION_EASE.cinematic }}
            className="space-y-4"
          >
            {/* Stage Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ermia-border)] pb-3.5 text-xs">
              <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                {activeLayer.number} · {activeLayer.role}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ermia-text)]">
                {renderStageIcon(activeLayer.stage)}
                <span>{stageLabels[activeLayer.stage]}</span>
              </span>
            </div>

            {/* Active Layer Conceptual Frame */}
            <div className="rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4 sm:p-5">
              <p className="font-display text-lg font-semibold tracking-tight text-[var(--ermia-text)] sm:text-xl">
                {activeLayer.name}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                {activeLayer.summary}
              </p>

              {activeLayer.details && activeLayer.details.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-[var(--ermia-border)] pt-3.5">
                  {activeLayer.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ermia-text)]/88"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--ermia-accent)]"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Mobile Companion Horizon Strip */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/65 px-4 py-3 text-[11px]">
              <span className="text-[var(--ermia-text-secondary)]">
                {stageLabels.implemented} / {stageLabels.planned} / {stageLabels.conceptual}
              </span>
              <span className="font-mono tabular-nums text-[var(--ermia-accent)]">
                {activeLayer.number}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
