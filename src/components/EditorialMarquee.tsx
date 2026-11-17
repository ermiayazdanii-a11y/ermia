import { useState } from 'react';
import { MEDIA_ASSETS } from '../data/ermiaData';
import { LiquidImageTrail } from './LiquidImageTrail';

interface EditorialMarqueeProps {
  items: string[];
}

export function EditorialMarquee({ items }: EditorialMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <LiquidImageTrail
      images={[
        MEDIA_ASSETS.portrait,
        MEDIA_ASSETS.portraitCutout,
        '/favicon-192x192.png',
      ]}
      minDistance={58}
      maxItems={5}
      className="border-y border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/75 select-none"
    >
      <div
        aria-hidden="true"
        onClick={() => setIsPaused((prev) => !prev)}
        className="relative overflow-hidden py-4 sm:py-5 cursor-pointer"
      >
        {/* Edge fades into theme canvas */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--ermia-bg)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--ermia-bg)] to-transparent sm:w-24" />

        <div
          dir="ltr"
          style={isPaused ? { animationPlayState: 'paused' } : undefined}
          className="flex w-max animate-marquee items-center gap-6 will-change-transform"
        >
          {repeatedItems.map((word, index) => (
            <div key={`${word}-${index}`} className="flex items-center gap-6 shrink-0">
              <span className="font-display text-xs font-medium tracking-[0.22em] text-[var(--ermia-text-secondary)] transition-colors duration-200 hover:text-[var(--ermia-accent)] sm:text-sm">
                {word}
              </span>
              <span className="text-xs text-[var(--ermia-accent)]">/</span>
            </div>
          ))}
        </div>
      </div>
    </LiquidImageTrail>
  );
}
