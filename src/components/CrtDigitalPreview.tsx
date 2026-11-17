import { ReactNode, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface CrtDigitalPreviewProps {
  children: ReactNode;
  className?: string;
}

/**
 * Applies restrained CRT scanlines, fine grain, and a brief 360ms chromatic
 * aberration + micro-glitch pulse on hover/tap before smoothly settling back
 * to the pristine original visual state.
 */
export function CrtDigitalPreview({
  children,
  className = '',
}: CrtDigitalPreviewProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerPulse = () => {
    if (prefersReducedMotion) return;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    setIsGlitching(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsGlitching(false);
    }, 360);
  };

  return (
    <div
      onMouseEnter={triggerPulse}
      onClick={triggerPulse}
      className={`group/crt relative overflow-hidden ${className}`}
    >
      {/* Primary visual layer with temporary subtle chromatic split during pulse */}
      <div
        className={`relative transition-transform duration-300 ease-out will-change-transform ${
          isGlitching ? 'scale-[1.01]' : 'scale-100'
        }`}
      >
        {children}

        {/* Temporary Chromatic Aberration Channels (fade smoothly back to 0) */}
        {!prefersReducedMotion && (
          <>
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 mix-blend-screen transition-all duration-200 ${
                isGlitching
                  ? 'translate-x-[3px] -translate-y-[1px] opacity-30'
                  : 'translate-x-0 translate-y-0 opacity-0'
              }`}
              style={{
                boxShadow: 'inset 2px 0 0 rgba(255, 72, 118, 0.35)',
              }}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 mix-blend-screen transition-all duration-200 ${
                isGlitching
                  ? '-translate-x-[3px] translate-y-[1px] opacity-30'
                  : 'translate-x-0 translate-y-0 opacity-0'
              }`}
              style={{
                boxShadow: 'inset -2px 0 0 rgba(78, 224, 255, 0.35)',
              }}
            />
          </>
        )}
      </div>

      {/* Restrained CRT horizontal scanlines */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ${
          isGlitching ? 'opacity-25' : 'opacity-[0.06] group-hover/crt:opacity-[0.11]'
        }`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Micro-glitch scan bar sweeping cleanly during pulse only */}
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-1/3 z-20 h-3 bg-gradient-to-r from-transparent via-[var(--ermia-accent)]/25 to-transparent transition-all duration-300 ${
            isGlitching
              ? 'translate-y-4 opacity-90'
              : '-translate-y-6 opacity-0'
          }`}
        />
      )}

      {/* Ultra-lightweight digital noise texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
        }}
      />
    </div>
  );
}
