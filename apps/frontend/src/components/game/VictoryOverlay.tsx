import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../../store/gameStore";

export function VictoryOverlay() {
  const winner = useGameStore((s) => s.winner);
  const localPlayer = useGameStore((s) => s.localPlayer);

  if (!winner || !localPlayer) return;

  const isLocalWinner = winner.id === localPlayer.id;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center"
      >
        <motion.div
          initial={{
            y: 100,
          }}
          animate={{
            y: 0,
          }}
          className="bg-gray-900 border border-yellow-400 rounded-3xl p-10 text-center shadow-2xl"
        >
          <div className="text-7xl mb-4">🏆</div>

          <h1 className="text-5xl font-black text-yellow-400">
            {isLocalWinner ? "YOU WIN!" : `${winner.name} WINS!`}
          </h1>

          <p className="mt-4 text-gray-300">Game Over</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
