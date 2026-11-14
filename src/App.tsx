import { useCallback, useEffect, useRef, useState } from 'react';
import { LenisRef, ReactLenis } from 'lenis/react';
import { cancelFrame, frame, useReducedMotion } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { AmbientBackground } from './components/AmbientBackground';
import { CursorSpotlight } from './components/CursorSpotlight';
import { EditorialMarquee } from './components/EditorialMarquee';
import { HeroSection } from './components/HeroSection';
import { JournalSection } from './components/JournalSection';
import { JourneyTimelineSection } from './components/JourneyTimelineSection';
import { LiquidGlassNav } from './components/LiquidGlassNav';
import { ProjectsSection } from './components/ProjectsSection';
import { ScrollProgress } from './components/ScrollProgress';
import { SkillsInterestsSection } from './components/SkillsInterestsSection';
import { TodayAndContactSection } from './components/TodayAndContactSection';
import { SITE_CONFIG } from './config/siteConfig';
import { ERMIA_CONTENT, Locale } from './data/ermiaData';
import { LENIS_CONFIG, ThemeMode } from './styles/designTokens';

const THEME_STORAGE_KEY = 'ermia-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'dark';
  }
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [activeSection, setActiveSection] = useState('home');
  const lenisRef = useRef<LenisRef | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const content = ERMIA_CONTENT[locale];

  // Single coordinated RAF loop binding Lenis directly into Motion's frame loop
  useEffect(() => {
    if (prefersReducedMotion) return;

    const update = (data: { timestamp: number }) => {
      lenisRef.current?.lenis?.raf(data.timestamp);
    };

    frame.update(update, true);
    return () => {
      cancelFrame(update);
    };
  }, [prefersReducedMotion]);

  // Apply Dark / Light mode class and color-scheme synchronously
  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [theme]);

  // Follow system color-scheme changes if user has not made a manual selection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (!stored) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // Storage disabled; state updates smoothly in-memory
      }
      return next;
    });
  }, []);

  // Update HTML lang/dir & OpenGraph locale metadata dynamically
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', locale === 'fa' ? 'fa_IR' : 'en_US');
    }
  }, [locale]);

  // Set canonical link from configurable VITE_SITE_URL when provided
  useEffect(() => {
    if (!SITE_CONFIG.siteUrl) return;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', SITE_CONFIG.siteUrl);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const lenisInstance = lenisRef.current?.lenis;

      if (sectionId === 'home' || sectionId === 'top') {
        if (lenisInstance && !prefersReducedMotion) {
          lenisInstance.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
        }
        return;
      }

      const element = document.getElementById(sectionId);
      if (!element) return;

      if (lenisInstance && !prefersReducedMotion) {
        lenisInstance.scrollTo(element, { offset: -72, duration: 1.05 });
      } else {
        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    },
    [prefersReducedMotion]
  );

  const scrollToElementCentered = useCallback(
    (element: HTMLElement) => {
      const lenisInstance = lenisRef.current?.lenis;
      if (lenisInstance && !prefersReducedMotion) {
        const offset = Math.round(-(window.innerHeight * 0.25));
        lenisInstance.scrollTo(element, { offset, duration: 1.0 });
      } else {
        element.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    const sectionIds = [
      'home',
      'about',
      'journey',
      'projects',
      'skills',
      'journal',
      'today',
      'contact',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: 0.05,
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const sectionLabels: Record<string, string> = {
    home: content.nav.home,
    about: content.nav.about,
    journey: content.nav.journey,
    projects: content.nav.projects,
    skills: locale === 'fa' ? 'مهارت‌ها' : 'Skills',
    journal: content.nav.journal,
    today: locale === 'fa' ? 'امروز' : 'Today',
    contact: content.nav.contact,
  };

  const pageShell = (
    <div className="relative min-h-screen bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors duration-300">
      <AmbientBackground />

      <CursorSpotlight theme={theme} />

      <ScrollProgress
        locale={locale}
        activeSection={activeSection}
        sectionLabels={sectionLabels}
      />

      <LiquidGlassNav
        locale={locale}
        theme={theme}
        content={content.nav}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onToggleLocale={() =>
          setLocale((prev) => (prev === 'en' ? 'fa' : 'en'))
        }
        onToggleTheme={handleToggleTheme}
      />

      <main className="relative z-10">
        <HeroSection
          locale={locale}
          content={content.hero}
          onNavigate={scrollToSection}
        />

        <EditorialMarquee items={content.hero.marqueeItems} />

        <AboutSection locale={locale} content={content.about} />

        <JourneyTimelineSection
          locale={locale}
          theme={theme}
          content={content.journey}
          onNavigate={scrollToSection}
          onScrollToElement={scrollToElementCentered}
        />

        <ProjectsSection theme={theme} content={content.projects} />

        <SkillsInterestsSection
          locale={locale}
          theme={theme}
          content={content.skills}
        />

        <JournalSection locale={locale} content={content.journal} />
      </main>

      <TodayAndContactSection
        locale={locale}
        theme={theme}
        todayContent={content.today}
        contactContent={content.contact}
        navContent={content.nav}
        onNavigate={scrollToSection}
      />
    </div>
  );

  if (prefersReducedMotion) {
    return pageShell;
  }

  return (
    <ReactLenis root ref={lenisRef} options={LENIS_CONFIG}>
      {pageShell}
    </ReactLenis>
  );
}
