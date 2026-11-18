import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = path.resolve(import.meta.dirname, '..');
const distDir = path.join(rootDir, 'dist');
const ssrEntryPath = path.join(rootDir, 'dist-ssr', 'entry-server.js');
const templatePath = path.join(distDir, 'index.html');

function normalizeBaseUrl(rawUrl) {
  const fallback = 'https://ermia-personal-portfolio.ai.studio/';
  const trimmed = (rawUrl || fallback).trim() || fallback;
  try {
    const parsed = new URL(trimmed);
    return (
      parsed.origin +
      (parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`)
    );
  } catch {
    return fallback;
  }
}

const baseUrl = normalizeBaseUrl(process.env.VITE_SITE_URL);
const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

const ROUTES = [
  {
    route: 'home',
    locale: 'en',
    canonicalPath: '/',
    outFile: path.join(distDir, 'index.html'),
  },
  {
    route: 'home',
    locale: 'en',
    canonicalPath: '/en/',
    outFile: path.join(distDir, 'en', 'index.html'),
  },
  {
    route: 'home',
    locale: 'fa',
    canonicalPath: '/fa/',
    outFile: path.join(distDir, 'fa', 'index.html'),
  },
  {
    route: 'flow',
    locale: 'en',
    canonicalPath: '/projects/flow',
    outFile: path.join(distDir, 'projects', 'flow', 'index.html'),
  },
];

async function run() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing built template at ${templatePath}`);
  }
  if (!fs.existsSync(ssrEntryPath)) {
    throw new Error(`Missing SSR bundle at ${ssrEntryPath}`);
  }

  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const { renderRouteHtml } = await import(pathToFileURL(ssrEntryPath).href);

  const seoStartMarker = '<!--ermia-seo-head-start-->';
  const seoEndMarker = '<!--ermia-seo-head-end-->';
  const seoBlockRegex = new RegExp(
    `${seoStartMarker}[\\s\\S]*?${seoEndMarker}`,
    'm'
  );

  for (const target of ROUTES) {
    const rendered = renderRouteHtml({
      route: target.route,
      locale: target.locale,
      canonicalPath: target.canonicalPath,
      siteUrlOverride: baseUrl,
    });

    let html = templateHtml;

    html = html.replace(
      /<html[^>]*>/i,
      `<html lang="${rendered.lang}" dir="${rendered.dir}" data-route="${rendered.route}">`
    );

    if (!seoBlockRegex.test(html)) {
      throw new Error(
        'Expected <!--ermia-seo-head-start--> ... <!--ermia-seo-head-end--> markers in dist/index.html'
      );
    }

    html = html.replace(
      seoBlockRegex,
      `${seoStartMarker}\n    ${rendered.seoHeadTags}\n    ${seoEndMarker}`
    );

    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${rendered.appHtml}</div>`
    );

    fs.mkdirSync(path.dirname(target.outFile), { recursive: true });
    fs.writeFileSync(target.outFile, html, 'utf-8');
    console.log(`Prerendered ${target.canonicalPath} -> ${path.relative(rootDir, target.outFile)}`);

    // Also write non-directory .html fallback for static hosts on clean URLs without trailing slash
    if (target.canonicalPath !== '/') {
      const cleanName = target.canonicalPath.replace(/^\/|\/$/g, '');
      const siblingHtmlPath = path.join(distDir, `${cleanName}.html`);
      fs.mkdirSync(path.dirname(siblingHtmlPath), { recursive: true });
      fs.writeFileSync(siblingHtmlPath, html, 'utf-8');
    }
  }

  // Generate sitemap.xml matching unique canonical URLs only
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <url>
    <loc>${cleanBase}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${cleanBase}/" />
    <xhtml:link rel="alternate" hreflang="fa" href="${cleanBase}/fa/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/" />
  </url>
  <url>
    <loc>${cleanBase}/fa/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${cleanBase}/" />
    <xhtml:link rel="alternate" hreflang="fa" href="${cleanBase}/fa/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${cleanBase}/" />
  </url>
  <url>
    <loc>${cleanBase}/projects/flow</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${cleanBase}/sitemap.xml
`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(rootDir, 'public', 'robots.txt'), robotsTxt, 'utf-8');
  console.log('Generated sitemap.xml and robots.txt for', baseUrl);
}

run().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
