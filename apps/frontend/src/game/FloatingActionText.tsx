import { AnimatePresence, motion } from "framer-motion";
import { useEffectStore } from "../store/effectsStore";

export function FloatingActionText() {
  const effects = useEffectStore((e) => e.effects);

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {effects.map((effect) => (
          <motion.div
            style={{ color: effect.color }}
            key={effect.id}
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              y: -40,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -120,
              scale: 1.4,
            }}
            transition={{
              duration: 1.2,
            }}
            className={`
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl
            font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]
            ${effect.emphasis === "special" ? "text-6xl font-black" : "text-4xl font-bold"}
            `}
          >
            {effect.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
