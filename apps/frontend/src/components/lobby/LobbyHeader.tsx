interface Props {
    roomCode: string;
    onClick: () => void;
}

export function LobbyHeader({ roomCode, onClick }: Props) {
  return (
    <div className=" w-full max-w-md flex justify-around mb-4">
      <div className="text-center">
        <div className="text-sm opacity-70">Room Code</div>
        <div className=" text-4xl font-black tracking-widest">{roomCode}</div>
      </div>

      <button
        onClick={onClick}
        className=" bg-blue-600 px-5 py-3 rounded-lg font-semibold"
      >
        Copy Room Code
      </button>
    </div>
  );
}
