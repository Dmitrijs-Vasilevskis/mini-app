interface Props {
  roomCode: string | null;
  onClick: () => void;
  onLeave: () => void;
}

export function LobbyHeader({ roomCode, onClick }: Props) {
  return (
    <div className="w-full max-w-md flex flex-row mb-4 justify-center gap-4">
      <div className="text-center">
        <div className="text-sm opacity-70">Room Code</div>
        <div className=" text-4xl font-black tracking-widest">
          {roomCode ?? ""}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onClick}
          className="transition active:scale-95 bg-blue-600 rounded-lg flex items-center"
        >
          <span className="px-5 py-3 text-sm font-semibold">Copy Code</span>
        </button>
      </div>
    </div>
  );
}
