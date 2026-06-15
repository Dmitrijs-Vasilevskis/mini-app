import type { CardDTO, Color } from "../../types/game";
import { getCardLabel } from "../Helpers";

type Props = {
  currentTurnPlayer: string;
  activeColor: Color;
  discardTop: CardDTO | null;
  isMyTurn: boolean;
};

export function MatchInfoPanel({
  currentTurnPlayer,
  activeColor,
  discardTop,
  isMyTurn,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2 text-center absolute top-6 left-1/2 -translate-x-1/2 z-40">
      <div className="text-lg font-bold text-white">
        <div className="text-lg font-bold">
          {isMyTurn ? "YOUR TURN" : `${currentTurnPlayer}'s Turn`}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              activeColor === "red"
                ? "bg-red-500"
                : activeColor === "green"
                  ? "bg-green-500"
                  : activeColor === "blue"
                    ? "bg-blue-500"
                    : "bg-yellow-400"
            }`}
          />

          <span className="font-medium capitalize">{activeColor}</span>
        </div>

        {discardTop && (
          <>
            <div className="h-4 w-px bg-gray-600" />

            <div className="font-semibold">
              {getCardLabel(discardTop.value)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
