import { ElementType, ReactNode, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import {
  MOTION_EASE,
  MOTION_TIMING,
  REVEAL_VIEWPORT,
} from '../styles/designTokens';

interface TextRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  immediate?: boolean;
  splitWords?: boolean;
  scrollKinetic?: boolean;
}

interface KineticScrollWrapperProps {
  children: ReactNode;
}

function KineticScrollWrapper({ children }: KineticScrollWrapperProps) {
  const kineticRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: kineticRef,
    offset: ['start 95%', 'end 20%'],
  });
  const kineticY = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -6]);
  const kineticSkewX = useTransform(scrollYProgress, [0, 0.5, 1], [-1.2, 0, 0.8]);

  return (
    <motion.div
      ref={kineticRef}
      style={{ y: kineticY, skewX: kineticSkewX }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({
  children,
  as = 'div',
  className = '',
  delay = 0,
  immediate = false,
  splitWords = false,
  scrollKinetic = false,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const renderWordsOrBlock = () => {
    if (splitWords && typeof children === 'string') {
      const words = children.trim().split(/\s+/);
      return (
        <Tag className={className}>
          {words.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="inline-block overflow-hidden align-bottom"
            >
              <motion.span
                className="inline-block will-change-transform"
                initial={{
                  y: '110%',
                  opacity: 0,
                  clipPath: 'inset(0% 0% 100% 0%)',
                }}
                {...(immediate
                  ? {
                      animate: {
                        y: '0%',
                        opacity: 1,
                        clipPath: 'inset(0% 0% 0% 0%)',
                      },
                    }
                  : {
                      whileInView: {
                        y: '0%',
                        opacity: 1,
                        clipPath: 'inset(0% 0% 0% 0%)',
                      },
                      viewport: REVEAL_VIEWPORT,
                    })}
                transition={{
                  duration: MOTION_TIMING.cinematic,
                  delay: delay + idx * 0.055,
                  ease: MOTION_EASE.cinematic,
                }}
              >
                {word}
                {idx < words.length - 1 ? '\u00A0' : ''}
              </motion.span>
            </span>
          ))}
        </Tag>
      );
    }

    return (
      <div className="overflow-hidden">
        <motion.div
          className="will-change-transform"
          initial={{
            y: '100%',
            opacity: 0,
            clipPath: 'inset(0% 0% 100% 0%)',
          }}
          {...(immediate
            ? {
                animate: {
                  y: '0%',
                  opacity: 1,
                  clipPath: 'inset(0% 0% 0% 0%)',
                },
              }
            : {
                whileInView: {
                  y: '0%',
                  opacity: 1,
                  clipPath: 'inset(0% 0% 0% 0%)',
                },
                viewport: REVEAL_VIEWPORT,
              })}
          transition={{
            duration: MOTION_TIMING.cinematic,
            delay,
            ease: MOTION_EASE.cinematic,
          }}
        >
          <Tag className={className}>{children}</Tag>
        </motion.div>
      </div>
    );
  };

  if (!scrollKinetic) {
    return renderWordsOrBlock();
  }

  return <KineticScrollWrapper>{renderWordsOrBlock()}</KineticScrollWrapper>;
}
