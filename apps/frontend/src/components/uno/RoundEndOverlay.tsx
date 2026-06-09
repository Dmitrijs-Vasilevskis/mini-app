import { motion } from "framer-motion";
import type { RoundResults } from "../../types/game";

type Props = {
    roundResults: RoundResults;
    isLocalWinner: boolean;
};

export function RoundEndOverlay({
    roundResults,
    isLocalWinner,
}: Props) {
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
            className="
                absolute
                inset-0
                z-[90]
                bg-black/70
                backdrop-blur-sm
                flex
                items-center
                justify-center
            "
        >
            <motion.div
                initial={{
                    y: 100,
                }}
                animate={{
                    y: 0,
                }}
                className="
                    bg-gray-900
                    border
                    border-yellow-400
                    rounded-3xl
                    p-8
                    text-center
                    shadow-2xl
                    min-w-[320px]
                "
            >
                <div className="text-5xl mb-4">
                    🏆
                </div>

                <h2 className="text-3xl font-black text-yellow-400">
                    {isLocalWinner
                        ? "YOU WON THE ROUND!"
                        : `${roundResults.roundWinnerName} WON THE ROUND!`}
                </h2>

                <div className="mt-6 space-y-2">
                    <p className="text-gray-300">
                        Points Earned
                    </p>

                    <p className="text-4xl font-bold text-green-400">
                        +{roundResults.pointsAwarded}
                    </p>

                    <p className="text-gray-400">
                        Total Score: {roundResults.totalScore}
                    </p>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    Next round starting...
                </p>
            </motion.div>
        </motion.div>
    );
}