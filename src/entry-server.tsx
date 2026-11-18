import { renderToString } from 'react-dom/server';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FlowCaseStudyPage } from './components/FlowCaseStudyPage';
import type { Locale } from './data/ermiaData';
import type { AppRoute } from './utils/routing';
import { getSeoMetadata, renderSeoHeadTags } from './utils/seo';

export interface PrerenderRouteInput {
  route: AppRoute;
  locale: Locale;
  canonicalPath: '/' | '/en/' | '/fa/' | '/projects/flow';
  siteUrlOverride?: string;
}

export function renderRouteHtml({
  route,
  locale,
  canonicalPath,
  siteUrlOverride,
}: PrerenderRouteInput) {
  const appHtml = renderToString(
    <ErrorBoundary>
      <App
        initialRoute={route}
        initialLocale={locale}
        initialCanonicalPath={canonicalPath}
        FlowPageComponent={FlowCaseStudyPage}
      />
    </ErrorBoundary>
  );

  const seoMeta = getSeoMetadata({
    route,
    locale,
    canonicalPath,
    siteUrlOverride,
  });

  const seoHeadTags = renderSeoHeadTags(seoMeta);

  return {
    appHtml,
    seoHeadTags,
    lang: locale,
    dir: locale === 'fa' ? 'rtl' : 'ltr',
    route,
  };
}
