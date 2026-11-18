import {
  ComponentType,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import { LiquidPortalDivider } from './components/LiquidPortalDivider';
import { ProjectsSection } from './components/ProjectsSection';
import { ScrollProgress } from './components/ScrollProgress';
import { SkillsInterestsSection } from './components/SkillsInterestsSection';
import { TodayAndContactSection } from './components/TodayAndContactSection';
import { ERMIA_CONTENT, ErmiaLocaleContent, Locale } from './data/ermiaData';
import { LENIS_CONFIG, ThemeMode } from './styles/designTokens';
import {
  AppRoute,
  getRoutePath,
  parsePathname,
} from './utils/routing';
import { getSeoMetadata } from './utils/seo';

const LazyFlowCaseStudyPage = lazy(() => import('./components/FlowCaseStudyPage'));

const THEME_STORAGE_KEY = 'ermia-theme';
const LOCALE_STORAGE_KEY = 'ermia-locale';

export interface FlowCaseStudyComponentProps {
  locale: Locale;
  theme: ThemeMode;
  projectsContent: ErmiaLocaleContent['projects'];
  navContent: ErmiaLocaleContent['nav'];
  onNavigateHome: (sectionId?: string) => void;
}

export interface AppProps {
  initialRoute?: AppRoute;
  initialLocale?: Locale;
  initialCanonicalPath?: '/' | '/en/' | '/fa/' | '/projects/flow';
  FlowPageComponent?: ComponentType<FlowCaseStudyComponentProps>;
}

function getClientInitialNavigation() {
  if (typeof window === 'undefined') {
    return {
      route: 'home' as AppRoute,
      locale: 'en' as Locale,
      canonicalPath: '/' as const,
    };
  }
  const parsed = parsePathname(window.location.pathname);
  let resolvedLocale: Locale = parsed.localeFromPath ?? 'en';
  if (parsed.localeFromPath === null) {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'en' || stored === 'fa') {
        resolvedLocale = stored;
      }
    } catch {
      // Ignore storage errors
    }
  }
  return {
    route: parsed.route,
    locale: resolvedLocale,
    canonicalPath: parsed.canonicalPath,
  };
}

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

export default function App({
  initialRoute,
  initialLocale,
  initialCanonicalPath,
  FlowPageComponent,
}: AppProps = {}) {
  const clientNav = getClientInitialNavigation();
  const [route, setRoute] = useState<AppRoute>(initialRoute ?? clientNav.route);
  const [canonicalPath, setCanonicalPath] = useState<
    '/' | '/en/' | '/fa/' | '/projects/flow'
  >(initialCanonicalPath ?? clientNav.canonicalPath);
  const [locale, setLocale] = useState<Locale>(
    initialLocale ?? clientNav.locale
  );
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

  // Browser back/forward navigation support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      const parsed = parsePathname(window.location.pathname);
      setRoute(parsed.route);
      setCanonicalPath(parsed.canonicalPath);
      if (parsed.localeFromPath) {
        setLocale(parsed.localeFromPath);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keep HTML lang, dir, title, description, canonical, hreflang, and OpenGraph synced across routes & locales
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dataset.route = route;

    const seo = getSeoMetadata({ route, locale, canonicalPath });
    document.title = seo.title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    updateMeta('meta[name="description"]', 'content', seo.description);
    updateMeta('meta[property="og:type"]', 'content', seo.ogType);
    updateMeta('meta[property="og:url"]', 'content', seo.canonicalUrl);
    updateMeta('meta[property="og:title"]', 'content', seo.title);
    updateMeta('meta[property="og:description"]', 'content', seo.description);
    updateMeta('meta[property="og:locale"]', 'content', seo.ogLocale);
    updateMeta(
      'meta[property="og:locale:alternate"]',
      'content',
      seo.ogLocaleAlternate
    );
    updateMeta('meta[name="twitter:title"]', 'content', seo.title);
    updateMeta('meta[name="twitter:description"]', 'content', seo.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.canonicalUrl);

    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());
    for (const alt of seo.hreflangAlternates) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.hreflang);
      link.setAttribute('href', alt.href);
      document.head.appendChild(link);
    }
  }, [route, locale, canonicalPath]);

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

  const handleToggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === 'en' ? 'fa' : 'en';
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        // Storage disabled
      }
      if (route === 'home' && typeof window !== 'undefined') {
        const targetPath = next === 'fa' ? '/fa/' : '/';
        if (window.location.pathname !== targetPath) {
          window.history.pushState(null, '', targetPath);
        }
        setCanonicalPath(next === 'fa' ? '/fa/' : '/');
      }
      return next;
    });
  }, [route]);

  const scrollToTopImmediate = useCallback(() => {
    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const doScroll = () => {
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
      };

      if (route !== 'home') {
        const nextHomePath = getRoutePath('home', locale);
        if (typeof window !== 'undefined') {
          const nextHref =
            sectionId && sectionId !== 'home'
              ? `${nextHomePath}#${sectionId}`
              : nextHomePath;
          window.history.pushState(null, '', nextHref);
        }
        setRoute('home');
        setCanonicalPath(locale === 'fa' ? '/fa/' : '/');
        requestAnimationFrame(() => {
          requestAnimationFrame(doScroll);
        });
        return;
      }

      doScroll();
    },
    [route, locale, prefersReducedMotion]
  );

  const openFlowCaseStudy = useCallback(() => {
    if (route === 'flow') {
      scrollToTopImmediate();
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/projects/flow');
    }
    setRoute('flow');
    setCanonicalPath('/projects/flow');
    scrollToTopImmediate();
  }, [route, scrollToTopImmediate]);

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
    if (route !== 'home') return;
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
  }, [route]);

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

  const ResolvedFlowPage = FlowPageComponent ?? LazyFlowCaseStudyPage;

  const pageShell = (
    <div className="relative min-h-screen bg-[var(--ermia-bg)] text-[var(--ermia-text)] transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[var(--ermia-accent)] focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-[var(--ermia-accent-contrast)] focus:shadow-lg focus:outline-none"
      >
        {locale === 'fa' ? 'پرش به محتوای اصلی' : 'Skip to main content'}
      </a>

      <AmbientBackground />

      <CursorSpotlight theme={theme} />

      <ScrollProgress
        locale={locale}
        activeSection={activeSection}
        sectionLabels={sectionLabels}
        showSectionBadge={route === 'home'}
      />

      <LiquidGlassNav
        locale={locale}
        theme={theme}
        currentRoute={route}
        content={content.nav}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenFlowCaseStudy={openFlowCaseStudy}
        onToggleLocale={handleToggleLocale}
        onToggleTheme={handleToggleTheme}
      />

      {route === 'flow' ? (
        <main id="main-content" className="relative z-10">
          {FlowPageComponent ? (
            <FlowPageComponent
              locale={locale}
              theme={theme}
              projectsContent={content.projects}
              navContent={content.nav}
              onNavigateHome={(sectionId) =>
                scrollToSection(sectionId ?? 'home')
              }
            />
          ) : (
            <Suspense
              fallback={
                <div className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6">
                  <div className="h-10 w-48 animate-pulse rounded-xl bg-[var(--ermia-surface)]" />
                  <div className="mt-6 h-24 max-w-3xl animate-pulse rounded-2xl bg-[var(--ermia-surface)]" />
                </div>
              }
            >
              <ResolvedFlowPage
                locale={locale}
                theme={theme}
                projectsContent={content.projects}
                navContent={content.nav}
                onNavigateHome={(sectionId) =>
                  scrollToSection(sectionId ?? 'home')
                }
              />
            </Suspense>
          )}
        </main>
      ) : (
        <>
          <main id="main-content" className="relative z-10">
            <HeroSection
              locale={locale}
              theme={theme}
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

            <LiquidPortalDivider
              direction="down"
              bottomBgClass="text-[var(--ermia-bg-secondary)]/70"
            />

            <ProjectsSection
              locale={locale}
              theme={theme}
              content={content.projects}
              onOpenCaseStudy={openFlowCaseStudy}
            />

            <LiquidPortalDivider
              direction="up"
              bottomBgClass="text-[var(--ermia-bg-secondary)]/70"
            />

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
            onOpenFlowCaseStudy={openFlowCaseStudy}
          />
        </>
      )}
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
