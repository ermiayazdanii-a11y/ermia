import { FormEvent, useEffect, useState } from 'react';
import { ArrowUpLeft, ArrowUpRight, Check, Copy, Github, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { SITE_CONFIG } from '../config/siteConfig';
import { ErmiaLocaleContent, Locale } from '../data/ermiaData';
import { useMotionProfile } from '../hooks/useMotionProfile';
import {
  MOTION_EASE,
  REVEAL_VIEWPORT,
  ThemeMode,
} from '../styles/designTokens';
import { ErmiaWordmark } from './ErmiaWordmark';
import { InteractiveProjectCard } from './InteractiveProjectCard';
import { MagneticButton } from './MagneticButton';
import { ScrollReveal } from './ScrollReveal';
import { TextReveal } from './TextReveal';

interface TodayAndContactSectionProps {
  locale: Locale;
  theme: ThemeMode;
  todayContent: ErmiaLocaleContent['today'];
  contactContent: ErmiaLocaleContent['contact'];
  navContent: ErmiaLocaleContent['nav'];
  onNavigate: (sectionId: string) => void;
  onOpenFlowCaseStudy: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TodayAndContactSection({
  locale,
  theme,
  todayContent,
  contactContent,
  navContent,
  onNavigate,
  onOpenFlowCaseStudy,
}: TodayAndContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string>(contactContent.topicOptions[0]);
  const [message, setMessage] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [submittedDraft, setSubmittedDraft] = useState<{
    name: string;
    email: string;
    topic: string;
    message: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { prefersReducedMotion, allow3DTilt, revealDurationMultiplier } =
    useMotionProfile();

  const configuredMailto = SITE_CONFIG.contactEmail;
  const ExternalArrow = locale === 'fa' ? ArrowUpLeft : ArrowUpRight;

  useEffect(() => {
    setTopic(contactContent.topicOptions[0]);
    setValidationError(null);
  }, [contactContent.topicOptions]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setValidationError(contactContent.validationRequiredError);
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setValidationError(contactContent.validationEmailError);
      return;
    }

    setValidationError(null);
    setSubmittedDraft({
      name: trimmedName,
      email: trimmedEmail,
      topic,
      message: trimmedMessage,
    });
    setName('');
    setEmail('');
    setMessage('');
    setCopiedDraft(false);
  };

  const formattedDraftText = submittedDraft
    ? `Topic: ${submittedDraft.topic}\nFrom: ${submittedDraft.name} (${submittedDraft.email})\n\n${submittedDraft.message}`
    : '';

  const handleCopyDraft = async () => {
    if (!formattedDraftText) return;
    try {
      await navigator.clipboard.writeText(formattedDraftText);
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2400);
    } catch {
      setCopiedDraft(false);
    }
  };

  const footerLinks = [
    { id: 'home', label: navContent.home },
    { id: 'about', label: navContent.about },
    { id: 'journey', label: navContent.journey },
    { id: 'projects', label: navContent.projects },
    { id: 'skills', label: navContent.skills },
    { id: 'journal', label: navContent.journal },
    { id: 'contact', label: navContent.contact },
  ];

  return (
    <>
      {/* Closing "Today & What's Next" Section */}
      <section
        id="today"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28"
      >
        <ScrollReveal>
          <InteractiveProjectCard
            enableTilt={allow3DTilt}
            tiltStrength="subtle"
            theme={theme}
            className="p-6 sm:p-10"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
                <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                  06
                </span>
                <span aria-hidden="true" className="text-[var(--ermia-muted)]">
                  ·
                </span>
                <span>{todayContent.kicker}</span>
              </div>
              <TextReveal
                as="h2"
                locale={locale}
                splitWords
                scrollKinetic
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl text-balance"
              >
                {todayContent.title}
              </TextReveal>
              <p className="mt-4 text-sm leading-[1.85] text-[var(--ermia-text-secondary)] sm:text-base">
                {todayContent.description}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--ermia-border)] pt-8 md:grid-cols-3">
              {todayContent.focusItems.map((item, idx) => (
                <motion.div
                  key={item.index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{
                    duration: 0.45 * revealDurationMultiplier,
                    delay: prefersReducedMotion ? 0 : idx * 0.06,
                    ease: MOTION_EASE.cinematic,
                  }}
                  className="space-y-2"
                >
                  <span className="font-mono text-xs tabular-nums text-[var(--ermia-accent)]">
                    {item.index}
                  </span>
                  <h3 className="font-display text-lg font-medium text-[var(--ermia-text)]">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--ermia-text-secondary)] sm:text-sm">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </InteractiveProjectCard>
        </ScrollReveal>
      </section>

      {/* Contact & Brand Signature Footer */}
      <footer
        id="contact"
        className="relative scroll-mt-24 border-t border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/85 pt-20 pb-12 sm:pt-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--ermia-accent)]/35 to-transparent"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: Verified Public GitHub + Honest Privacy Posture */}
            <ScrollReveal className="lg:col-span-5">
              <div className="flex items-center gap-3 text-xs font-medium text-[var(--ermia-accent)]">
                <span className="font-mono tabular-nums text-[var(--ermia-muted)]">
                  07
                </span>
                <span aria-hidden="true" className="text-[var(--ermia-muted)]">
                  ·
                </span>
                <span>{contactContent.kicker}</span>
              </div>
              <TextReveal
                as="h2"
                locale={locale}
                splitWords
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--ermia-text)] sm:text-4xl text-balance"
              >
                {contactContent.title}
              </TextReveal>
              <p className="mt-4 text-sm leading-[1.8] text-[var(--ermia-text-secondary)] sm:text-base">
                {contactContent.subtitle}
              </p>

              {/* Verified GitHub Profile Card */}
              <div className="mt-8 rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-5">
                <p className="text-xs text-[var(--ermia-text-secondary)]">
                  {contactContent.githubCardLabel}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Github
                      className="h-4.5 w-4.5 text-[var(--ermia-accent)]"
                      strokeWidth={1.75}
                    />
                    <span
                      dir="ltr"
                      className="font-mono text-sm font-medium text-[var(--ermia-text)]"
                    >
                      {SITE_CONFIG.githubUsername}
                    </span>
                  </div>

                  <a
                    href={SITE_CONFIG.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-3.5 py-1.5 text-xs font-medium text-[var(--ermia-text)] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)]"
                  >
                    <span>{contactContent.githubButtonLabel}</span>
                    <ExternalArrow className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </a>
                </div>
                <p className="mt-4 border-t border-[var(--ermia-border)] pt-3 text-xs leading-relaxed text-[var(--ermia-muted)]">
                  {contactContent.privacyNote}
                </p>
              </div>
            </ScrollReveal>

            {/* Right: Honest Local Draft / Configurable Mailto Composer */}
            <ScrollReveal
              delay={0.08}
              className="rounded-2xl border border-[var(--ermia-border)] bg-[var(--ermia-surface)] p-6 sm:p-8 lg:col-span-7"
            >
              {submittedDraft ? (
                <div className="py-4">
                  <h3 className="font-display text-2xl font-semibold text-[var(--ermia-text)]">
                    {contactContent.draftReadyTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
                    {configuredMailto
                      ? contactContent.draftReadyMailtoBody
                      : contactContent.draftReadyPrivateBody}
                  </p>

                  <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] p-4 font-sans text-xs leading-relaxed text-[var(--ermia-text)]">
                    {formattedDraftText}
                  </pre>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {configuredMailto && (
                      <a
                        href={`mailto:${configuredMailto}?subject=${encodeURIComponent(
                          `ERMIA — ${submittedDraft.topic} (${submittedDraft.name})`
                        )}&body=${encodeURIComponent(formattedDraftText)}`}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--ermia-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--ermia-accent-contrast)] transition-colors hover:bg-[var(--ermia-accent-hover)]"
                      >
                        {contactContent.openMailLabel}
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-4 py-2.5 text-sm font-medium text-[var(--ermia-text)] transition-colors hover:border-[var(--ermia-accent)] hover:text-[var(--ermia-accent)] cursor-pointer"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="h-4 w-4 text-[var(--ermia-accent)]" />
                          <span>{contactContent.copiedDraftLabel}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>{contactContent.copyDraftLabel}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmittedDraft(null)}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--ermia-border)] px-4 py-2.5 text-sm font-medium text-[var(--ermia-text-secondary)] transition-colors hover:border-[var(--ermia-border-strong)] hover:text-[var(--ermia-text)] cursor-pointer"
                    >
                      {contactContent.resetLabel}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-[var(--ermia-text-secondary)]"
                      >
                        {contactContent.nameLabel}
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        aria-invalid={Boolean(validationError && !name.trim())}
                        aria-describedby={validationError ? 'contact-form-error' : undefined}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={contactContent.namePlaceholder}
                        className="mt-2 w-full rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-4 py-3 text-sm text-[var(--ermia-text)] placeholder-[var(--ermia-muted)]/75 transition-colors focus:border-[var(--ermia-accent)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-[var(--ermia-text-secondary)]"
                      >
                        {contactContent.senderEmailLabel}
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        dir="ltr"
                        value={email}
                        aria-invalid={Boolean(
                          validationError && (!email.trim() || !EMAIL_PATTERN.test(email.trim()))
                        )}
                        aria-describedby={validationError ? 'contact-form-error' : undefined}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={contactContent.senderEmailPlaceholder}
                        className="mt-2 w-full rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-4 py-3 text-sm text-[var(--ermia-text)] placeholder-[var(--ermia-muted)]/75 transition-colors focus:border-[var(--ermia-accent)] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[var(--ermia-text-secondary)]">
                      {contactContent.topicLabel}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contactContent.topicOptions.map((opt) => {
                        const active = topic === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setTopic(opt)}
                            className={`min-h-[38px] rounded-xl border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                              active
                                ? 'border-[var(--ermia-accent)] bg-[var(--ermia-accent)]/14 text-[var(--ermia-accent)]'
                                : 'border-[var(--ermia-border)] bg-[var(--ermia-bg)] text-[var(--ermia-text-secondary)] hover:border-[var(--ermia-border-strong)] hover:text-[var(--ermia-text)]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-[var(--ermia-text-secondary)]"
                    >
                      {contactContent.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={message}
                      aria-invalid={Boolean(validationError && !message.trim())}
                      aria-describedby={validationError ? 'contact-form-error' : undefined}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={contactContent.messagePlaceholder}
                      className="mt-2 w-full resize-y rounded-xl border border-[var(--ermia-border)] bg-[var(--ermia-bg)] px-4 py-3 text-sm text-[var(--ermia-text)] placeholder-[var(--ermia-muted)]/75 transition-colors focus:border-[var(--ermia-accent)] focus:outline-none"
                    />
                  </div>

                  {validationError && (
                    <p
                      id="contact-form-error"
                      role="alert"
                      className="text-xs font-medium text-red-600 dark:text-red-400"
                    >
                      {validationError}
                    </p>
                  )}

                  <MagneticButton
                    type="submit"
                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--ermia-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--ermia-accent-contrast)] whitespace-nowrap shrink-0 transition-colors hover:bg-[var(--ermia-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ermia-accent)] cursor-pointer"
                  >
                    <span>{contactContent.submitLabel}</span>
                    <Send
                      className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </MagneticButton>
                </form>
              )}
            </ScrollReveal>
          </div>

          {/* Restrained Animated ERMIA Brand Signature Footer */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.6, ease: MOTION_EASE.cinematic }}
            className="mt-20 grid grid-cols-1 gap-10 border-t border-[var(--ermia-border)] pt-12 md:grid-cols-12"
          >
            <div className="md:col-span-5">
              <ErmiaWordmark size="sm" animateEntrance />
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-[var(--ermia-text-secondary)]">
                {contactContent.footerTagline}
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="text-xs font-medium text-[var(--ermia-text)]">
                {contactContent.footerNavHeading}
              </p>
              <ul className="mt-3 space-y-2 text-xs text-[var(--ermia-text-secondary)]">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.id);
                      }}
                      className="transition-colors duration-150 hover:text-[var(--ermia-accent)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/projects/flow"
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenFlowCaseStudy();
                    }}
                    className="font-medium text-[var(--ermia-accent)] transition-opacity duration-150 hover:opacity-80"
                  >
                    {navContent.caseStudyCta}
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="text-xs font-medium text-[var(--ermia-text)]">
                {contactContent.footerConnectHeading}
              </p>
              <div className="mt-3 space-y-2 text-xs text-[var(--ermia-text-secondary)]">
                <a
                  href={SITE_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[var(--ermia-text)] transition-colors duration-150 hover:text-[var(--ermia-accent)]"
                >
                  <Github className="h-4 w-4 shrink-0 text-[var(--ermia-accent)]" />
                  <span className="font-sans">{contactContent.footerGithubLabel}:</span>
                  <span dir="ltr">{SITE_CONFIG.githubUsername}</span>
                  <ExternalArrow className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--ermia-border)] pt-6 text-xs text-[var(--ermia-muted)]">
            <p>{contactContent.copyright}</p>
            <span className="font-mono text-[11px] tracking-widest text-[var(--ermia-accent)]">
              ERMIA
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
