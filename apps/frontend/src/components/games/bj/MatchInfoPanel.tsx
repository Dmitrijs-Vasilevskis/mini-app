import { useGameStore } from "../../../store/gameStore";
import type {
  BjLocalPlayerDTO,
  BjPlayerDTO,
} from "../../../store/slices/bjSlice";
import { AnimatedScore } from "../../hud/AnimatedScore";

interface Props {
  isMyTurn: boolean;
  currentTurnPlayer: string;
  localPlayerHandValue: number;
  dealderHandValue: number;
  players: BjPlayerDTO[];
  localPlayer: BjLocalPlayerDTO;
}

export function MatchInfoPanel({
  isMyTurn,
  currentTurnPlayer,
  localPlayerHandValue,
  dealderHandValue,
  players,
  localPlayer,
}: Props) {
  const scoreAnimations = useGameStore((state) => state.scoreAnimations);
  const clearScoreAnimation = useGameStore((state) => state.clearScoreAnimation);
 
  return (
    <div className="flex flex-col items-center gap-2 text-center absolute top-6 left-1/2 -translate-x-1/2 z-40">
      {/* player points  */}
      <div className="flex items-center gap-4 text-sm">
        {players.map((player, index) => {
          const scoreAnimation = scoreAnimations[player.id];

          return (
            <div key={player.id} className="flex items-center gap-3">
              <div
                className={
                  player.id === localPlayer.id
                    ? "font-bold"
                    : "font-medium text-white/80"
                }
              >
                {player.name}{" "}
                <span className="text-white/60">
                  <AnimatedScore
                    score={player.score}
                    targetScore={15}
                    points={scoreAnimation?.points}
                    animationId={scoreAnimation?.id}
                    onAnimationComplete={
                      scoreAnimation
                        ? () =>
                          clearScoreAnimation(player.id, scoreAnimation.id)
                        : undefined
                    }
                  />
                </span>
              </div>

              {index < players.length - 1 && (
                <div className="h-4 w-px bg-gray-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* current turn */}
      <div className="text-lg font-bold text-white">
        <div className="text-lg font-bold">
          {isMyTurn ? "YOUR TURN" : `${currentTurnPlayer}'s Turn`}
        </div>
      </div>

      {/* you | dealer */}
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span>You: {localPlayerHandValue}</span>
        </div>
        <div className="h-4 w-px bg-gray-600" />
        <div>
          <span>Dealer: {dealderHandValue}</span>
        </div>
      </div>
    </div>
  );
}
