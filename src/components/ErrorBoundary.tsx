import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Kept quiet in UI; avoids exposing stack internals to visitors
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--ermia-bg)] px-6 text-center text-[var(--ermia-text)]">
          <p className="font-display text-2xl font-semibold tracking-tight">
            ERMIA
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--ermia-text-secondary)]">
            Something interrupted rendering this view. Reload the page to
            restore the experience.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-[var(--ermia-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--ermia-accent-contrast)] transition-opacity hover:opacity-90 cursor-pointer"
          >
            Reload Page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
