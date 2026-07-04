import { useGameStore } from "./store/gameStore";
import { LobbyScreen } from "./game/screens/LobbyScreen";
import { RoomStatus } from "@uno/shared";
import { JoinRoomScreen } from "./game/screens/JoinRoomScreen";
import { GameScreen } from "./game/screens/GameScreen";

function App() {
  const status = useGameStore((s) => s.status);

  switch (status) {
    case RoomStatus.LOBBY:
      return <LobbyScreen />;
    case RoomStatus.PLAYING:
    case RoomStatus.FINISHED:
      return <GameScreen />;
    default:
      return <JoinRoomScreen />;
  }
}

export default App;
