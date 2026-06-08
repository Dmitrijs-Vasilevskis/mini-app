type Props = {
  roomId: string;
  setRoomId: (value: string) => void;
  onCreate: () => void;
  onJoin: () => void;
};

export function JoinRoomScreen({ roomId, setRoomId, onCreate, onJoin }: Props) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#ac61a3] to-[#2a57c0] text-white">
      <h1 className="text-4xl font-bold">UNO Online</h1>

      <button onClick={onCreate} className="bg-green-600 px-6 py-3 rounded">
        Create Room
      </button>

      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter Room ID"
        className="px-4 py-2 rounded text-black"
      />

      <button onClick={onJoin} className="bg-blue-600 px-6 py-3 rounded">
        Join Room
      </button>
    </div>
  );
}
