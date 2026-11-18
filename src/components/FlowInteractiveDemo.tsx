import { useState } from 'react';
import {
  Check,
  Clock3,
  Heart,
  LayoutGrid,
  Palette,
  PawPrint,
  Plus,
  RotateCcw,
  Sparkles,
  Sun,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Locale } from '../data/ermiaData';
import type { FlowDemoLocaleContent } from '../data/flowProductData';
import { MOTION_EASE } from '../styles/designTokens';

interface FlowInteractiveDemoProps {
  locale: Locale;
  copy: FlowDemoLocaleContent;
  onJumpToRealScreen: (screenId: string) => void;
}

type DemoTab = 'today' | 'themes' | 'companion' | 'widgets';
type SpacePaletteId = 'obsidianMist' | 'auroraDusk' | 'daylightPaper';
type AccentLightId = 'cyan' | 'violet' | 'amber';
type CompanionAction = 'pet' | 'tilt' | 'wag';

const PALETTE_THEMES: Record<
  SpacePaletteId,
  {
    screenBg: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    dockBg: string;
  }
> = {
  obsidianMist: {
    screenBg: 'bg-gradient-to-b from-[#102635] via-[#0d1c27] to-[#081017]',
    cardBg: 'bg-white/[0.06]',
    cardBorder: 'border-white/14',
    textPrimary: 'text-[#eef5f8]',
    textSecondary: 'text-[#9ab4c2]',
    dockBg: 'bg-[#09131a]/88',
  },
  auroraDusk: {
    screenBg: 'bg-gradient-to-b from-[#171836] via-[#131d2f] to-[#0a0f18]',
    cardBg: 'bg-white/[0.065]',
    cardBorder: 'border-indigo-200/18',
    textPrimary: 'text-[#f1f3ff]',
    textSecondary: 'text-[#adb8d8]',
    dockBg: 'bg-[#0c1122]/88',
  },
  daylightPaper: {
    screenBg: 'bg-gradient-to-b from-[#eff3f5] via-[#e7edf1] to-[#dde5ea]',
    cardBg: 'bg-white/85',
    cardBorder: 'border-slate-900/10',
    textPrimary: 'text-[#121922]',
    textSecondary: 'text-[#4c5b6b]',
    dockBg: 'bg-white/92',
  },
};

const ACCENT_LIGHTS: Record<
  AccentLightId,
  { hex: string; pillBg: string; ringColor: string }
> = {
  cyan: {
    hex: '#67e8f9',
    pillBg: 'rgba(103, 232, 249, 0.18)',
    ringColor: 'rgba(103, 232, 249, 0.55)',
  },
  violet: {
    hex: '#c4b5fd',
    pillBg: 'rgba(196, 181, 253, 0.2)',
    ringColor: 'rgba(196, 181, 253, 0.55)',
  },
  amber: {
    hex: '#fcd34d',
    pillBg: 'rgba(252, 211, 77, 0.2)',
    ringColor: 'rgba(252, 211, 77, 0.55)',
  },
};

const COMPANION_COATS: Record<
  'mochi' | 'sora' | 'kumo',
  { fur: string; ear: string; belly: string }
> = {
  mochi: { fur: '#eab364', ear: '#c7853b', belly: '#fbe5be' },
  sora: { fur: '#d97a4a', ear: '#9f4e28', belly: '#faece1' },
  kumo: { fur: '#98a6b5', ear: '#6b7888', belly: '#e4eaf0' },
};

export function FlowInteractiveDemo({
  locale,
  copy,
  onJumpToRealScreen,
}: FlowInteractiveDemoProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<DemoTab>('today');
  const [paletteId, setPaletteId] = useState<SpacePaletteId>('obsidianMist');
  const [accentId, setAccentId] = useState<AccentLightId>('cyan');
  const [selectedMoodIdx, setSelectedMoodIdx] = useState(0);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [checkedIntentions, setCheckedIntentions] = useState<number[]>([0]);
  const [companionId, setCompanionId] = useState<'mochi' | 'sora' | 'kumo'>('mochi');
  const [companionAction, setCompanionAction] = useState<CompanionAction | null>(null);

  const spaceTheme = PALETTE_THEMES[paletteId];
  const accent = ACCENT_LIGHTS[accentId];
  const activePreset =
    copy.companionCopy.presets.find((p) => p.id === companionId) ??
    copy.companionCopy.presets[0];
  const coat = COMPANION_COATS[companionId];

  const toggleIntention = (idx: number) => {
    setCheckedIntentions((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const triggerCompanionAction = (action: CompanionAction) => {
    setCompanionAction(action);
  };

  const tabItems: { id: DemoTab; label: string; icon: typeof Sun }[] = [
    { id: 'today', label: copy.tabs.today, icon: Sun },
    { id: 'themes', label: copy.tabs.themes, icon: Palette },
    { id: 'companion', label: copy.tabs.companion, icon: PawPrint },
    { id: 'widgets', label: copy.tabs.widgets, icon: LayoutGrid },
  ];

  const screenForCurrentTab =
    activeTab === 'themes'
      ? 'living-space-studio'
      : activeTab === 'companion'
        ? 'companion-sanctuary'
        : 'today-dashboard';

  return (
    <section
      id="flow-interactive-demo"
      aria-labelledby="flow-demo-heading"
      className="scroll-mt-24 py-4"
    >
      <div className="mb-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
          <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
            02
          </span>
          <span aria-hidden="true" className="text-[var(--ermia-muted)]">
            ·
          </span>
          <span>{copy.kicker}</span>
          <span className="rounded-md border border-[var(--ermia-border)] bg-[var(--ermia-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--ermia-text-secondary)]">
            {copy.disclaimerBadge}
          </span>
        </div>

        <h2
          id="flow-demo-heading"
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl text-balance"
        >
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
          {copy.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-5 sm:p-8 lg:grid-cols-12 lg:p-10">
        {/* Controls Column: Independent mobile-first stacking, desktop left/start column */}
        <div className="space-y-6 lg:col-span-6">
          {/* Interactive Screen Navigation Tabs */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                    isSelected
                      ? 'border-[var(--ermia-accent)] bg-[var(--ermia-accent)]/14 text-[var(--ermia-accent)]'
                      : 'border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text-secondary)] hover:border-[var(--ermia-border-strong)] hover:text-[var(--ermia-text)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Space Palette & Accent Switcher (Visible across all tabs so users can remix live themes) */}
          <div className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4 sm:p-5 space-y-4">
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-[var(--ermia-text)]">
                {copy.themeLabels.heading}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(
                  [
                    { id: 'obsidianMist', label: copy.themeLabels.obsidianMist },
                    { id: 'auroraDusk', label: copy.themeLabels.auroraDusk },
                    { id: 'daylightPaper', label: copy.themeLabels.daylightPaper },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={paletteId === item.id}
                    onClick={() => setPaletteId(item.id)}
                    className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                      paletteId === item.id
                        ? 'border-[var(--ermia-accent)] bg-[var(--ermia-accent)]/14 text-[var(--ermia-accent)]'
                        : 'border-[var(--ermia-border)] bg-[var(--ermia-surface)] text-[var(--ermia-text-secondary)] hover:text-[var(--ermia-text)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t border-[var(--ermia-border)] pt-3.5">
              <p className="text-xs font-medium text-[var(--ermia-text)]">
                {copy.themeLabels.accentHeading}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'cyan', label: copy.themeLabels.cyan, dot: '#67e8f9' },
                    { id: 'violet', label: copy.themeLabels.violet, dot: '#c4b5fd' },
                    { id: 'amber', label: copy.themeLabels.amber, dot: '#fcd34d' },
                  ] as const
                ).map((sw) => (
                  <button
                    key={sw.id}
                    type="button"
                    aria-pressed={accentId === sw.id}
                    onClick={() => setAccentId(sw.id)}
                    className={`inline-flex min-h-[36px] items-center gap-2 rounded-lg border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                      accentId === sw.id
                        ? 'border-[var(--ermia-accent)] bg-[var(--ermia-surface)] text-[var(--ermia-text)]'
                        : 'border-[var(--ermia-border)] bg-[var(--ermia-surface)]/55 text-[var(--ermia-text-secondary)] hover:text-[var(--ermia-text)]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: sw.dot }}
                    />
                    <span>{sw.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contextual Controls matching selected Demo Tab */}
          {activeTab === 'companion' && (
            <div className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4 sm:p-5 space-y-3">
              <p className="text-xs font-medium text-[var(--ermia-text)]">
                {copy.companionCopy.heading}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {copy.companionCopy.presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={companionId === preset.id}
                    onClick={() => {
                      setCompanionId(preset.id);
                      setCompanionAction(null);
                    }}
                    className={`rounded-xl border p-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                      companionId === preset.id
                        ? 'border-[var(--ermia-accent)] bg-[var(--ermia-accent)]/10'
                        : 'border-[var(--ermia-border)] bg-[var(--ermia-surface)] hover:border-[var(--ermia-border-strong)]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[var(--ermia-text)]">
                      {preset.name}
                    </p>
                    <p className="text-[11px] text-[var(--ermia-text-secondary)]">
                      {preset.breed}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct Bridge back to authentic Android screenshots */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-[var(--ermia-muted)]">
              {copy.companionCopy.note}
            </p>
            <button
              type="button"
              onClick={() => onJumpToRealScreen(screenForCurrentTab)}
              className="inline-flex min-h-[38px] items-center gap-1.5 text-xs font-medium text-[var(--ermia-accent)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>
                {locale === 'fa'
                  ? 'مقایسه با تصویر واقعی اندروید'
                  : 'Compare with Real Capture'}
              </span>
            </button>
          </div>
        </div>

        {/* Simulated Phone Stage */}
        <div className="flex justify-center lg:col-span-6">
          <div className="relative w-full max-w-[300px] rounded-[36px] border-[4px] border-[#262b34] bg-[#0b0e12] p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65)]">
            <div
              className={`relative flex min-h-[470px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 p-4 transition-colors duration-300 ${spaceTheme.screenBg}`}
            >
              {/* Status bar */}
              <div className="flex items-center justify-between text-[10px] font-mono opacity-75">
                <span className={spaceTheme.textPrimary}>FLOW · Sandbox</span>
                <span className={spaceTheme.textSecondary}>
                  {paletteId === 'daylightPaper' ? 'Daylight' : 'Obsidian'}
                </span>
              </div>

              {/* Screen Body */}
              <div className="my-3 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  {activeTab === 'today' && (
                    <motion.div
                      key="tab-today"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
                      className="space-y-3"
                    >
                      <div>
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${spaceTheme.textSecondary}`}>
                          {copy.todayCopy.dayPulseLabel}
                        </p>
                        <p className={`mt-0.5 font-display text-lg font-semibold ${spaceTheme.textPrimary}`}>
                          {copy.todayCopy.greeting}
                        </p>
                      </div>

                      {/* Rhythm Mood Selector */}
                      <div className="flex flex-wrap gap-1.5">
                        {copy.todayCopy.moods.map((mood, idx) => (
                          <button
                            key={mood}
                            type="button"
                            onClick={() => setSelectedMoodIdx(idx)}
                            style={
                              selectedMoodIdx === idx
                                ? {
                                    backgroundColor: accent.pillBg,
                                    borderColor: accent.ringColor,
                                  }
                                : undefined
                            }
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                              selectedMoodIdx === idx
                                ? spaceTheme.textPrimary
                                : `${spaceTheme.cardBorder} ${spaceTheme.cardBg} ${spaceTheme.textSecondary}`
                            }`}
                          >
                            {mood}
                          </button>
                        ))}
                      </div>

                      {/* Focus Counter Card */}
                      <div className={`rounded-2xl border p-3 ${spaceTheme.cardBorder} ${spaceTheme.cardBg}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className={`text-[11px] ${spaceTheme.textSecondary}`}>
                              {copy.todayCopy.focusLabel}
                            </p>
                            <p className={`font-mono text-lg font-semibold tabular-nums ${spaceTheme.textPrimary}`}>
                              {focusMinutes}m
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setFocusMinutes((m) => Math.min(180, m + 15))}
                              style={{
                                backgroundColor: accent.pillBg,
                                borderColor: accent.ringColor,
                              }}
                              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium cursor-pointer ${spaceTheme.textPrimary}`}
                            >
                              <Plus className="h-3 w-3" />
                              <span>{copy.todayCopy.addSessionBtn}</span>
                            </button>
                            <button
                              type="button"
                              aria-label="Reset focus counter"
                              onClick={() => setFocusMinutes(25)}
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border cursor-pointer ${spaceTheme.cardBorder} ${spaceTheme.textSecondary}`}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Sample Intentions */}
                      <div className={`rounded-2xl border p-3 ${spaceTheme.cardBorder} ${spaceTheme.cardBg}`}>
                        <p className={`text-[11px] font-medium ${spaceTheme.textSecondary}`}>
                          {copy.todayCopy.intentionsLabel}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          {copy.todayCopy.defaultIntentions.map((item, idx) => {
                            const done = checkedIntentions.includes(idx);
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => toggleIntention(idx)}
                                className="flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-start text-xs transition-opacity hover:opacity-90 cursor-pointer"
                              >
                                <span
                                  style={
                                    done
                                      ? {
                                          backgroundColor: accent.hex,
                                          borderColor: accent.hex,
                                        }
                                      : undefined
                                  }
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                                    done
                                      ? 'text-[#0a0f14]'
                                      : `${spaceTheme.cardBorder}`
                                  }`}
                                >
                                  {done && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                                </span>
                                <span
                                  className={`text-[11px] leading-snug ${
                                    done
                                      ? `line-through opacity-60 ${spaceTheme.textSecondary}`
                                      : spaceTheme.textPrimary
                                  }`}
                                >
                                  {item}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'themes' && (
                    <motion.div
                      key="tab-themes"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
                      className="space-y-3.5"
                    >
                      <p className={`font-display text-base font-semibold ${spaceTheme.textPrimary}`}>
                        Living Space Studio
                      </p>
                      <div
                        className={`rounded-2xl border p-3.5 ${spaceTheme.cardBorder} ${spaceTheme.cardBg}`}
                      >
                        <div
                          className="h-20 w-full rounded-xl transition-all duration-300"
                          style={{
                            background: `radial-gradient(circle at 28% 35%, ${accent.ringColor}, transparent 68%)`,
                          }}
                        />
                        <p className={`mt-2.5 text-xs font-medium ${spaceTheme.textPrimary}`}>
                          {copy.themeLabels[paletteId]} · {copy.themeLabels[accentId]}
                        </p>
                        <p className={`mt-1 text-[11px] leading-relaxed ${spaceTheme.textSecondary}`}>
                          {locale === 'fa'
                            ? 'نور پس‌زمینه و کنتراست کارت‌ها بلافاصله با انتخاب شما تنظیم می‌شوند.'
                            : 'Ambient orb glow and glass contrast adapt live as you switch palettes and accent light.'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'companion' && (
                    <motion.div
                      key="tab-companion"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-display font-semibold ${spaceTheme.textPrimary}`}>
                          {activePreset.name}
                        </span>
                        <span className={`text-[10px] ${spaceTheme.textSecondary}`}>
                          {activePreset.status}
                        </span>
                      </div>

                      {/* Lightweight Animated SVG Companion Stage */}
                      <div
                        className={`flex flex-col items-center justify-center rounded-2xl border py-5 ${spaceTheme.cardBorder} ${spaceTheme.cardBg}`}
                      >
                        <motion.svg
                          viewBox="0 0 120 110"
                          className="h-24 w-24"
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : companionAction === 'tilt'
                                ? { rotate: [0, -10, 8, 0] }
                                : companionAction === 'pet'
                                  ? { y: [0, -5, 0], scale: [1, 1.04, 1] }
                                  : companionAction === 'wag'
                                    ? { rotate: [0, 4, -4, 3, 0] }
                                    : undefined
                          }
                          transition={{ duration: 0.55 }}
                          aria-hidden="true"
                        >
                          {/* Subtle stage shadow */}
                          <ellipse cx="60" cy="96" rx="28" ry="6" fill="rgba(0,0,0,0.22)" />
                          {/* Body */}
                          <rect x="40" y="58" width="40" height="32" rx="16" fill={coat.fur} />
                          <ellipse cx="60" cy="76" rx="12" ry="12" fill={coat.belly} />
                          {/* Ears */}
                          <ellipse cx="36" cy="40" rx="9" ry="15" transform="rotate(-14 36 40)" fill={coat.ear} />
                          <ellipse cx="84" cy="40" rx="9" ry="15" transform="rotate(14 84 40)" fill={coat.ear} />
                          {/* Head */}
                          <circle cx="60" cy="42" r="22" fill={coat.fur} />
                          {/* Eyes & Nose */}
                          <circle cx="52" cy="40" r="2.7" fill="#1b1b1f" />
                          <circle cx="68" cy="40" r="2.7" fill="#1b1b1f" />
                          <ellipse cx="60" cy="46" rx="3.4" ry="2.4" fill="#1b1b1f" />
                          <path
                            d="M55 51 Q60 55 65 51"
                            fill="none"
                            stroke="#1b1b1f"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </motion.svg>

                        {companionAction && (
                          <p
                            style={{ color: accent.hex }}
                            className="mt-2 px-3 text-center text-[11px] font-medium"
                          >
                            {copy.companionCopy.reactionMessages[companionAction]}
                          </p>
                        )}
                      </div>

                      {/* Interactive Gesture Buttons */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          [
                            { id: 'pet', label: copy.companionCopy.actions.pet, Icon: Heart },
                            { id: 'tilt', label: copy.companionCopy.actions.tilt, Icon: Sparkles },
                            { id: 'wag', label: copy.companionCopy.actions.wag, Icon: PawPrint },
                          ] as const
                        ).map(({ id, label, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => triggerCompanionAction(id)}
                            style={
                              companionAction === id
                                ? {
                                    backgroundColor: accent.pillBg,
                                    borderColor: accent.ringColor,
                                  }
                                : undefined
                            }
                            className={`flex min-h-[34px] items-center justify-center gap-1 rounded-xl border px-2 text-[11px] font-medium cursor-pointer ${
                              companionAction === id
                                ? spaceTheme.textPrimary
                                : `${spaceTheme.cardBorder} ${spaceTheme.cardBg} ${spaceTheme.textSecondary}`
                            }`}
                          >
                            <Icon className="h-3 w-3 shrink-0" />
                            <span className="truncate">{label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'widgets' && (
                    <motion.div
                      key="tab-widgets"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: MOTION_EASE.cinematic }}
                      className="space-y-3"
                    >
                      <p className={`font-display text-sm font-semibold ${spaceTheme.textPrimary}`}>
                        {copy.widgetsCopy.heading}
                      </p>
                      <p className={`text-[11px] leading-relaxed ${spaceTheme.textSecondary}`}>
                        {copy.widgetsCopy.plannedNote}
                      </p>
                      <div className="space-y-2.5">
                        {copy.widgetsCopy.cards.map((card) => (
                          <div
                            key={card.id}
                            className={`rounded-2xl border p-3.5 ${spaceTheme.cardBorder} ${spaceTheme.cardBg}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-semibold ${spaceTheme.textPrimary}`}>
                                {card.title}
                              </p>
                              <span
                                style={{ color: accent.hex }}
                                className="inline-flex items-center gap-1 text-[10px] font-mono"
                              >
                                <Clock3 className="h-2.5 w-2.5" />
                                <span>{card.meta}</span>
                              </span>
                            </div>
                            <p className={`mt-1 text-[11px] ${spaceTheme.textSecondary}`}>
                              {card.subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mini Floating Dock */}
              <div
                className={`flex items-center justify-around rounded-2xl border px-2 py-2 ${spaceTheme.cardBorder} ${spaceTheme.dockBg}`}
              >
                {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-label={tab.label}
                      onClick={() => setActiveTab(tab.id)}
                      style={active ? { color: accent.hex } : undefined}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        active ? '' : spaceTheme.textSecondary
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
