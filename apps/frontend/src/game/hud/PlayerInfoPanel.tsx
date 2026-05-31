type Props = {
  cardsCount: number;
  isMyTurn: boolean;
};

export function PlayerInfoPanel({ cardsCount, isMyTurn }: Props) {
  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="bg-black/60 backdrop-blur-md rounded-xl p-3 min-w-[160px]">
        <div className="text-xs uppercase text-gray-400">You</div>

        <div className="mt-2 text-sm">Cards: {cardsCount}</div>

        {isMyTurn && (
          <div className="mt-2 font-bold text-green-400 animate-pulse">
            YOUR TURN
          </div>
        )}
      </div>
    </div>
  );
}
