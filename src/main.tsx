import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import App, { FlowCaseStudyComponentProps } from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { parsePathname } from './utils/routing';
import type { ComponentType } from 'react';

async function bootstrap() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  const parsed = parsePathname(window.location.pathname);
  let FlowPageComponent:
    | ComponentType<FlowCaseStudyComponentProps>
    | undefined;

  // Preload FlowCaseStudyPage before hydrating /projects/flow so SSR DOM matches synchronously
  if (parsed.route === 'flow') {
    const mod = await import('./components/FlowCaseStudyPage');
    FlowPageComponent = mod.default;
  }

  const appTree = (
    <ErrorBoundary>
      <App
        initialRoute={parsed.route}
        initialLocale={
          parsed.localeFromPath ??
          (document.documentElement.lang === 'fa' ? 'fa' : 'en')
        }
        initialCanonicalPath={parsed.canonicalPath}
        FlowPageComponent={FlowPageComponent}
      />
    </ErrorBoundary>
  );

  if (rootEl.hasChildNodes()) {
    hydrateRoot(rootEl, appTree);
  } else {
    createRoot(rootEl).render(appTree);
  }
}

bootstrap();
