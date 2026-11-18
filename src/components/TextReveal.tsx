import { ElementType, ReactNode, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';
import type { Locale } from '../data/ermiaData';
import { useMotionProfile } from '../hooks/useMotionProfile';
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
  splitChars?: boolean;
  scrollKinetic?: boolean;
  locale?: Locale;
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
  const kineticY = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -8]);
  const kineticSkewX = useTransform(scrollYProgress, [0, 0.5, 1], [-1.3, 0, 0.9]);

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
  splitChars = false,
  scrollKinetic = false,
  locale = 'en',
}: TextRevealProps) {
  const { prefersReducedMotion, allowParallax, revealDurationMultiplier } =
    useMotionProfile();
  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  // Never split RTL Persian/Arabic cursive glyphs per-character; preserve ligatures via word mode
  const useCharSplit =
    splitChars &&
    locale === 'en' &&
    typeof children === 'string' &&
    children.trim().length <= 42;

  const duration = MOTION_TIMING.cinematic * revealDurationMultiplier;

  const renderWordsOrBlock = () => {
    if (useCharSplit && typeof children === 'string') {
      const words = children.trim().split(/\s+/);
      let globalCharIndex = 0;

      return (
        <Tag className={className}>
          {words.map((word, wordIdx) => {
            const chars = Array.from(word);
            return (
              <span
                key={`${word}-${wordIdx}`}
                className="inline-block whitespace-nowrap align-bottom"
              >
                {chars.map((char, charIdx) => {
                  const currentIdx = globalCharIndex++;
                  return (
                    <span
                      key={`${char}-${charIdx}`}
                      className="inline-block overflow-hidden align-bottom"
                    >
                      <motion.span
                        className="inline-block"
                        initial={{
                          y: '115%',
                          opacity: 0,
                        }}
                        {...(immediate
                          ? {
                              animate: {
                                y: '0%',
                                opacity: 1,
                              },
                            }
                          : {
                              whileInView: {
                                y: '0%',
                                opacity: 1,
                              },
                              viewport: REVEAL_VIEWPORT,
                            })}
                        transition={{
                          duration: 0.62 * revealDurationMultiplier,
                          delay: delay + currentIdx * 0.022,
                          ease: MOTION_EASE.cinematic,
                        }}
                      >
                        {char}
                      </motion.span>
                    </span>
                  );
                })}
                {wordIdx < words.length - 1 ? '\u00A0' : ''}
              </span>
            );
          })}
        </Tag>
      );
    }

    if ((splitWords || splitChars) && typeof children === 'string') {
      const words = children.trim().split(/\s+/);
      return (
        <Tag className={className}>
          {words.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="inline-block overflow-hidden align-bottom"
            >
              <motion.span
                className="inline-block"
                initial={{
                  y: '112%',
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
                  duration,
                  delay: delay + idx * (0.048 * revealDurationMultiplier),
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
            duration,
            delay,
            ease: MOTION_EASE.cinematic,
          }}
        >
          <Tag className={className}>{children}</Tag>
        </motion.div>
      </div>
    );
  };

  if (!scrollKinetic || !allowParallax) {
    return renderWordsOrBlock();
  }

  return <KineticScrollWrapper>{renderWordsOrBlock()}</KineticScrollWrapper>;
}
