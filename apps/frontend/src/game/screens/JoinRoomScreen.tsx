interface Props {
  roomCode: string;
  username: string;
  joining: boolean;
  isTelegramUser: boolean;
  setRoomCode: (value: string) => void;
  setUsername: (value: string) => void;
  onCreate: () => void;
  onJoin: () => void;
}

export function JoinRoomScreen({
  roomCode,
  username,
  joining,
  isTelegramUser,
  setRoomCode,
  setUsername,
  onCreate,
  onJoin,
}: Props) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-b from-[#ac61a3] to-[#2a57c0] text-white">
      <div className="w-full max-w-5xl rounded-3xl bg-black/20 backdrop-blur-md border border-white/10 p-6">
        <div className="flex flex-row gap-6">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-4">👤 Player</h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-white/70">Nickname</label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter nickname"
                maxLength={20}
                className="
                    h-12
                    rounded-xl
                    px-4
                    text-black
                    outline-none
                  "
              />
            </div>

            {isTelegramUser && (
              <div className="text-white/80">Connected through Telegram</div>
            )}
          </div>

          <div className="w-px bg-white/10" />

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">🃏 UNO Online</h1>

              <p className="text-sm text-white/60">
                Play with friends in real time
              </p>
            </div>

            <button
              disabled={joining}
              onClick={onCreate}
              className="
                h-14
                rounded-xl
                bg-green-600
                hover:bg-green-500
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              {joining ? "Loading..." : "➕ Create Room"}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/50">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex gap-2">
              <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Room code"
                className="
                  flex-1
                  h-12
                  rounded-xl
                  px-4
                  text-black
                  outline-none
                "
              />

              <button
                disabled={joining}
                onClick={onJoin}
                className="
                  px-5
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-500
                  font-semibold
                  transition
                  disabled:opacity-50
                "
              >
                Join
              </button>
            </div>

            <p className="text-xs text-white/40">
              Got an invite? Enter the room code and join instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
