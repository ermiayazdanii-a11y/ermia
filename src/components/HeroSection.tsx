import { useRef, useState } from 'react';
import { ArrowDown, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ErmiaLocaleContent, Locale, MEDIA_ASSETS } from '../data/ermiaData';
import { MOTION_EASE, ThemeMode } from '../styles/designTokens';
import { HeroPortrait } from './HeroPortrait';
import { MagneticButton } from './MagneticButton';
import { staggerContainerVariants, staggerItemVariants } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface HeroSectionProps {
  locale: Locale;
  theme: ThemeMode;
  content: ErmiaLocaleContent['hero'];
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({
  locale,
  theme,
  content,
  onNavigate,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [morphActive, setMorphActive] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const CtaArrow = locale === 'fa' ? ArrowDownLeft : ArrowDownRight;

  const altKicker =
    locale === 'fa'
      ? 'پایتون · پایه HTML · ایده FLOW · گیتار'
      : 'Python · HTML Basics · FLOW · Guitar';

  // Shared GPU scroll progress driving multi-layer separation between subject & typography
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyScrollY = useTransform(scrollYProgress, [0, 1], [0, -14]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl scroll-mt-24 flex-col justify-between px-4 pt-20 pb-10 sm:px-6 sm:pt-24 sm:pb-12"
    >
      {/* Top Centered Cinematic Editorial Focal Stage */}
      <div className="my-auto flex flex-col items-center">
        {/* Controlled Kinetic Kicker Text Morph */}
        <button
          type="button"
          onMouseEnter={() => !prefersReducedMotion && setMorphActive(true)}
          onMouseLeave={() => setMorphActive(false)}
          onClick={() => setMorphActive((prev) => !prev)}
          className="mb-3 min-h-[28px] text-center text-xs font-medium tracking-wide text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] rounded-md px-2 sm:mb-4 cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={morphActive ? 'alt' : 'base'}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, y: 4 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? undefined
                  : { opacity: 0, y: -4 }
              }
              transition={{ duration: 0.22, ease: MOTION_EASE.cinematic }}
              className="inline-block"
            >
              {morphActive ? altKicker : content.kicker}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Text-Behind-Subject Layered Portrait Stage */}
        <HeroPortrait
          cutoutSrc={MEDIA_ASSETS.portraitCutout}
          cutoutFallbackSrc={MEDIA_ASSETS.portraitCutoutFallback}
          src={MEDIA_ASSETS.portrait}
          alt={content.portraitAlt}
          theme={theme}
          monogramAriaLabel={
            locale === 'fa'
              ? 'نشان سه‌بعدی ERMIA — برای چرخش لمس یا کلیک کنید'
              : 'Interactive 3D ERMIA monogram — click or tap to tilt'
          }
          scrollProgress={scrollYProgress}
        />

        {/* Semantic H1 (Ermia Yazdani), Visual Subtitle (Ideas Become Reality) & Introduction */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: copyScrollY }}
          className="mt-7 flex max-w-2xl flex-col items-center text-center sm:mt-8"
        >
          <TextReveal
            as="h1"
            immediate
            splitWords
            delay={0.22}
            className="font-display text-[clamp(2.2rem,4.9vw,3.85rem)] font-semibold leading-[1.05] tracking-tight text-[var(--ermia-text)] text-balance"
          >
            {content.fullName}
          </TextReveal>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.56,
              delay: 0.34,
              ease: MOTION_EASE.cinematic,
            }}
            className="mt-2 font-display text-lg font-medium tracking-tight text-[var(--ermia-accent)] sm:text-2xl"
          >
            {content.headline}
          </motion.p>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.64,
              delay: 0.42,
              ease: MOTION_EASE.cinematic,
            }}
            className="mt-3.5 max-w-xl text-sm leading-[1.75] text-[var(--ermia-text-secondary)] sm:text-base"
          >
            {content.intro}
          </motion.p>

          {/* Magnetic Navigation CTAs */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.48,
              ease: MOTION_EASE.cinematic,
            }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3.5 sm:mt-7 sm:gap-4"
          >
            <MagneticButton
              onClick={() => onNavigate('journey')}
              className="group relative inline-flex min-h-[44px] items-center gap-2.5 overflow-hidden rounded-xl bg-[var(--ermia-accent)] px-6 py-3 text-sm font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 shadow-[0_14px_32px_-12px_rgba(var(--ermia-spotlight-rgb),0.45)] transition-colors duration-150 hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ermia-bg)] cursor-pointer"
            >
              <span>{content.journeyCta}</span>
              <CtaArrow
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 rtl:group-hover:-translate-x-0.5"
                strokeWidth={2}
              />
            </MagneticButton>

            <MagneticButton
              strength={0.12}
              onClick={() => onNavigate('projects')}
              className="liquid-glass-control inline-flex min-h-[44px] items-center rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
            >
              {content.projectsCta}
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Truthful Identity Strip + Scroll Indicator */}
      <div className="mt-10 sm:mt-12">
        <motion.div
          variants={prefersReducedMotion ? undefined : staggerContainerVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-2 gap-6 border-t border-[var(--ermia-border)] pt-7 text-center sm:grid-cols-4 sm:text-start"
        >
          {content.highlights.map((item) => (
            <motion.div
              key={item.label}
              variants={prefersReducedMotion ? undefined : staggerItemVariants}
              className="space-y-1"
            >
              <p className="text-xs text-[var(--ermia-muted)]">{item.label}</p>
              <p className="font-display text-base font-medium text-[var(--ermia-text)] sm:text-lg">
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-7 flex justify-center sm:mt-8">
          <button
            type="button"
            onClick={() => onNavigate('about')}
            aria-label={
              locale === 'fa'
                ? 'اسکرول به بخش درباره من'
                : 'Scroll to About section'
            }
            className="group inline-flex min-h-[44px] flex-col items-center justify-center gap-2 px-3 py-1 text-[11px] font-medium tracking-[0.2em] text-[var(--ermia-muted)] transition-colors duration-150 hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
          >
            <span>{locale === 'fa' ? 'ادامه مسیر' : 'SCROLL'}</span>
            <span className="flex h-8 w-5 items-start justify-center rounded-full border border-[var(--ermia-border-strong)] p-1 transition-colors group-hover:border-[var(--ermia-accent)]">
              <ArrowDown
                className="animate-scroll-cue h-3 w-3 text-[var(--ermia-accent)]"
                strokeWidth={1.75}
              />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
