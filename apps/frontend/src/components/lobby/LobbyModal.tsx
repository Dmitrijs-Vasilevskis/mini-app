import type { GameType } from "@uno/shared";
import { useState } from "react";
import { GAME_REGISTRY } from "../../games/registry";

interface CatalogProps {
  isOpen: boolean;
  currentGameType: GameType;
  isHost: boolean;
  onClose: () => void;
  onSelectGame: (gameType: GameType) => void;
}

export function LobbyModal({
  isOpen,
  currentGameType,
  isHost,
  onClose,
  onSelectGame,
}: CatalogProps) {
  const [selected, setSelected] = useState<GameType>(currentGameType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-4 transition-opacity">
      <div className="w-full h-full max-w-md bg-[#1f122e] border border-white/10 rounded-t-3xl sm:rounded-3xl p-3 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Select Game</h2>
            <p className="text-xs text-gray-400">
              Choose a game for this lobby
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {Object.entries(GAME_REGISTRY).map(([type, game]) => {
            const isSelected = selected === type;
            const isSelectable = isHost && game.enabled;
            return (
              <div
                key={type}
                onClick={() => isSelectable && setSelected(type as GameType)}
                className={`relative p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                  !game.enabled
                    ? "opacity-50 bg-white/5 border-white/5 cursor-not-allowed"
                    : isSelectable
                      ? "cursor-pointer active:scale-[0.98]"
                      : "cursor-default"
                } ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                      {game.icon ?? "🎮"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">
                          {game.name}
                        </span>
                        {!game.enabled && (
                          <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold uppercase">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {game.shortDesc}
                      </p>
                    </div>
                  </div>

                  {game.enabled && (
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                        isSelected
                          ? "border-indigo-400 bg-indigo-500"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] bg-white/5 text-gray-300 border border-white/10 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                    👥 {game.minPlayers}-{game.maxPlayers} Players
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium border ${
                      game.enabled
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    }`}
                  >
                    {game.enabled ? "● Available" : "○ Disabled"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {isHost && (
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => onSelectGame(selected)}
              disabled={selected === currentGameType}
              className="w-full py-3.5 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-lg"
            >
              Confirm Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
