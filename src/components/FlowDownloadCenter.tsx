import {
  ArrowUpLeft,
  ArrowUpRight,
  Clock3,
  Download,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import {
  FLOW_RELEASE_CONFIG,
  isValidExternalUrl,
  resolveFlowDistributionAction,
} from '../config/flowReleaseConfig';
import type { Locale } from '../data/ermiaData';
import type { FlowProductLocaleContent } from '../data/flowProductData';

interface FlowDownloadCenterProps {
  locale: Locale;
  copy: FlowProductLocaleContent['downloadSection'];
  onNavigateContact: () => void;
}

export function FlowDownloadCenter({
  locale,
  copy,
  onNavigateContact,
}: FlowDownloadCenterProps) {
  const distribution = resolveFlowDistributionAction(FLOW_RELEASE_CONFIG);
  const ArrowIcon = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  const hasValidReleaseNotesUrl = isValidExternalUrl(
    FLOW_RELEASE_CONFIG.RELEASE_NOTES_URL
  );
  const hasExternalPrivacyUrl = isValidExternalUrl(
    FLOW_RELEASE_CONFIG.PRIVACY_POLICY_URL
  );
  const hasExternalSupportUrl = isValidExternalUrl(
    FLOW_RELEASE_CONFIG.SUPPORT_CONTACT_URL
  );

  const specs = [
    { label: copy.specLabels.platform, value: copy.platformValue },
    { label: copy.specLabels.version, value: FLOW_RELEASE_CONFIG.APP_VERSION },
    { label: copy.specLabels.releaseDate, value: FLOW_RELEASE_CONFIG.RELEASE_DATE },
    { label: copy.specLabels.downloadSize, value: FLOW_RELEASE_CONFIG.DOWNLOAD_SIZE },
    {
      label: copy.specLabels.compatibility,
      value: FLOW_RELEASE_CONFIG.MINIMUM_ANDROID_VERSION,
    },
    {
      label: copy.specLabels.distributionStatus,
      value: copy.statusTitles[distribution.ctaKey],
    },
  ];

  return (
    <section
      id="flow-download-center"
      aria-labelledby="flow-download-heading"
      className="space-y-8 py-4"
    >
      {/* Section Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--ermia-accent)]">
          <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
            04
          </span>
          <span aria-hidden="true" className="text-[var(--ermia-muted)]">
            ·
          </span>
          <span>{copy.kicker}</span>
        </div>
        <h2
          id="flow-download-heading"
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-3xl text-balance"
        >
          {copy.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
          {copy.subtitle}
        </p>
      </div>

      {/* Centralized Release Card + Verified Platform Specifications */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Honest Release State & Action Control */}
        <div className="flex flex-col justify-between rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8 lg:col-span-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ermia-border)] pb-4">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--ermia-accent)]">
                <Smartphone className="h-4 w-4" strokeWidth={1.75} />
                <span>{copy.platformValue}</span>
              </div>
              <span className="font-mono text-xs text-[var(--ermia-text-secondary)]">
                {copy.statusTitles[distribution.ctaKey]}
              </span>
            </div>

            <h3 className="font-display text-2xl font-semibold tracking-tight text-[var(--ermia-text)]">
              {copy.statusTitles[distribution.ctaKey]}
            </h3>

            <p className="text-sm leading-[1.8] text-[var(--ermia-text-secondary)]">
              {copy.statusDescriptions[distribution.ctaKey]}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {distribution.kind === 'link' && distribution.href ? (
              <a
                href={distribution.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--ermia-accent)] px-6 py-3 text-sm font-semibold text-[var(--ermia-accent-contrast)] shadow-[0_12px_28px_-12px_rgba(var(--ermia-spotlight-rgb),0.45)] transition-colors duration-150 hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] sm:w-auto"
              >
                {distribution.ctaKey === 'public_apk' ? (
                  <Download className="h-4 w-4 shrink-0" strokeWidth={2} />
                ) : (
                  <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={2} />
                )}
                <span>{copy.ctaLabels[distribution.ctaKey]}</span>
              </a>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--ermia-border-strong)] bg-[var(--ermia-bg)] px-5 py-3 text-sm font-medium text-[var(--ermia-text)] sm:w-auto"
              >
                <Clock3
                  className="h-4 w-4 shrink-0 text-[var(--ermia-accent)]"
                  strokeWidth={1.75}
                />
                <span>{copy.ctaLabels.coming_soon}</span>
              </div>
            )}

            <p className="text-xs leading-relaxed text-[var(--ermia-muted)]">
              {copy.externalHostNotice}
            </p>

            {/* Quick Distribution Utility Links */}
            <div className="flex flex-wrap items-center gap-4 border-t border-[var(--ermia-border)] pt-4 text-xs">
              {hasValidReleaseNotesUrl && (
                <a
                  href={FLOW_RELEASE_CONFIG.RELEASE_NOTES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[var(--ermia-text)] transition-colors hover:text-[var(--ermia-accent)]"
                >
                  <span>{copy.releaseNotesLinkLabel}</span>
                  <ArrowIcon className="h-3.5 w-3.5" />
                </a>
              )}

              {hasExternalPrivacyUrl ? (
                <a
                  href={FLOW_RELEASE_CONFIG.PRIVACY_POLICY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[var(--ermia-text-secondary)] transition-colors hover:text-[var(--ermia-accent)]"
                >
                  <span>{copy.privacyLinkLabel}</span>
                  <ArrowIcon className="h-3.5 w-3.5" />
                </a>
              ) : (
                <a
                  href="#flow-privacy"
                  className="inline-flex items-center gap-1 font-medium text-[var(--ermia-text-secondary)] transition-colors hover:text-[var(--ermia-accent)]"
                >
                  <span>{copy.privacyLinkLabel}</span>
                </a>
              )}

              {hasExternalSupportUrl ? (
                <a
                  href={FLOW_RELEASE_CONFIG.SUPPORT_CONTACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[var(--ermia-text-secondary)] transition-colors hover:text-[var(--ermia-accent)]"
                >
                  <span>{copy.supportLinkLabel}</span>
                  <ArrowIcon className="h-3.5 w-3.5" />
                </a>
              ) : (
                <a
                  href="/#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateContact();
                  }}
                  className="inline-flex items-center gap-1 font-medium text-[var(--ermia-text-secondary)] transition-colors hover:text-[var(--ermia-accent)]"
                >
                  <span>{copy.supportLinkLabel}</span>
                  <ArrowIcon className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Technical Release Specifications Grid */}
        <div className="rounded-3xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8 lg:col-span-6">
          <h3 className="font-display text-lg font-medium text-[var(--ermia-text)]">
            {copy.releaseInfoHeading}
          </h3>
          <dl className="mt-5 divide-y divide-[var(--ermia-border)]">
            {specs.map((row) => (
              <div
                key={row.label}
                className="flex flex-col justify-between gap-1 py-3.5 sm:flex-row sm:items-center sm:gap-4"
              >
                <dt className="text-xs text-[var(--ermia-muted)]">{row.label}</dt>
                <dd className="font-mono text-xs font-medium text-[var(--ermia-text)] sm:text-end">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* What's New, Version History & Verified Privacy Disclosure */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* What's New in Current Build */}
        <div className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 lg:col-span-5">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--ermia-accent)]">
            <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            <span>{copy.whatsNewHeading}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {copy.whatsNewItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ermia-accent)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Structured FLOW Development Journal + Privacy Note */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6">
            <p className="text-xs font-medium text-[var(--ermia-accent)]">
              {copy.journalKicker}
            </p>
            <h3 className="mt-1 font-display text-lg font-medium text-[var(--ermia-text)]">
              {copy.journalHeading}
            </h3>

            <div className="mt-5 space-y-5">
              {copy.versionHistory.map((entry) => (
                <article
                  key={entry.version}
                  className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4 sm:p-5"
                >
                  {/* Structured Header Metadata: Version, Date, Development Status */}
                  <div className="grid grid-cols-1 gap-3 border-b border-[var(--ermia-border)] pb-3.5 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] text-[var(--ermia-muted)]">
                        {copy.journalLabels.version}
                      </p>
                      <p className="mt-0.5 font-display text-sm font-medium text-[var(--ermia-text)]">
                        {entry.version}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[var(--ermia-muted)]">
                        {copy.journalLabels.releaseDate}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-[var(--ermia-text-secondary)]">
                        {entry.releaseDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[var(--ermia-muted)]">
                        {copy.journalLabels.status}
                      </p>
                      <p className="mt-0.5 font-mono text-xs font-medium text-[var(--ermia-accent)]">
                        {entry.developmentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Structured Journal Sections: New Features, Improvements, Bug Fixes */}
                  <div className="mt-4 space-y-3.5">
                    <div>
                      <p className="text-xs font-medium text-[var(--ermia-accent)]">
                        {copy.journalLabels.newFeatures}
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {entry.newFeatures.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ermia-accent)]"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[var(--ermia-text)]">
                        {copy.journalLabels.improvements}
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {entry.improvements.map((imp) => (
                          <li
                            key={imp}
                            className="flex items-start gap-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--ermia-border-strong)]"
                            />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[var(--ermia-muted)]">
                        {copy.journalLabels.bugFixes}
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {entry.bugFixes.map((fix) => (
                          <li
                            key={fix}
                            className="text-xs leading-relaxed text-[var(--ermia-muted)]"
                          >
                            {fix}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div
            id="flow-privacy"
            className="scroll-mt-24 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 p-6"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--ermia-accent)]">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
              <span>{copy.privacyTitle}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
              {copy.privacyBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
