export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Upper subtle accent atmospheric canopy */}
      <div
        className="animate-ambient-a absolute -top-56 left-1/2 h-[680px] w-[1040px] -translate-x-1/2 rounded-full opacity-80 will-change-transform"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--ermia-spotlight-rgb), 0.085) 0%, rgba(var(--ermia-spotlight-rgb), 0.025) 44%, transparent 72%)',
        }}
      />

      {/* Lower left subtle secondary drift */}
      <div
        className="animate-ambient-b absolute -bottom-48 -left-36 h-[560px] w-[760px] rounded-full opacity-70 will-change-transform"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(var(--ermia-spotlight-rgb), 0.055) 0%, rgba(var(--ermia-spotlight-rgb), 0.015) 45%, transparent 74%)',
        }}
      />

      {/* Mid-page right soft atmospheric balance */}
      <div
        className="animate-ambient-a absolute top-[45%] -right-44 h-[520px] w-[520px] rounded-full opacity-60 will-change-transform"
        style={{
          background:
            'radial-gradient(circle at center, rgba(var(--ermia-spotlight-rgb), 0.045) 0%, transparent 72%)',
        }}
      />

      {/* Ultra-fine tactile grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.024] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />
    </div>
  );
}
