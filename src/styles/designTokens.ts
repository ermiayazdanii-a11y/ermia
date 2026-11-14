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
    accentContrast: '#090C09',
    accentMuted: '#89917B',
    borderSubtle: 'rgba(240, 241, 233, 0.12)',
  },
  light: {
    bgPrimary: '#F4F5EF',
    bgSecondary: '#EAEDDF',
    bgElevated: '#FFFFFF',
    textPrimary: '#171B14',
    textSecondary: '#58604F',
    accent: '#536A00',
    accentContrast: '#FFFFFF',
    accentMuted: '#68715D',
    borderSubtle: 'rgba(23, 27, 20, 0.12)',
  },
} as const;

export const MOTION_EASE = {
  cinematic: [0.16, 1, 0.3, 1] as [number, number, number, number],
  smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

export const MOTION_TIMING = {
  fast: 0.18,
  normal: 0.36,
  reveal: 0.65,
  cinematic: 0.78,
} as const;

export const SPRING_CONFIG = {
  spotlight: { stiffness: 150, damping: 26, mass: 0.45 },
  spotlightOpacity: { stiffness: 180, damping: 28 },
  magnetic: { stiffness: 260, damping: 20, mass: 0.35 },
  cardTilt: { stiffness: 200, damping: 24 },
  tabPill: { type: 'spring' as const, stiffness: 380, damping: 32 },
  timelineLine: { stiffness: 140, damping: 26, restDelta: 0.001 },
  scrollProgress: { stiffness: 220, damping: 32, restDelta: 0.001 },
} as const;

export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.14,
} as const;

export const LENIS_CONFIG = {
  lerp: 0.11,
  wheelMultiplier: 1.0,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: false,
} as const;

export const PORTRAIT_IMAGE_PATH = SITE_CONFIG.portraitPath;
