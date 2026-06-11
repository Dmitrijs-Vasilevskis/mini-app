import { useGameStore } from "./store/gameStore";
import { colyseusService } from "./services/colyseus";
import { useState } from "react";
import { GameEvents } from "./game/GameEvents";
import { LobbyScreen } from "./game/screens/LobbyScreen";
import { RoomStatus } from "@uno/shared";
import { JoinRoomScreen } from "./game/screens/JoinRoomScreen";
import { GameScreen } from "./game/screens/GameScreen";
import { useTelegramContext } from "./providers/telegram/TelegramProvider";

function App() {
  const { user, playerId, telegramId, setUsername } = useTelegramContext();

  const status = useGameStore((s) => s.status);
  const [roomId, setRoomId] = useState<string>("");
  const [joining, setJoining] = useState<boolean>(false);
  const displayName = user?.username || user?.first_name || "Player";

  const handleCreateRoom = async () => {
    if (joining) return;

    if (!playerId) {
      console.error("Player identity not ready");
      return;
    }

    setJoining(true);

    try {
      const room = await colyseusService.createRoom(
        displayName,
        playerId,
        telegramId
      );

      room.onStateChange.once(() => {
        GameEvents.initialize(room);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const handleJoinRoom = async () => {
    if (joining) return;

    if (!playerId) {
      console.error("Player identity not ready");
      return;
    }

    if (!roomId.trim()) {
      console.error("Room ID is required");
      return;
    }

    setJoining(true);

    try {
      const room = await colyseusService.joinRoomByCode(
        roomId,
        displayName,
        playerId,
        telegramId
      );

      room.onStateChange.once(() => {
        GameEvents.initialize(room);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
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
          username={user?.username ?? ""}
          joining={joining}
          isTelegramUser={!!telegramId}
          setRoomId={setRoomId}
          setUsername={setUsername}
          onCreate={handleCreateRoom}
          onJoin={handleJoinRoom}
        />
      );
  }
}

export default App;
