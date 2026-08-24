import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

interface Props {
  score: number;
  targetScore: number;
  points?: number;
  animationId?: number;
  onAnimationComplete?: () => void;
}

export function AnimatedScore({
  score,
  targetScore,
  points,
  animationId,
  onAnimationComplete,
}: Props) {
  const animate = animationId !== undefined;

  const springScore = useSpring(score, {
    stiffness: 80,
    damping: 18,
    mass: 0.8,
  });

  const roundedScore = useTransform(springScore, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    if (animate) {
      springScore.set(score);
    } else {
      springScore.jump(score);
    }
  }, [score, animate, springScore]);

  return (
    <span className="relative inline-flex items-center">
      <AnimatePresence>
        {animate && points && points > 0 && (
          <motion.span
            key={animationId}
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              y: -18,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.9,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            onAnimationComplete={onAnimationComplete}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-bold text-yellow-300"
          >
            +{points}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span
        animate={
          animate
            ? {
                scale: [1, 1.25, 1],
              }
            : undefined
        }
        transition={{
          duration: 0.45,
          times: [0, 0.4, 1],
        }}
      >
        <motion.span>{roundedScore}</motion.span>/{targetScore}
      </motion.span>
    </span>
  );
}
