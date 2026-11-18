import type { Locale } from '../data/ermiaData';

export type AppRoute = 'home' | 'flow';

export interface ParsedRoute {
  route: AppRoute;
  localeFromPath: Locale | null;
  canonicalPath: '/' | '/en/' | '/fa/' | '/projects/flow';
}

export function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  const cleaned = pathname.split('?')[0].split('#')[0] || '/';
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export function parsePathname(pathname: string): ParsedRoute {
  const clean = normalizePathname(pathname);

  if (clean === '/fa' || clean === '/fa/') {
    return { route: 'home', localeFromPath: 'fa', canonicalPath: '/fa/' };
  }

  if (clean === '/en' || clean === '/en/') {
    return { route: 'home', localeFromPath: 'en', canonicalPath: '/en/' };
  }

  if (
    clean === '/projects/flow' ||
    clean === '/projects/flow/' ||
    clean === '/fa/projects/flow' ||
    clean === '/fa/projects/flow/' ||
    clean === '/en/projects/flow' ||
    clean === '/en/projects/flow/'
  ) {
    const localeFromPath: Locale | null = clean.startsWith('/fa/')
      ? 'fa'
      : clean.startsWith('/en/')
        ? 'en'
        : null;
    return {
      route: 'flow',
      localeFromPath,
      canonicalPath: '/projects/flow',
    };
  }

  return { route: 'home', localeFromPath: 'en', canonicalPath: '/' };
}

export function getRoutePath(route: AppRoute, locale: Locale): string {
  if (route === 'flow') {
    return '/projects/flow';
  }
  return locale === 'fa' ? '/fa/' : '/';
}
