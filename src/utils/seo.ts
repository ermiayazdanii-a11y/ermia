import { buildAbsoluteUrl, SITE_CONFIG } from '../config/siteConfig';
import {
  FLOW_RELEASE_CONFIG,
  resolveFlowDistributionAction,
} from '../config/flowReleaseConfig';
import type { Locale } from '../data/ermiaData';
import { FLOW_MEDIA_ASSETS } from '../data/flowProductData';
import type { AppRoute } from './routing';

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogLocale: 'en_US' | 'fa_IR';
  ogLocaleAlternate: 'en_US' | 'fa_IR';
  ogImage: string;
  ogType: 'website' | 'article';
  hreflangAlternates: {
    hreflang: 'en' | 'fa' | 'x-default';
    href: string;
  }[];
  jsonLdGraph: Record<string, unknown>;
}

export const HOME_TITLE_EN = 'Ermia Yazdani | Personal Portfolio';
export const HOME_DESC_EN =
  'Official personal portfolio of Ermia Yazdani, featuring web development, technology experiments, personal projects, and FLOW.';

export const HOME_TITLE_FA = 'ارمیا یزدانی | پورتفولیوی شخصی — Ermia Yazdani';
export const HOME_DESC_FA =
  'پورتفولیوی رسمی و شخصی ارمیا یزدانی (Ermia Yazdani)؛ شامل پروژه‌های شخصی، تجربه‌های فناوری، یادگیری توسعه وب و پروژه FLOW.';

export function getSeoMetadata({
  route,
  locale,
  canonicalPath,
  siteUrlOverride,
}: {
  route: AppRoute;
  locale: Locale;
  canonicalPath: '/' | '/en/' | '/fa/' | '/projects/flow';
  siteUrlOverride?: string;
}): SeoMetadata {
  const homeRootUrl = buildAbsoluteUrl('/', siteUrlOverride);
  const homeFaUrl = buildAbsoluteUrl('/fa/', siteUrlOverride);
  const flowUrl = buildAbsoluteUrl('/projects/flow', siteUrlOverride);
  const portfolioOgImage = buildAbsoluteUrl(
    SITE_CONFIG.portraitPath,
    siteUrlOverride
  );
  const flowOgImage = buildAbsoluteUrl(
    FLOW_MEDIA_ASSETS.icon.src,
    siteUrlOverride
  );

  const normalizedCanonicalPath =
    canonicalPath === '/en/' ? '/' : canonicalPath;
  const canonicalUrl = buildAbsoluteUrl(
    normalizedCanonicalPath,
    siteUrlOverride
  );

  const isFlow = route === 'flow';
  const isFa = locale === 'fa';
  const ogImage = isFlow ? flowOgImage : portfolioOgImage;

  const title = isFlow
    ? isFa
      ? 'FLOW — اپلیکیشن اندروید «روز تو. فضای تو.» | ارمیا یزدانی'
      : 'FLOW — "Your day. Your space." | Android App by Ermia Yazdani'
    : isFa
      ? HOME_TITLE_FA
      : HOME_TITLE_EN;

  const description = isFlow
    ? isFa
      ? 'آشنایی با اپلیکیشن اندروید FLOW اثر ارمیا یزدانی؛ تصاویر واقعی رابط کاربری، تایمر Focus Nebula، استودیوی تم و وضعیت انتشار.'
      : 'Explore FLOW for Android by Ermia Yazdani—"Your day. Your space." View real app screenshots, Today dashboard, Focus Nebula, Living Space Studio, and honest release status.'
    : isFa
      ? HOME_DESC_FA
      : HOME_DESC_EN;

  const personId = `${homeRootUrl}#person`;
  const websiteId = `${homeRootUrl}#website`;

  const personEntity = {
    '@type': 'Person',
    '@id': personId,
    name: SITE_CONFIG.fullName,
    alternateName: 'ERMIA',
    url: homeRootUrl,
    image: portfolioOgImage,
    sameAs: [SITE_CONFIG.githubUrl],
    description: HOME_DESC_EN,
    knowsAbout: [
      'Web Development',
      'HTML Basics',
      'Python (Learning)',
      'Technology Experiments',
      'FLOW Android App',
      'Guitar',
      'Music',
    ],
  };

  const websiteEntity = {
    '@type': 'WebSite',
    '@id': websiteId,
    name: SITE_CONFIG.fullName,
    alternateName: 'ERMIA',
    url: homeRootUrl,
    inLanguage: ['en', 'fa'],
    publisher: { '@id': personId },
  };

  const flowDistribution = resolveFlowDistributionAction(FLOW_RELEASE_CONFIG);

  const pageEntity = isFlow
    ? flowDistribution.hasConfirmedDistribution && flowDistribution.href
      ? {
          '@type': 'SoftwareApplication',
          '@id': `${flowUrl}#software`,
          name: 'FLOW',
          headline: title,
          description,
          url: flowUrl,
          downloadUrl: flowDistribution.href,
          applicationCategory: 'ProductivityApplication',
          operatingSystem: 'Android',
          softwareVersion: FLOW_RELEASE_CONFIG.APP_VERSION,
          image: flowOgImage,
          screenshot: [
            buildAbsoluteUrl(
              FLOW_MEDIA_ASSETS.screens.dashboard.src,
              siteUrlOverride
            ),
            buildAbsoluteUrl(
              FLOW_MEDIA_ASSETS.screens.themes.src,
              siteUrlOverride
            ),
            buildAbsoluteUrl(
              FLOW_MEDIA_ASSETS.screens.companion.src,
              siteUrlOverride
            ),
            buildAbsoluteUrl(
              FLOW_MEDIA_ASSETS.screens.focus.src,
              siteUrlOverride
            ),
          ],
          inLanguage: locale,
          author: { '@id': personId },
          isPartOf: { '@id': websiteId },
        }
      : {
          '@type': 'CreativeWork',
          '@id': `${flowUrl}#casestudy`,
          name: 'FLOW — Android Daily-Life Application Showcase',
          headline: title,
          description,
          url: flowUrl,
          image: flowOgImage,
          inLanguage: locale,
          author: { '@id': personId },
          isPartOf: { '@id': websiteId },
          creativeWorkStatus: 'In Development',
        }
    : {
        '@type': 'ProfilePage',
        '@id': `${canonicalUrl}#profilepage`,
        name: title,
        description,
        url: canonicalUrl,
        inLanguage: locale,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      };

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [websiteEntity, personEntity, pageEntity],
  };

  const hreflangAlternates: SeoMetadata['hreflangAlternates'] = isFlow
    ? [
        { hreflang: 'en', href: flowUrl },
        { hreflang: 'x-default', href: flowUrl },
      ]
    : [
        { hreflang: 'en', href: homeRootUrl },
        { hreflang: 'fa', href: homeFaUrl },
        { hreflang: 'x-default', href: homeRootUrl },
      ];

  return {
    title,
    description,
    canonicalUrl,
    ogLocale: isFa ? 'fa_IR' : 'en_US',
    ogLocaleAlternate: isFa ? 'en_US' : 'fa_IR',
    ogImage,
    ogType: isFlow ? 'article' : 'website',
    hreflangAlternates,
    jsonLdGraph,
  };
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderSeoHeadTags(meta: SeoMetadata): string {
  const verificationMeta = SITE_CONFIG.gscVerificationTokens.map(
    (token) =>
      `<meta name="google-site-verification" content="${escapeHtmlAttr(token)}" />`
  );

  const hreflangTags = meta.hreflangAlternates.map(
    (alt) =>
      `<link rel="alternate" hreflang="${escapeHtmlAttr(alt.hreflang)}" href="${escapeHtmlAttr(alt.href)}" />`
  );

  const jsonLdScript = `<script type="application/ld+json" data-ermia-jsonld="true">${JSON.stringify(meta.jsonLdGraph)}</script>`;

  return [
    ...verificationMeta,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${escapeHtmlAttr(meta.canonicalUrl)}" />`,
    ...hreflangTags,
    `<title>${escapeHtmlAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`,
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:site_name" content="${escapeHtmlAttr(SITE_CONFIG.fullName)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(meta.canonicalUrl)}" />`,
    `<meta property="og:title" content="${escapeHtmlAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}" />`,
    `<meta property="og:image" content="${escapeHtmlAttr(meta.ogImage)}" />`,
    `<meta property="og:locale" content="${meta.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${meta.ogLocaleAlternate}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtmlAttr(meta.ogImage)}" />`,
    jsonLdScript,
  ].join('\n    ');
}
