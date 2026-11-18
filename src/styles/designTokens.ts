import { SITE_CONFIG } from '../config/siteConfig';

export type ThemeMode = 'dark' | 'light';

export const THEME_PALETTES = {
  dark: {
    bgPrimary: '#090C09',
    bgSecondary: '#11150F',
    bgElevated: '#171B16',
    textPrimary: '#F0F1E9',
    textSecondary: '#A4AA9B',
    accent: '#D8F15A',
    accentHover: '#E3F67F',
    accentContrast: '#090C09',
    accentMuted: '#89917B',
    borderSubtle: 'rgba(240, 241, 233, 0.12)',
    borderStrong: 'rgba(240, 241, 233, 0.24)',
    glassSurface: 'rgba(23, 27, 22, 0.72)',
    glassHighlight: 'rgba(240, 241, 233, 0.16)',
  },
  light: {
    bgPrimary: '#F4F5EF',
    bgSecondary: '#EAEDDF',
    bgElevated: '#FFFFFF',
    textPrimary: '#171B14',
    textSecondary: '#58604F',
    accent: '#536A00',
    accentHover: '#425400',
    accentContrast: '#FFFFFF',
    accentMuted: '#68715D',
    borderSubtle: 'rgba(23, 27, 20, 0.12)',
    borderStrong: 'rgba(23, 27, 20, 0.22)',
    glassSurface: 'rgba(255, 255, 255, 0.78)',
    glassHighlight: 'rgba(255, 255, 255, 0.92)',
  },
} as const;

export const TYPOGRAPHY_TOKENS = {
  families: {
    display: '"Outfit", "Vazirmatn", ui-sans-serif, system-ui, sans-serif',
    sans: '"Plus Jakarta Sans", "Vazirmatn", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  scale: {
    heroDisplay: 'clamp(2.15rem, 4.6vw, 4.1rem)',
    sectionHeading: 'clamp(1.75rem, 3.2vw, 2.5rem)',
    cardHeading: '1.25rem',
    body: '1rem',
    meta: '0.75rem',
  },
} as const;

export const LAYOUT_TOKENS = {
  containerMaxWidth: '72rem', // 1152px (max-w-6xl)
  navMaxWidth: '64rem', // 1024px (max-w-5xl)
  gutterMobile: '1rem',
  gutterDesktop: '1.5rem',
  sectionPaddingY: 'clamp(4.5rem, 8vw, 7rem)',
  radii: {
    outer: '1.25rem', // 20px
    card: '1rem', // 16px
    control: '0.75rem', // 12px
    inner: '0.625rem', // 10px
  },
  breakpoints: [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920] as const,
} as const;

export const MOTION_EASE = {
  cinematic: [0.16, 1, 0.3, 1] as [number, number, number, number],
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
  sharp: [0.2, 0, 0, 1] as [number, number, number, number],
  glass: [0.25, 0.9, 0.3, 1] as [number, number, number, number],
} as const;

export const MOTION_TIMING = {
  fast: 0.18,
  normal: 0.36,
  reveal: 0.65,
  cinematic: 0.82,
} as const;

export const SPRING_CONFIG = {
  spotlight: { stiffness: 150, damping: 26, mass: 0.45 },
  spotlightOpacity: { stiffness: 180, damping: 28 },
  magnetic: { stiffness: 260, damping: 20, mass: 0.35 },
  cardTilt: { stiffness: 210, damping: 24 },
  heroTilt: { stiffness: 140, damping: 22, mass: 0.6 },
  monogram3d: { stiffness: 170, damping: 20, mass: 0.55 },
  tabPill: { type: 'spring' as const, stiffness: 380, damping: 32 },
  timelineLine: { stiffness: 140, damping: 26, restDelta: 0.001 },
  timelineMarker: { type: 'spring' as const, stiffness: 360, damping: 24, mass: 0.6 },
  timelineConnector: { duration: 0.34, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  scrollProgress: { stiffness: 220, damping: 32, restDelta: 0.001 },
} as const;

export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.12,
} as const;

export const LENIS_CONFIG = {
  lerp: 0.11,
  wheelMultiplier: 1.0,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: false,
} as const;

export const PORTRAIT_IMAGE_PATH = SITE_CONFIG.portraitPath;
export const PORTRAIT_CUTOUT_PATH = SITE_CONFIG.portraitCutoutPath;
export const PORTRAIT_CUTOUT_FALLBACK_PATH =
  SITE_CONFIG.portraitCutoutFallbackPath;
