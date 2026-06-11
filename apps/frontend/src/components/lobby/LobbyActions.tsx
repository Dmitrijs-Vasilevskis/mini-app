import { colyseusService } from "../../services/colyseus";

interface Props {
  isReady: boolean;
  isHost: boolean;
  canStart: boolean;
}
export function LobbyActions({ isReady, isHost, canStart }: Props) {
  return (
    <div className="w-full flex gap-12 pt-4">
      {isHost && (
        <button
          onClick={() => colyseusService.startGame()}
          disabled={!canStart}
          className={`bg-yellow-500 w-full text-black px-5 py-3 rounded-lg font-bold ${!canStart && "grayscale"}`}
        >
          Start Game
        </button>
      )}

      <button
        onClick={() => colyseusService.toggleReady()}
        className="bg-green-600 px-5 py-3 rounded-lg font-semibold w-full"
      >
        {isReady ? "Not Ready" : "Ready"}
      </button>
    </div>
  );
}
