import { useGameStore } from "./store/gameStore";
import { useTelegramContext } from "./providers/telegram/TelegramContext";
import { colyseusService } from "./services/colyseus";
import { useState } from "react";
import { GameEvents } from "./game/GameEvents";
import { LobbyScreen } from "./game/screens/LobbyScreen";
import { RoomStatus } from "@uno/shared";
import { JoinRoomScreen } from "./game/screens/JoinRoomScreen";
import { GameScreen } from "./game/screens/GameScreen";

function App() {
  const { user } = useTelegramContext();

  const status = useGameStore((s) => s.status);
  const [roomId, setRoomId] = useState<string>("");

  const handleCreateRoom = async () => {
    const room = await colyseusService.createRoom(user?.username);

    room.onStateChange.once(() => {
      GameEvents.initialize(room);
    });
  };

  const handleJoinRoom = async () => {
    const room = await colyseusService.joinRoomByCode(roomId, user?.username);

    room.onStateChange.once(() => {
      GameEvents.initialize(room);
    });
  };

  switch (status) {
    case RoomStatus.LOBBY:
      return <LobbyScreen />;
    case RoomStatus.PLAYING:
      return <GameScreen />;
    default:
      return (
        <JoinRoomScreen
          roomId={roomId}
          setRoomId={setRoomId}
          onCreate={handleCreateRoom}
          onJoin={handleJoinRoom}
        />
      );
  }
}

export default App;
