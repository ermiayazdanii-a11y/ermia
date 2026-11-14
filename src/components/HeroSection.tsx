import { useRef } from 'react';
import { ArrowDown, ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ErmiaLocaleContent, Locale, MEDIA_ASSETS } from '../data/ermiaData';
import { MOTION_EASE } from '../styles/designTokens';
import { ErmiaWordmark } from './ErmiaWordmark';
import { HeroPortrait } from './HeroPortrait';
import { MagneticButton } from './MagneticButton';
import { staggerContainerVariants, staggerItemVariants } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface HeroSectionProps {
  locale: Locale;
  content: ErmiaLocaleContent['hero'];
  onNavigate: (sectionId: string) => void;
}

export function HeroSection({
  locale,
  content,
  onNavigate,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const CtaArrow = locale === 'fa' ? ArrowDownLeft : ArrowDownRight;

  // Restrained GPU-composited scroll parallax on portrait
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const portraitScrollY = useTransform(scrollYProgress, [0, 1], [0, 28]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col justify-between px-4 pt-24 pb-10 sm:px-6 sm:pt-28 sm:pb-12"
    >
      {/* Centered Editorial Personal Portrait Cover */}
      <div className="my-auto flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MOTION_EASE.cinematic }}
          className="mb-6 text-xs font-medium tracking-wide text-[var(--ermia-accent)]"
        >
          {content.kicker}
        </motion.p>

        {/* Centered Real Portrait */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: portraitScrollY }}
          className="w-full will-change-transform"
        >
          <HeroPortrait src={MEDIA_ASSETS.portrait} alt={content.portraitAlt} />
        </motion.div>

        {/* Centered ERMIA Brand Mark */}
        <div className="-mt-4 relative z-20">
          <ErmiaWordmark size="lg" animateEntrance />
        </div>

        {/* Expressive Headline Reveal */}
        <TextReveal
          as="h1"
          immediate
          delay={0.16}
          className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,5vw,4.15rem)] font-semibold leading-[1.08] tracking-tight text-[var(--ermia-text)] text-balance"
        >
          {content.headline}
        </TextReveal>

        {/* Supporting Description */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.62,
            delay: 0.28,
            ease: MOTION_EASE.cinematic,
          }}
          className="mt-4 max-w-xl text-base leading-[1.75] text-[var(--ermia-text-secondary)] sm:text-lg"
        >
          {content.intro}
        </motion.p>

        {/* Clear Magnetic Navigation to My Journey & Projects */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.58,
            delay: 0.36,
            ease: MOTION_EASE.cinematic,
          }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            onClick={() => onNavigate('journey')}
            className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-xl bg-[var(--ermia-accent)] px-6 py-3 text-sm font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 shadow-[0_12px_30px_-12px_rgba(var(--ermia-spotlight-rgb),0.45)] transition-colors duration-150 hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ermia-bg)] cursor-pointer"
          >
            <span>{content.journeyCta}</span>
            <CtaArrow
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              strokeWidth={2}
            />
          </MagneticButton>

          <MagneticButton
            strength={0.12}
            onClick={() => onNavigate('projects')}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-surface)]/80 px-5 py-2.5 text-sm font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
          >
            {content.projectsCta}
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bottom Truthful Identity Strip + Scroll Indicator */}
      <div className="mt-12">
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

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate('about')}
            aria-label={
              locale === 'fa'
                ? 'اسکرول به بخش درباره من'
                : 'Scroll to About section'
            }
            className="group inline-flex flex-col items-center gap-2 py-1 text-[11px] font-medium tracking-[0.2em] text-[var(--ermia-muted)] transition-colors duration-150 hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
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
