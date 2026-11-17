export const SITE_CONFIG = {
  brand: 'ERMIA',
  fullName: 'Ermia Yazdani',
  githubUsername: 'ermiayazdanii-a11y',
  githubUrl: 'https://github.com/ermiayazdanii-a11y',
  portraitPath: '/images/ermia-portrait.jpg',
  portraitCutoutPath: '/images/ermia-cutout.webp',
  portraitCutoutFallbackPath: '/images/ermia-cutout.png',
  contactEmail: (import.meta.env.VITE_CONTACT_EMAIL ?? '').trim(),
  siteUrl: (
    import.meta.env.VITE_SITE_URL ||
    'https://ermia-personal-portfolio.ai.studio/'
  ).trim(),
} as const;
