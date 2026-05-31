import { useState } from "react";

type Props = {
  roomId: string;
  playerCount: number;
};

export function RoomInfoPanel({ roomId, playerCount }: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const copyRoomId = async () => {
    if (!roomId) return;

    await navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-black/60 backdrop-blur-md rounded-xl overflow-hidden w-[220px]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-4 py-2 flex items-center justify-between"
        >
          <span className="font-medium">Room</span>

          <span>{collapsed ? "▶" : "▼"}</span>
        </button>

        {!collapsed && (
          <div className="px-4 pb-3">
            <div className="text-sm">ID: {roomId}</div>

            <div className="text-sm">Players: {playerCount}</div>

            <button
              onClick={copyRoomId}
              className="mt-2 w-full rounded-md bg-gray-700 px-2 py-1 text-sm"
            >
              Copy Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
