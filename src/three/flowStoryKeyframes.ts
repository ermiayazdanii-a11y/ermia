import type { FlowScreenKey } from './flowPhoneModel';

export interface FlowStoryKeyframe {
  t: number;
  phonePos: [number, number, number];
  phoneRot: [number, number, number];
  phoneScale: number;
  camPos: [number, number, number];
  camFov: number;
  orbitRot: [number, number, number];
  orbitScale: number;
  screenId: FlowScreenKey;
  accentColorHex: number;
  plateSpread: number;
}

export interface FlowStoryPose {
  phoneX: number;
  phoneY: number;
  phoneZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  phoneScale: number;
  camX: number;
  camY: number;
  camZ: number;
  camFov: number;
  orbitRotX: number;
  orbitRotY: number;
  orbitRotZ: number;
  orbitScale: number;
  plateSpread: number;
  accentHex: number;
  screenA: FlowScreenKey;
  screenB: FlowScreenKey;
  screenMix: number;
  chapterIndex: number;
}

/**
 * Exact 8 scroll-choreography checkpoints matching Part 2:
 * 0.00 Intro -> 0.15 Dashboard -> 0.30 Avatar Studio -> 0.45 Widgets & Routines ->
 * 0.60 Themes & Oblique Titanium Hardware -> 0.75 Memories & Progression ->
 * 0.90 Center Hero Product Shot -> 1.00 Release & Download Transition
 */
const DESKTOP_KEYFRAMES: FlowStoryKeyframe[] = [
  {
    t: 0.0,
    phonePos: [0.68, -0.04, -1.05],
    phoneRot: [0.22, -0.44, 0.08],
    phoneScale: 0.88,
    camPos: [0, 0.08, 4.35],
    camFov: 36,
    orbitRot: [0.35, -0.25, 0.15],
    orbitScale: 0.92,
    screenId: 'today-dashboard',
    accentColorHex: 0xd8f15a,
    plateSpread: 0.75,
  },
  {
    t: 0.15,
    phonePos: [0.66, 0.0, 0.0],
    phoneRot: [0.06, -0.22, -0.02],
    phoneScale: 1.02,
    camPos: [0.05, 0.02, 3.65],
    camFov: 34,
    orbitRot: [0.42, 0.18, 0.08],
    orbitScale: 1.0,
    screenId: 'today-dashboard',
    accentColorHex: 0x7dd3fc,
    plateSpread: 1.0,
  },
  {
    t: 0.3,
    phonePos: [-0.72, 0.02, 0.05],
    phoneRot: [0.04, 0.28, 0.03],
    phoneScale: 1.04,
    camPos: [-0.08, 0.02, 3.55],
    camFov: 34,
    orbitRot: [0.25, 0.65, -0.14],
    orbitScale: 1.08,
    screenId: 'companion-sanctuary',
    accentColorHex: 0xd8f15a,
    plateSpread: 1.15,
  },
  {
    t: 0.45,
    phonePos: [0.68, 0.03, 0.08],
    phoneRot: [-0.06, -0.24, 0.04],
    phoneScale: 1.05,
    camPos: [0.08, 0.0, 3.58],
    camFov: 35,
    orbitRot: [-0.22, 1.18, 0.16],
    orbitScale: 1.14,
    screenId: 'focus-nebula',
    accentColorHex: 0xa78bfa,
    plateSpread: 1.24,
  },
  {
    t: 0.6,
    phonePos: [-0.54, 0.02, 0.14],
    phoneRot: [0.12, 0.74, -0.05],
    phoneScale: 1.06,
    camPos: [-0.05, 0.06, 3.52],
    camFov: 34,
    orbitRot: [0.48, 1.85, -0.12],
    orbitScale: 1.12,
    screenId: 'living-space-studio',
    accentColorHex: 0x5eead4,
    plateSpread: 1.16,
  },
  {
    t: 0.75,
    phonePos: [0.62, 0.02, 0.06],
    phoneRot: [0.05, -0.32, 0.03],
    phoneScale: 1.03,
    camPos: [0.05, 0.02, 3.62],
    camFov: 34,
    orbitRot: [0.18, 2.45, 0.2],
    orbitScale: 1.08,
    screenId: 'focus-nebula',
    accentColorHex: 0xf59e0b,
    plateSpread: 1.12,
  },
  {
    t: 0.9,
    phonePos: [0.0, 0.04, 0.18],
    phoneRot: [0.02, 0.0, 0.0],
    phoneScale: 1.08,
    camPos: [0.0, 0.02, 3.45],
    camFov: 33,
    orbitRot: [0.35, 3.1, 0.0],
    orbitScale: 1.02,
    screenId: 'today-dashboard',
    accentColorHex: 0xd8f15a,
    plateSpread: 0.92,
  },
  {
    t: 1.0,
    phonePos: [0.0, 0.22, -0.25],
    phoneRot: [-0.08, 0.08, 0.0],
    phoneScale: 0.96,
    camPos: [0.0, 0.08, 3.8],
    camFov: 34,
    orbitRot: [0.4, 3.55, 0.0],
    orbitScale: 0.88,
    screenId: 'today-dashboard',
    accentColorHex: 0xd8f15a,
    plateSpread: 0.65,
  },
];

const MOBILE_KEYFRAMES: FlowStoryKeyframe[] = DESKTOP_KEYFRAMES.map((kf) => ({
  ...kf,
  // Keep phone horizontally centered above bottom summary card on < 768px screens
  phonePos: [0, kf.t === 1.0 ? 0.32 : 0.24, kf.t === 0 ? -0.45 : 0],
  phoneScale: kf.phoneScale * 0.86,
  camPos: [0, 0.02, kf.t === 0 ? 4.4 : 3.95],
  camFov: 36,
  plateSpread: kf.plateSpread * 0.72,
}));

function smoothstep01(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHexColor(hexA: number, hexB: number, t: number): number {
  const rA = (hexA >> 16) & 255;
  const gA = (hexA >> 8) & 255;
  const bA = hexA & 255;

  const rB = (hexB >> 16) & 255;
  const gB = (hexB >> 8) & 255;
  const bB = hexB & 255;

  const r = Math.round(lerp(rA, rB, t));
  const g = Math.round(lerp(gA, gB, t));
  const b = Math.round(lerp(bA, bB, t));

  return (r << 16) | (g << 8) | b;
}

export function evaluateFlowStoryPose(
  rawProgress: number,
  options: { isRtl: boolean; isMobile: boolean; isDark: boolean }
): FlowStoryPose {
  const p = Math.max(0, Math.min(1, rawProgress));
  const frames = options.isMobile ? MOBILE_KEYFRAMES : DESKTOP_KEYFRAMES;

  let idx = 0;
  for (let i = 0; i < frames.length - 1; i++) {
    if (p >= frames[i].t && p <= frames[i + 1].t) {
      idx = i;
      break;
    }
  }
  if (p >= frames[frames.length - 1].t) {
    idx = frames.length - 2;
  }

  const a = frames[idx];
  const b = frames[idx + 1];
  const span = Math.max(0.0001, b.t - a.t);
  const localT = smoothstep01((p - a.t) / span);

  const mirror = options.isRtl && !options.isMobile ? -1 : 1;

  // Screen transition occurs crisply in the middle 30%..70% of each segment
  const screenMix =
    a.screenId === b.screenId ? 0 : smoothstep01((localT - 0.28) / 0.44);

  // Closest chapter index for UI synchronization
  let chapterIndex = 0;
  let minDist = Infinity;
  for (let i = 0; i < frames.length; i++) {
    const d = Math.abs(p - frames[i].t);
    if (d < minDist) {
      minDist = d;
      chapterIndex = i;
    }
  }

  let accentHex = lerpHexColor(a.accentColorHex, b.accentColorHex, localT);
  if (!options.isDark) {
    // Deepen luminous neon accent for clean contrast in Daylight theme
    accentHex = lerpHexColor(accentHex, 0x425400, 0.35);
  }

  return {
    phoneX: lerp(a.phonePos[0], b.phonePos[0], localT) * mirror,
    phoneY: lerp(a.phonePos[1], b.phonePos[1], localT),
    phoneZ: lerp(a.phonePos[2], b.phonePos[2], localT),
    rotX: lerp(a.phoneRot[0], b.phoneRot[0], localT),
    rotY: lerp(a.phoneRot[1], b.phoneRot[1], localT) * mirror,
    rotZ: lerp(a.phoneRot[2], b.phoneRot[2], localT) * mirror,
    phoneScale: lerp(a.phoneScale, b.phoneScale, localT),
    camX: lerp(a.camPos[0], b.camPos[0], localT) * mirror,
    camY: lerp(a.camPos[1], b.camPos[1], localT),
    camZ: lerp(a.camPos[2], b.camPos[2], localT),
    camFov: lerp(a.camFov, b.camFov, localT),
    orbitRotX: lerp(a.orbitRot[0], b.orbitRot[0], localT),
    orbitRotY: lerp(a.orbitRot[1], b.orbitRot[1], localT) * mirror,
    orbitRotZ: lerp(a.orbitRot[2], b.orbitRot[2], localT) * mirror,
    orbitScale: lerp(a.orbitScale, b.orbitScale, localT),
    plateSpread: lerp(a.plateSpread, b.plateSpread, localT),
    accentHex,
    screenA: a.screenId,
    screenB: b.screenId,
    screenMix,
    chapterIndex,
  };
}
