import type { AvatarId, GameType } from "@uno/shared";
import { useState } from "react";
import { GAME_REGISTRY } from "../../games/registry";
import { AVATARS } from "../../game/avatar/avatar.config";


interface CatalogProps {
  isOpen: boolean;
  currentGameType: GameType;
  isHost: boolean;
  onClose: () => void;
  onSelectGame: (gameType: GameType) => void;
  onSelectAvatar: (avatarId: AvatarId) => void;
  selectedAvatar: AvatarId;
}

export function LobbyModal({
  isOpen,
  currentGameType,
  isHost,
  onClose,
  onSelectGame,
  onSelectAvatar,
  selectedAvatar,
}: CatalogProps) {
  const [selected, setSelected] = useState<GameType>(currentGameType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-opacity">
      <div className="w-full h-full max-w-md bg-[#1f122e] border border-white/10 rounded-t-3xl sm:rounded-3xl p-3 shadow-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">
              Customize
            </h2>

            <p className="text-xs text-gray-400">
              Choose your avatar or game
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">

          {/* ================= AVATARS ================= */}
          <section>
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white">
                Avatar
              </h3>

              <p className="text-xs text-gray-400">
                Choose how you appear in the game
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(AVATARS).map(([id, avatar]) => {
                const avatarId = id as AvatarId;
                const isSelected = selectedAvatar === avatarId;

                return (
                  <button
                    key={avatarId}
                    type="button"
                    onClick={() => onSelectAvatar(avatarId)}
                    className={`
                      relative
                      p-3
                      rounded-2xl
                      border
                      text-left
                      transition-all
                      active:scale-[0.97]

                      ${
                        isSelected
                          ? "bg-emerald-500/10 border-emerald-400 shadow-lg shadow-emerald-500/10"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }
                    `}
                  >
                    {/* Avatar preview */}
                    <div className="h-28 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center mb-3 overflow-hidden">
                      <span className="text-4xl">
                        {avatarId === "astronaut" ? "🧑‍🚀" : "💪"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white capitalize">
                        {avatar.id.replace("_", " ")}
                      </span>

                      {/* Selected checkmark */}
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="w-4 h-4 text-white"
                          >
                            <path
                              d="M5 10.5L8.5 14L15 7"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ================= GAME ================= */}
          <section>
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white">
                Game
              </h3>

              <p className="text-xs text-gray-400">
                {isHost
                  ? "Choose the game for this lobby"
                  : "Only the host can change the game"}
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(GAME_REGISTRY).map(([type, game]) => {
                const isSelected = selected === type;
                const isSelectable = isHost && game.enabled;

                return (
                  <div
                    key={type}
                    onClick={() =>
                      isSelectable &&
                      setSelected(type as GameType)
                    }
                    className={`
                      relative
                      p-4
                      rounded-2xl
                      border
                      transition-all
                      flex
                      flex-col
                      gap-3

                      ${
                        !game.enabled
                          ? "opacity-50 bg-white/5 border-white/5 cursor-not-allowed"
                          : isSelectable
                            ? "cursor-pointer active:scale-[0.98]"
                            : "cursor-default"
                      }

                      ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }
                    `}
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
                          className={`
                            w-6 h-6
                            rounded-full
                            border-2
                            flex
                            items-center
                            justify-center
                            transition
                            shrink-0

                            ${
                              isSelected
                                ? "border-indigo-400 bg-indigo-500"
                                : "border-white/20 bg-transparent"
                            }
                          `}
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
                        className={`
                          text-[11px]
                          px-2.5
                          py-1
                          rounded-lg
                          font-medium
                          border

                          ${
                            game.enabled
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }
                        `}
                      >
                        {game.enabled
                          ? "● Available"
                          : "○ Disabled"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Game confirmation */}
        {isHost && (
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => onSelectGame(selected)}
              disabled={selected === currentGameType}
              className="w-full py-3.5 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-lg"
            >
              Confirm Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}