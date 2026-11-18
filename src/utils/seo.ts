import { buildAbsoluteUrl, SITE_CONFIG } from '../config/siteConfig';
import type { Locale } from '../data/ermiaData';
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
  jsonLdObjects: Record<string, unknown>[];
}

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
  const homeEnUrl = buildAbsoluteUrl('/en/', siteUrlOverride);
  const homeFaUrl = buildAbsoluteUrl('/fa/', siteUrlOverride);
  const flowUrl = buildAbsoluteUrl('/projects/flow', siteUrlOverride);
  const ogImage = buildAbsoluteUrl(SITE_CONFIG.portraitPath, siteUrlOverride);

  const canonicalUrl = buildAbsoluteUrl(canonicalPath, siteUrlOverride);

  const isFlow = route === 'flow';
  const isFa = locale === 'fa';

  const title = isFlow
    ? isFa
      ? 'FLOW — مطالعه موردی پروژه | ارمیا یزدانی (Ermia Yazdani)'
      : 'FLOW — Personal Daily-Life App Case Study | Ermia Yazdani'
    : isFa
      ? 'ارمیا یزدانی | پورتفولیوی شخصی — Ermia Yazdani'
      : 'Ermia Yazdani | Personal Portfolio';

  const description = isFlow
    ? isFa
      ? 'مطالعه موردی پروژه شخصی FLOW اثر ارمیا یزدانی؛ طراحی اپلیکیشن آرام زندگی روزمره، معماری سه‌لایه و مسیر یادگیری پایتون و HTML.'
      : 'Explore the FLOW case study by Ermia Yazdani—a calm personal daily-life app in active development, shaped by Python study and HTML basics.'
    : isFa
      ? 'به پورتفولیوی شخصی ارمیا یزدانی (ERMIA) خوش آمدید. پروژه‌هایی مانند FLOW، مسیر یادگیری پایتون و HTML پایه، و علایق موسیقی و گیتار.'
      : "Welcome to my personal portfolio. I'm Ermia Yazdani. Explore my projects like FLOW, creative interests in guitar & music, and Python/web learning journey.";

  const personId = `${homeRootUrl}#person`;
  const websiteId = `${homeRootUrl}#website`;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: SITE_CONFIG.fullName,
    alternateName: ['Ermia', 'ERMIA', SITE_CONFIG.fullNameFa],
    url: homeRootUrl,
    image: ogImage,
    sameAs: [SITE_CONFIG.githubUrl],
    description:
      'Personal portfolio author sharing FLOW, Python & HTML learning progress, guitar practice, and honest project notes.',
    knowsAbout: [
      'Python (Learning)',
      'HTML Basics',
      'Guitar',
      'Music',
      'FLOW Concept',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: SITE_CONFIG.fullName,
    alternateName: 'Ermia',
    url: homeRootUrl,
    inLanguage: ['en', 'fa'],
    publisher: { '@id': personId },
  };

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonicalUrl}#profilepage`,
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: locale,
    isPartOf: { '@id': websiteId },
    mainEntity: { '@id': personId },
  };

  const flowCaseStudySchema = isFlow
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${flowUrl}#casestudy`,
        name: 'FLOW — Personal Daily-Life Application Concept',
        headline: title,
        description,
        url: flowUrl,
        inLanguage: locale,
        author: { '@id': personId },
        isPartOf: { '@id': websiteId },
        creativeWorkStatus: 'In Development',
      }
    : null;

  const hreflangAlternates: SeoMetadata['hreflangAlternates'] = isFlow
    ? [
        { hreflang: 'en', href: flowUrl },
        { hreflang: 'x-default', href: flowUrl },
      ]
    : [
        { hreflang: 'en', href: homeEnUrl },
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
    jsonLdObjects: flowCaseStudySchema
      ? [websiteSchema, personSchema, profilePageSchema, flowCaseStudySchema]
      : [websiteSchema, personSchema, profilePageSchema],
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

  const jsonLdScripts = meta.jsonLdObjects.map(
    (schema) =>
      `<script type="application/ld+json" data-ermia-jsonld="true">${JSON.stringify(schema)}</script>`
  );

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
    ...jsonLdScripts,
  ].join('\n    ');
}
