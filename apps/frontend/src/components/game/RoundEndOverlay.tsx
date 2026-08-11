import { motion } from "framer-motion";
import { useGameStore } from "../../store/gameStore";

export function RoundEndOverlay() {
  const roundResults = useGameStore((s) => s.roundResults);
  const localPlayer = useGameStore((s) => s.localPlayer);

  if (!roundResults) {
    return null;
  }

  const isLocalWinner = roundResults.roundWinnerId === localPlayer?.id;

  const standings = [...roundResults.standings].sort(
    (a, b) => b.score - a.score
  );

  return (
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
      className="absolute inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{
          y: 100,
        }}
        animate={{
          y: 0,
        }}
        className="bg-gray-900 border border-yellow-400 rounded-3xl p-6 shadow-2xl w-[90vw] max-w-[720px] flex flex-col"
      >
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl mb-4">🏆</div>

            <h2 className="text-3xl font-black text-yellow-400">
              {isLocalWinner
                ? "YOU WON THE ROUND!"
                : `${roundResults.roundWinnerName} WON THE ROUND!`}
            </h2>

            <div className="mt-6">
              <p className="text-gray-300">Points Earned</p>

              <p className="text-4xl font-bold text-green-400">
                +{roundResults.pointsAwarded}
              </p>

              <p className="text-gray-400">
                Total Score: {roundResults.totalScore}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-3">Current Standings</div>

            {standings.map((player, index) => (
              <div
                key={player.playerId}
                className="flex justify-between py-2 border-b border-gray-800"
              >
                <div className="flex gap-3">
                  <span className="w-5 text-gray-500">{index + 1}</span>

                  <span>{player.playerName}</span>
                </div>

                <span className="font-bold">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Next round starting...
        </p>
      </motion.div>
    </motion.div>
  );
}
