import { useGameStore } from "./store/gameStore";
import { LobbyScreen } from "./game/screens/LobbyScreen";
import { RoomStatus } from "@uno/shared";
import { JoinRoomScreen } from "./game/screens/JoinRoomScreen";
import { GameScreen } from "./game/screens/GameScreen";
import { useGameContext } from "./providers/game/GameProvider";

function App() {
  const {
    user,
    joining,
    roomCode,
    telegramId,
    setRoomCode,
    setUsername,
    createRoom,
    joinRoom,
  } = useGameContext();

  const status = useGameStore((s) => s.status);

  switch (status) {
    case RoomStatus.LOBBY:
      return <LobbyScreen />;
    case RoomStatus.PLAYING:
      return <GameScreen />;
    default:
      return (
        <JoinRoomScreen
          roomCode={roomCode}
          username={user?.username ?? ""}
          joining={joining}
          isTelegramUser={!!telegramId}
          setRoomCode={setRoomCode}
          setUsername={setUsername}
          onCreate={createRoom}
          onJoin={joinRoom}
        />
      );
  }
}

export default App;
