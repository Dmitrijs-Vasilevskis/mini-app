import { useState } from "react";
import type { LocalPlayerDTO, PlayerDTO } from "../../types/game";
import { getProxiedAvatarUrl } from "../../utils/avatar";

interface Props {
  players: PlayerDTO[];
  localPlayer: LocalPlayerDTO | null;
  hostId: string;
}

export function LobbyPlayers({ players, localPlayer, hostId }: Props) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  return (
    <div className="flex-1 flex flex-col min-h-0 my-4 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-white/50">
          Players Joined
        </span>
        <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-white/80">
          🎮 {players.length}
        </span>
      </div>

      <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-3 overflow-y-auto space-y-2.5 shadow-inner no-scrollbar">
        {players.map((player) => {
          const initial = player.name
            ? player.name.charAt(0).toUpperCase()
            : "P";
          const isPlayerHost = player.id === hostId;
          const proxiedAvatarUrl = getProxiedAvatarUrl(player.photoUrl);
          const hasImageError = imageErrors[player.id];

          return (
            <div
              key={player.id}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                player.id === localPlayer?.id
                  ? "bg-white/10 border-white/20 shadow-md"
                  : "bg-black/20 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white/90 border border-white/10 flex-shrink-0">
                  {proxiedAvatarUrl && !hasImageError ? (
                    <img
                      src={proxiedAvatarUrl}
                      alt={player.name}
                      className="w-full h-full object-cover"
                      onError={() =>
                        setImageErrors((prev) => ({
                          ...prev,
                          [player.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white/90 truncate max-w-[120px]">
                      {player.name}
                    </span>
                    {player.id === localPlayer?.id && (
                      <span className="text-[9px] font-bold text-blue-400 tracking-wide uppercase">
                        (You)
                      </span>
                    )}
                  </div>
                  {isPlayerHost && (
                    <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded w-max mt-0.5 tracking-wider">
                      👑 HOST
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {!player.isConnected ? (
                  <span className="text-xs font-bold text-red-400 animate-pulse bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                    Disconnected
                  </span>
                ) : (
                  <span
                    className={`text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg border ${
                      player.isReady
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-500/20 text-zinc-400 border-zinc-500/20"
                    }`}
                  >
                    {player.isReady ? "READY" : "WAITING"}
                  </span>
                )}

                <div
                  className={`w-1.5 h-1.5 rounded-full ${player.isConnected ? "bg-green-400 shadow shadow-green-400" : "bg-red-500 animate-ping"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
