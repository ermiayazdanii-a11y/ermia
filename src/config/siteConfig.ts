const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string | undefined>);

const DEFAULT_SITE_URL = 'https://ermia-personal-portfolio.ai.studio/';

function normalizeBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim() || DEFAULT_SITE_URL;
  try {
    const parsed = new URL(trimmed);
    return parsed.origin + (parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`);
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_CONFIG = {
  brand: 'ERMIA',
  fullName: 'Ermia Yazdani',
  fullNameFa: 'ارمیا یزدانی',
  githubUsername: 'ermiayazdanii-a11y',
  githubUrl: 'https://github.com/ermiayazdanii-a11y',
  portraitPath: '/images/ermia-portrait.jpg',
  portraitCutoutPath: '/images/ermia-cutout.webp',
  portraitCutoutFallbackPath: '/images/ermia-cutout.png',
  contactEmail: (env.VITE_CONTACT_EMAIL ?? '').trim(),
  siteUrl: normalizeBaseUrl(env.VITE_SITE_URL ?? DEFAULT_SITE_URL),
  gscVerificationTokens: [
    '1MIHamZfnu8ZaOwys2FycuR1lvnD1EVdrnUKmGvuUnI',
    'ZznoVNUGChbDMXH4Or0koQby6E3vwkP2o4AMwVUYDko',
  ] as const,
} as const;

export function getSiteBaseUrl(overrideUrl?: string): string {
  return overrideUrl ? normalizeBaseUrl(overrideUrl) : SITE_CONFIG.siteUrl;
}

export function buildAbsoluteUrl(routePath = '/', overrideBaseUrl?: string): string {
  const base = getSiteBaseUrl(overrideBaseUrl);
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  if (!routePath || routePath === '/') {
    return `${cleanBase}/`;
  }
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${cleanBase}${normalizedPath}`;
}
