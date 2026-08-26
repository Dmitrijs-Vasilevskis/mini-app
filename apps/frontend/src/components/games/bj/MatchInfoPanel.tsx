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
  const clearScoreAnimation = useGameStore(
    (state) => state.clearScoreAnimation
  );

  return (
    <>
      <div
        className="
        absolute z-30 top-4 left-1/2 -translate-x-1/2 flex flex-row items-center gap-4
        landscape:top-2 landscape:left-4 landscape:translate-x-0
        landscape:flex-col landscape:items-start landscape:gap-1
        "
      >
        {players.map((player, index) => {
          const scoreAnimation = scoreAnimations[player.id];

          return (
            <div
              key={player.id}
              className="flex items-center text-xs landscape:rounded-lg landscape:px-1.5 landscape:py-1 landscape:backdrop-blur-sm landscape:bg-white/15"
            >
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

      <div
        className="
      absolute z-40 top-10 left-1/2 -translate-x-1/2 flex flex-col 
      items-center gap-2 text-center landscape:top-2 landscape:gap-1
      "
      >
        <div className="text-lg font-bold text-white">
          <div className="text-lg font-bold">
            {isMyTurn ? "YOUR TURN" : `${currentTurnPlayer}'s Turn`}
          </div>
        </div>

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
    </>
  );
}
