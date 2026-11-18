import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Globe, Menu, Moon, Sun, X } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { ErmiaLocaleContent, Locale } from '../data/ermiaData';
import {
  MOTION_EASE,
  SPRING_CONFIG,
  ThemeMode,
} from '../styles/designTokens';
import type { AppRoute } from '../utils/routing';
import { ErmiaWordmark } from './ErmiaWordmark';

interface LiquidGlassNavProps {
  locale: Locale;
  theme: ThemeMode;
  currentRoute: AppRoute;
  content: ErmiaLocaleContent['nav'];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenFlowCaseStudy: () => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
}

export function LiquidGlassNav({
  locale,
  theme,
  currentRoute,
  content,
  activeSection,
  onNavigate,
  onOpenFlowCaseStudy,
  onToggleLocale,
  onToggleTheme,
}: LiquidGlassNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const glassX = useMotionValue(0);
  const glassY = useMotionValue(0);
  const glassOpacity = useMotionValue(0);
  const smoothGlassOpacity = useSpring(
    glassOpacity,
    SPRING_CONFIG.spotlightOpacity
  );

  const isDark = theme === 'dark';
  const glassGlow = useMotionTemplate`radial-gradient(280px circle at ${glassX}px ${glassY}px, ${
    isDark
      ? 'rgba(216, 241, 90, 0.14), rgba(240, 241, 233, 0.04) 48%, transparent 76%'
      : 'rgba(83, 106, 0, 0.11), rgba(23, 27, 20, 0.03) 48%, transparent 76%'
  })`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'about', label: content.about },
    { id: 'journey', label: content.journey },
    { id: 'projects', label: content.projects },
    { id: 'skills', label: content.skills },
    { id: 'journal', label: content.journal },
    { id: 'contact', label: content.contact },
  ];

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const handleGlassMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      prefersReducedMotion ||
      (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
    ) {
      return;
    }
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    glassX.set(e.clientX - rect.left);
    glassY.set(e.clientY - rect.top);
    glassOpacity.set(1);
  };

  const handleGlassLeave = () => {
    glassOpacity.set(0);
  };

  const homeBaseHref = locale === 'fa' ? '/fa/' : '/';
  const BackArrow = locale === 'fa' ? ArrowRight : ArrowLeft;

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.56, ease: MOTION_EASE.cinematic }}
      className="fixed inset-x-0 top-0 z-40 px-3 pt-[max(0.625rem,env(safe-area-inset-top))] sm:px-6 sm:pt-3.5"
    >
      <div
        ref={barRef}
        onPointerMove={handleGlassMove}
        onPointerLeave={handleGlassLeave}
        className={`relative mx-auto flex max-w-5xl items-center justify-between gap-3 overflow-hidden rounded-2xl px-3.5 py-2 transition-all duration-300 sm:gap-6 sm:px-5 ${
          isScrolled ? 'liquid-glass-scrolled' : 'liquid-glass'
        }`}
      >
        {/* Top specular refraction highlight hairline */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ermia-glass-edge)] to-transparent opacity-70"
        />

        {/* Subtle cursor-reactive refraction shimmer */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: glassGlow, opacity: smoothGlassOpacity }}
          />
        )}

        {/* Zone 1: Slim ERMIA Wordmark */}
        <a
          href={currentRoute === 'flow' ? homeBaseHref : '#home'}
          aria-label={`${content.home} — ERMIA`}
          aria-current={
            currentRoute === 'home' && activeSection === 'home'
              ? 'location'
              : undefined
          }
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="relative z-10 whitespace-nowrap shrink-0 rounded-lg py-0.5 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
        >
          <ErmiaWordmark size="sm" />
        </a>

        {/* Zone 2: Concise Single-Line Section Links */}
        <nav
          aria-label="Primary Navigation"
          className="relative z-10 hidden items-center gap-4 lg:flex xl:gap-6"
        >
          {currentRoute === 'flow' ? (
            <>
              <a
                href={homeBaseHref}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('home');
                }}
                className="inline-flex items-center gap-1.5 py-1.5 text-[13px] font-medium text-[var(--ermia-text-secondary)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
              >
                <BackArrow className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>{content.home}</span>
              </a>
              <a
                href="/projects/flow"
                aria-current="page"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenFlowCaseStudy();
                }}
                className="relative py-1.5 text-[13px] font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
              >
                {content.caseStudyCta}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full bg-[var(--ermia-accent)]"
                />
              </a>
              <a
                href={`${homeBaseHref}#contact`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('contact');
                }}
                className="py-1.5 text-[13px] font-medium text-[var(--ermia-text-secondary)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[var(--ermia-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
              >
                {content.contact}
              </a>
            </>
          ) : (
            navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                  }}
                  className={`relative py-1.5 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] ${
                    isActive
                      ? 'text-[var(--ermia-text)]'
                      : 'text-[var(--ermia-text-secondary)] hover:text-[var(--ermia-text)]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      aria-hidden="true"
                      transition={SPRING_CONFIG.tabPill}
                      className="absolute inset-x-0 -bottom-0.5 h-[1.5px] rounded-full bg-[var(--ermia-accent)]"
                    />
                  )}
                </a>
              );
            })
          )}
        </nav>

        {/* Zone 3: Theme Toggle + Language Switcher + Mobile Menu Toggle */}
        <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? content.themeLightLabel : content.themeDarkLabel}
            title={isDark ? content.themeLightLabel : content.themeDarkLabel}
            className="liquid-glass-control inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--ermia-text)] transition-all duration-150 hover:border-[var(--ermia-accent)]/60 hover:text-[var(--ermia-accent)] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[var(--ermia-accent)]" strokeWidth={1.75} />
            ) : (
              <Moon className="h-4 w-4 text-[var(--ermia-accent)]" strokeWidth={1.75} />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleLocale}
            aria-label={
              locale === 'en' ? 'Switch to Persian' : 'Switch to English'
            }
            className="liquid-glass-control inline-flex min-h-[36px] items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-all duration-150 hover:border-[var(--ermia-accent)]/60 hover:text-[var(--ermia-accent)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] sm:px-3 cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-[var(--ermia-accent)]" strokeWidth={1.75} />
            <span>{content.toggleLangLabel}</span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="liquid-glass-control inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--ermia-text)] transition-colors duration-150 hover:border-[var(--ermia-accent)]/55 hover:text-[var(--ermia-accent)] active:scale-[0.95] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-4.5 w-4.5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-4.5 w-4.5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Animated Mobile Liquid Glass Drawer with >= 44px Touch Targets */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: -10, scale: 0.985 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? undefined
                : { opacity: 0, y: -8, scale: 0.985 }
            }
            transition={{ duration: 0.22, ease: MOTION_EASE.cinematic }}
            className="liquid-glass-scrolled mx-auto mt-2 max-w-5xl rounded-2xl p-3 lg:hidden"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
              {[{ id: 'home', label: content.home }, ...navItems].map(
                (item, idx) => {
                  const isActive =
                    currentRoute === 'home' && activeSection === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      href={`${homeBaseHref}#${item.id}`}
                      aria-current={isActive ? 'location' : undefined}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, x: -6 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: prefersReducedMotion ? 0 : idx * 0.03,
                        ease: MOTION_EASE.cinematic,
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.id);
                      }}
                      className={`flex min-h-[44px] items-center rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--ermia-bg-secondary)] text-[var(--ermia-accent)]'
                          : 'text-[var(--ermia-text)] hover:bg-[var(--ermia-bg-secondary)]/60'
                      }`}
                    >
                      <span>{item.label}</span>
                    </motion.a>
                  );
                }
              )}
              <a
                href="/projects/flow"
                aria-current={currentRoute === 'flow' ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onOpenFlowCaseStudy();
                }}
                className={`mt-1 flex min-h-[44px] items-center justify-between rounded-xl border border-[var(--ermia-border)] px-3.5 py-2 text-sm font-medium transition-colors ${
                  currentRoute === 'flow'
                    ? 'border-[var(--ermia-accent)]/60 bg-[var(--ermia-accent)]/12 text-[var(--ermia-accent)]'
                    : 'text-[var(--ermia-accent)] hover:bg-[var(--ermia-bg-secondary)]/60'
                }`}
              >
                <span>{content.caseStudyCta}</span>
                <span className="font-mono text-xs">/projects/flow</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
