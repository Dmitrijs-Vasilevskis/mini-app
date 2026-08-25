import { AnimatePresence, motion } from "framer-motion";
import { ClassicCard } from "../../../components/games/bj/card/BjCard";
import type { BjCardDTO } from "../../../store/slices/bjSlice";

interface Props {
  cards: BjCardDTO[];
  handValue: number;
}
export function HandCards({ cards, handValue }: Props) {
  if (!cards || cards.length === 0) return null;

  const overlap = 48;
  const centerIndex = (cards.length - 1) / 2;

  return (
    <div className="absolute bottom-[max(12rem,env(safe-area-inset-bottom))] landscape:bottom-[max(4rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="relative flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 0.9, scale: 1, y: 0 }}
          className="relative z-30 pointer-events-auto flex items-center justify-center"
        >
          <div
            className="w-8 h-8 rounded-full border bg-[#120a1f]/90
           backdrop-blur-md shadow-lg flex items-center justify-center
            font-black text-sm tracking-tight transition-all
             border-indigo-400/80 text-white shadow-indigo-500/20"
          >
            {handValue}
          </div>
        </motion.div>
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const x = (index - centerIndex) * overlap;

            return (
              <motion.div
                key={card.id || `${card.suit}-${card.rank}-${index}`}
                initial={{
                  opacity: 0,
                  y: -180,
                  scale: 0.6,
                }}
                animate={{
                  opacity: 1,
                  x,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 100,
                  scale: 0.5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 25,
                  mass: 0.6,
                }}
                className="absolute pointer-events-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
                style={{
                  zIndex: index,
                }}
              >
                <ClassicCard card={card} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
