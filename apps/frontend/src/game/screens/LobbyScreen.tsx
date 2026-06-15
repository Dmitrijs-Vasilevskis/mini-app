import { LobbyActions } from "../../components/lobby/LobbyActions";
import { LobbyHeader } from "../../components/lobby/LobbyHeader";
import { useGameContext } from "../../providers/game/GameProvider";
import { useGameStore } from "../../store/gameStore";

export function LobbyScreen() {
  const roomCode = useGameStore((s) => s.roomCode);
  const hostId = useGameStore((s) => s.hostId);
  const players = useGameStore((s) => s.players);
  const localPlayer = useGameStore((s) => s.localPlayer);

  const { leaveRoom } = useGameContext();

  const isHost = localPlayer?.id === hostId;

  // todo: create global const
  const canStart = players.length >= 1 && players.every((p) => p.isReady);

  // todo: implemet copy link https://t.me/<bot_username>?startapp=${roomCode}
  const copyRoomCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-b from-[#ac61a3] to-[#2a57c0] text-white">
      <div className="w-full max-w-5xl min-h-80 rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 p-6 flex flex-col relative">
        <div className="flex sm:flex-row flex-col flex-grow gap-6">
          <div className="flex flex-col w-full sm:max-w-[50%] justify-center">
            <LobbyHeader
              roomCode={roomCode}
              onClick={copyRoomCode}
              onLeave={leaveRoom}
            />

            <LobbyActions
              isReady={localPlayer?.isReady ?? false}
              isHost={isHost}
              canStart={canStart}
              onLeave={leaveRoom}
            />
          </div>

          <div className="w-px bg-white/10" />

          <div className="flex-1 flex flex-col justify-center gap-4 w-full sm:max-w-[50%]">
            <div className="w-full max-w-md flex flex-col gap-3 overflow-y-auto no-scrollbar mb-4 max-h-[80%] h-full">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-black/20 rounded-xl p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <span>{player.name}</span>

                    {player.id === hostId && (
                      <span className=" text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                        HOST
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {player.isReady ? "Ready" : "Not Ready"}
                    </span>
                    <div
                      className={`w-3 h-3 rounded-full ${player.isConnected ? "bg-green-500" : "bg-red-500"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
