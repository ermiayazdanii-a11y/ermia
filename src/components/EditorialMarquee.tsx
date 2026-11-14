interface EditorialMarqueeProps {
  items: string[];
}

export function EditorialMarquee({ items }: EditorialMarqueeProps) {
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[var(--ermia-border)] bg-[var(--ermia-bg-secondary)]/75 py-3.5 select-none"
    >
      {/* Edge fades into theme canvas */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--ermia-bg)] to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--ermia-bg)] to-transparent sm:w-24" />

      <div
        dir="ltr"
        className="flex w-max animate-marquee items-center gap-6 will-change-transform"
      >
        {repeatedItems.map((word, index) => (
          <div key={`${word}-${index}`} className="flex items-center gap-6 shrink-0">
            <span className="font-display text-xs font-medium tracking-[0.22em] text-[var(--ermia-text-secondary)] sm:text-sm">
              {word}
            </span>
            <span className="text-xs text-[var(--ermia-accent)]">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}
