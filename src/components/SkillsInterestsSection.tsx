import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ErmiaLocaleContent, Locale, SkillGroup } from '../data/ermiaData';
import { MOTION_EASE, SPRING_CONFIG, ThemeMode } from '../styles/designTokens';
import { InteractiveProjectCard } from './InteractiveProjectCard';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface SkillsInterestsSectionProps {
  locale: Locale;
  theme: ThemeMode;
  content: ErmiaLocaleContent['skills'];
}

export function SkillsInterestsSection({
  locale,
  theme,
  content,
}: SkillsInterestsSectionProps) {
  const [selectedGroup, setSelectedGroup] = useState<'all' | SkillGroup['id']>(
    'all'
  );
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prefersReducedMotion = useReducedMotion();

  const visibleGroups =
    selectedGroup === 'all'
      ? content.groups
      : content.groups.filter((g) => g.id === selectedGroup);

  const filterTabs: { id: 'all' | SkillGroup['id']; label: string }[] = [
    { id: 'all', label: locale === 'fa' ? 'همه' : 'All' },
    ...content.groups.map((g) => ({ id: g.id, label: g.title })),
  ];

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    const isRtl = locale === 'fa';
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = isRtl
        ? (idx - 1 + filterTabs.length) % filterTabs.length
        : (idx + 1) % filterTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = isRtl
        ? (idx + 1) % filterTabs.length
        : (idx - 1 + filterTabs.length) % filterTabs.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = filterTabs.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      const target = filterTabs[nextIdx];
      tabRefs.current[target.id]?.focus();
      setSelectedGroup(target.id);
    }
  };

  return (
    <section
      id="skills"
      className="scroll-mt-24 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <ScrollReveal className="flex flex-col justify-between gap-6 border-b border-[var(--ermia-border)] pb-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
            <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
              04
            </span>
            <span aria-hidden="true" className="text-[var(--ermia-muted)]">
              ·
            </span>
            <span>{content.kicker}</span>
          </div>
          <TextReveal
            as="h2"
            splitWords
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl text-balance"
          >
            {content.title}
          </TextReveal>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ermia-text-secondary)] sm:text-base">
            {content.subtitle}
          </p>
        </div>

        {/* Interactive Category Switcher */}
        <div
          role="tablist"
          aria-label={content.kicker}
          className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-1.5"
        >
          {filterTabs.map((tab, idx) => {
            const isSelected = selectedGroup === tab.id;
            return (
              <button
                key={tab.id}
                id={`skills-tab-${tab.id}`}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                role="tab"
                type="button"
                tabIndex={isSelected ? 0 : -1}
                aria-selected={isSelected}
                aria-controls="skills-tabpanel"
                onClick={() => setSelectedGroup(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`relative min-h-[40px] rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer ${
                  isSelected
                    ? 'text-[var(--ermia-accent-contrast)]'
                    : 'text-[var(--ermia-text-secondary)] hover:text-[var(--ermia-text)]'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="skills-active-tab"
                    aria-hidden="true"
                    transition={SPRING_CONFIG.tabPill}
                    className="absolute inset-0 rounded-lg bg-[var(--ermia-accent)]"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Structured 3-Column Distinction */}
      <AnimatePresence mode="wait">
        <motion.div
          id="skills-tabpanel"
          role="tabpanel"
          aria-labelledby={`skills-tab-${selectedGroup}`}
          key={selectedGroup}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.24, ease: MOTION_EASE.cinematic }}
          className={`mt-10 grid grid-cols-1 gap-6 ${
            visibleGroups.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-3'
          }`}
        >
          {visibleGroups.map((group) => (
            <div key={group.id}>
              <InteractiveProjectCard
                enableTilt={false}
                theme={theme}
                className="flex h-full flex-col p-6 sm:p-7"
              >
                <div className="border-b border-[var(--ermia-border)] pb-4">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--ermia-text)]">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--ermia-text-secondary)]">
                    {group.subtitle}
                  </p>
                </div>

                <div className="mt-2 divide-y divide-[var(--ermia-border)]">
                  {group.items.map((item) => (
                    <div key={item.name} className="py-4 last:pb-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-display text-base font-medium text-[var(--ermia-text)]">
                          {item.name}
                        </h4>
                        <span className="text-xs font-medium text-[var(--ermia-accent)] whitespace-nowrap shrink-0">
                          {item.levelLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </InteractiveProjectCard>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
