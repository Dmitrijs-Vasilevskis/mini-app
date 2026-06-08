import { colyseusService } from "../../services/colyseus";

interface Props {
  isReady: boolean;
  isHost: boolean;
  canStart: boolean;
}
export function LobbyActions({ isReady, isHost, canStart }: Props) {
  return (
    <div className="mt-auto w-full max-w-md">
      <button
        onClick={() => colyseusService.toggleReady()}
        className=" w-full bg-green-600 py-3 rounded-xl font-semibold"
      >
        {isReady ? "Unready" : "Ready"}
      </button>

      {isHost && (
        <button
          onClick={() => colyseusService.startGame()}
          disabled={!canStart}
          className={`w-full mt-3 bg-yellow-500 text-black py-3 rounded-xl font-bold ${!canStart && "grayscale"}`}
        >
          Start Game
        </button>
      )}
    </div>
  );
}
