import {
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MOTION_EASE, PORTRAIT_IMAGE_PATH } from '../styles/designTokens';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  src: string;
}

interface LiquidImageTrailProps {
  children: ReactNode;
  images?: string[];
  className?: string;
  minDistance?: number;
  maxItems?: number;
}

export function LiquidImageTrail({
  children,
  images = [
    PORTRAIT_IMAGE_PATH,
    '/images/ermia-cutout.webp',
    '/favicon-192x192.png',
  ],
  className = '',
  minDistance = 54,
  maxItems = 5,
}: LiquidImageTrailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isFineDesktop, setIsFineDesktop] = useState(false);
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const filterId = useId().replace(/:/g, '');

  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const idCounterRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setIsFineDesktop(false);
      return;
    }
    const query = window.matchMedia('(pointer: fine) and (min-width: 768px)');
    const sync = () => setIsFineDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) {
        window.clearTimeout(t);
      }
      timersRef.current = [];
    };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        !isFineDesktop ||
        prefersReducedMotion ||
        images.length === 0 ||
        (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')
      ) {
        return;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const prev = lastPosRef.current;
      if (prev) {
        const dx = x - prev.x;
        const dy = y - prev.y;
        if (Math.hypot(dx, dy) < minDistance) return;
      }

      const dx = prev ? x - prev.x : 0;
      const rotation = Math.max(-12, Math.min(12, dx * 0.14));
      lastPosRef.current = { x, y };

      const id = ++idCounterRef.current;
      const src = images[id % images.length];

      setTrail((current) => [
        ...current.slice(-(maxItems - 1)),
        { id, x, y, rotation, src },
      ]);

      const timerId = window.setTimeout(() => {
        setTrail((current) => current.filter((item) => item.id !== id));
      }, 640);
      timersRef.current.push(timerId);
    },
    [isFineDesktop, prefersReducedMotion, images, minDistance, maxItems]
  );

  const handlePointerLeave = useCallback(() => {
    lastPosRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Lightweight localized SVG liquid displacement filter */}
      {isFineDesktop && !prefersReducedMotion && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        >
          <defs>
            <filter id={`liquid-trail-${filterId}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025"
                numOctaves="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="9"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Pointer-following liquid image trail (desktop fine-pointer only) */}
      {isFineDesktop && !prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        >
          <AnimatePresence>
            {trail.map((item) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  scale: 0.65,
                  x: item.x - 36,
                  y: item.y - 36,
                  rotate: item.rotation - 6,
                }}
                animate={{
                  opacity: 0.82,
                  scale: 1,
                  x: item.x - 36,
                  y: item.y - 42,
                  rotate: item.rotation,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.72,
                  y: item.y - 54,
                  transition: { duration: 0.34, ease: MOTION_EASE.cinematic },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 22,
                  mass: 0.55,
                }}
                style={{ filter: `url(#liquid-trail-${filterId})` }}
                className="absolute left-0 top-0 h-[72px] w-[72px] overflow-hidden rounded-xl border border-[var(--ermia-glass-edge)] bg-[var(--ermia-surface)]/80 shadow-[0_14px_28px_-10px_rgba(0,0,0,0.45)] backdrop-blur-sm will-change-transform"
              >
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-20">{children}</div>
    </div>
  );
}
