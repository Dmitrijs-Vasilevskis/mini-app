import type { CardDTO, Color } from "../../types/game";

type Props = {
  currentTurnPlayer: string;
  activeColor: Color;
  discardTop: CardDTO;
};

export function MatchInfoPanel({
  currentTurnPlayer,
  activeColor,
  discardTop,
}: Props) {
  return (
    <div className="absolute top-4 left-4 z-20">
      <div className="bg-black/70 backdrop-blur-md rounded-xl p-4 min-w-[220px] text-center">
        <div className="text-xs uppercase text-gray-400">Match Status</div>

        <div className="mt-2">
          <div className="font-semibold">{currentTurnPlayer}'s Turn</div>
        </div>

        <div className="mt-3 flex justify-center gap-4 text-sm">
          <div>
            <div className="text-gray-400">Color</div>
            <div>{activeColor}</div>
          </div>

          <div>
            <div className="text-gray-400">Top Card</div>
            <div>
              {discardTop?.color} {discardTop?.value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
