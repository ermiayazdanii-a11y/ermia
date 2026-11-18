export type FlowReleaseStatus =
  | 'development'
  | 'private_beta'
  | 'public_apk'
  | 'google_play';

export interface FlowReleaseConfig {
  APP_RELEASE_STATUS: FlowReleaseStatus;
  APP_VERSION: string;
  RELEASE_DATE: string;
  APK_DOWNLOAD_URL: string;
  PLAY_STORE_URL: string;
  BETA_INVITATION_URL: string;
  DOWNLOAD_SIZE: string;
  MINIMUM_ANDROID_VERSION: string;
  RELEASE_NOTES_URL: string;
  PRIVACY_POLICY_URL: string;
  SUPPORT_CONTACT_URL: string;
}

const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string | undefined>);

const VALID_STATUSES: FlowReleaseStatus[] = [
  'development',
  'private_beta',
  'public_apk',
  'google_play',
];

function parseReleaseStatus(raw?: string): FlowReleaseStatus {
  const normalized = (raw ?? '').trim().toLowerCase() as FlowReleaseStatus;
  return VALID_STATUSES.includes(normalized) ? normalized : 'development';
}

export function isValidExternalUrl(raw?: string): boolean {
  const value = (raw ?? '').trim();
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const FLOW_RELEASE_CONFIG: FlowReleaseConfig = {
  APP_RELEASE_STATUS: parseReleaseStatus(env.VITE_FLOW_RELEASE_STATUS),
  APP_VERSION:
    (env.VITE_FLOW_APP_VERSION ?? '').trim() || 'In Active Development (Pre-Release)',
  RELEASE_DATE:
    (env.VITE_FLOW_RELEASE_DATE ?? '').trim() || 'Unreleased — Active Android Build',
  APK_DOWNLOAD_URL: (env.VITE_FLOW_APK_DOWNLOAD_URL ?? '').trim(),
  PLAY_STORE_URL: (env.VITE_FLOW_PLAY_STORE_URL ?? '').trim(),
  BETA_INVITATION_URL: (env.VITE_FLOW_BETA_INVITATION_URL ?? '').trim(),
  DOWNLOAD_SIZE:
    (env.VITE_FLOW_DOWNLOAD_SIZE ?? '').trim() || 'Pending Release Package',
  MINIMUM_ANDROID_VERSION:
    (env.VITE_FLOW_MIN_ANDROID ?? '').trim() || 'Android (Target SDK Confirmed at Release)',
  RELEASE_NOTES_URL: (env.VITE_FLOW_RELEASE_NOTES_URL ?? '').trim(),
  PRIVACY_POLICY_URL: (env.VITE_FLOW_PRIVACY_POLICY_URL ?? '').trim() || '#flow-privacy',
  SUPPORT_CONTACT_URL: (env.VITE_FLOW_SUPPORT_URL ?? '').trim() || '/#contact',
};

export interface FlowDistributionResolution {
  kind: 'coming_soon' | 'link';
  effectiveStatus: FlowReleaseStatus;
  ctaKey: 'coming_soon' | 'private_beta' | 'public_apk' | 'google_play';
  href: string | null;
  isExternal: boolean;
  hasConfirmedDistribution: boolean;
}

/**
 * Pure, testable distribution resolver enforcing zero fake links or dead buttons.
 * Any release state requiring an external URL gracefully falls back to "coming_soon"
 * unless a verified valid HTTP/HTTPS destination URL is explicitly configured.
 */
export function resolveFlowDistributionAction(
  config: FlowReleaseConfig
): FlowDistributionResolution {
  const status = config.APP_RELEASE_STATUS;

  if (status === 'private_beta' && isValidExternalUrl(config.BETA_INVITATION_URL)) {
    return {
      kind: 'link',
      effectiveStatus: 'private_beta',
      ctaKey: 'private_beta',
      href: config.BETA_INVITATION_URL.trim(),
      isExternal: true,
      hasConfirmedDistribution: true,
    };
  }

  if (status === 'public_apk' && isValidExternalUrl(config.APK_DOWNLOAD_URL)) {
    return {
      kind: 'link',
      effectiveStatus: 'public_apk',
      ctaKey: 'public_apk',
      href: config.APK_DOWNLOAD_URL.trim(),
      isExternal: true,
      hasConfirmedDistribution: true,
    };
  }

  if (status === 'google_play' && isValidExternalUrl(config.PLAY_STORE_URL)) {
    return {
      kind: 'link',
      effectiveStatus: 'google_play',
      ctaKey: 'google_play',
      href: config.PLAY_STORE_URL.trim(),
      isExternal: true,
      hasConfirmedDistribution: true,
    };
  }

  return {
    kind: 'coming_soon',
    effectiveStatus: 'development',
    ctaKey: 'coming_soon',
    href: null,
    isExternal: false,
    hasConfirmedDistribution: false,
  };
}
