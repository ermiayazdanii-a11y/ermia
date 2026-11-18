import {
  ReactNode,
  useCallback,
  useEffect,
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

  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const idCounterRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setIsFineDesktop(false);
      return;
    }
    const query = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 768px)'
    );
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
      const rotation = Math.max(-10, Math.min(10, dx * 0.12));
      lastPosRef.current = { x, y };

      const id = ++idCounterRef.current;
      const src = images[id % images.length];

      setTrail((current) => [
        ...current.slice(-(maxItems - 1)),
        { id, x, y, rotation, src },
      ]);

      const timerId = window.setTimeout(() => {
        setTrail((current) => current.filter((item) => item.id !== id));
      }, 620);
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
      {/* Compositor-only pointer image trail (hover-capable fine desktop pointers only) */}
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
                  scale: 0.72,
                  x: item.x - 34,
                  y: item.y - 34,
                  rotate: item.rotation - 5,
                }}
                animate={{
                  opacity: 0.78,
                  scale: 1,
                  x: item.x - 34,
                  y: item.y - 40,
                  rotate: item.rotation,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.76,
                  y: item.y - 52,
                  transition: { duration: 0.3, ease: MOTION_EASE.cinematic },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 24,
                  mass: 0.5,
                }}
                className="absolute left-0 top-0 h-[68px] w-[68px] overflow-hidden rounded-xl border border-[var(--ermia-glass-edge)] bg-[var(--ermia-surface)] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.42)] will-change-transform"
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
