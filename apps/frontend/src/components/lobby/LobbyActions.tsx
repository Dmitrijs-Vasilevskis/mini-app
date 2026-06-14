import { colyseusService } from "../../services/colyseus";

interface Props {
  isReady: boolean;
  isHost: boolean;
  canStart: boolean;
  onLeave: () => void;
}
export function LobbyActions({ isReady, isHost, canStart, onLeave }: Props) {
  return (
    <div className="w-full flex flex-col gap-6 pt-4">
      {isHost && (
        <div className="flex w-full">
          <button
            onClick={() => colyseusService.startGame()}
            disabled={!canStart}
            className={`bg-yellow-500 transition active:scale-95 w-full text-black px-5 py-3 rounded-lg font-bold ${!canStart && "grayscale"}`}
          >
            Start Game
          </button>
        </div>
      )}

      <div className="flex w-full">
        <button
          onClick={() => colyseusService.toggleReady()}
          className="bg-green-600 transition active:scale-95 px-5 py-3 rounded-lg font-semibold w-full"
        >
          {isReady ? "Not Ready" : "Ready"}
        </button>
      </div>

      <div className="flex w-full">
        <button
          onClick={onLeave}
          className="w-full px-5 py-3 rounded-lg bg-red-500/15 border-red-500/30 text-red-300 font-semebold transition hover:bg-red-500/25 active:scale-95"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
