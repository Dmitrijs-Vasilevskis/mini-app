import { useGameStore } from "./store/gameStore";
import { Table3D } from "./components/table/Table3D";
import { useTelegramContext } from "./providers/telegram/TelegramContext";
import { colyseusService } from "./services/colyseus";
import { useState } from "react";
import { GameEvents } from "./game/GameEvents";
import type { CardDTO, Color } from "./types/game";
import { LobbyScreen } from "./game/LobbyScreen";
import { HandCards } from "./game/HandCards";
import { FloatingActionText } from "./game/FloatingActionText";
import { WildColorPicker } from "./game/WildColorPicker";
import { VictoryOverlay } from "./game/VictoryOverlay";
import { DrawButton } from "./game/DrawButton";
import { GameHUD } from "./game/hud/GameHUD";

function App() {
  const { user } = useTelegramContext();
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const localPlayer = useGameStore((s) => s.localPlayer);
  const players = useGameStore((s) => s.players);
  const discardTop = useGameStore((s) => s.discardTop);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const activeColor = useGameStore((s) => s.activeColor);
  const winner = useGameStore((s) => s.winner);
  const [wildCard, setWildCard] = useState<CardDTO | null>(null);

  const isPlayable = (card: CardDTO) => {
    if (card.value === "wild" || card.value === "wildDrawFour") {
      return true;
    }

    if (card.color === activeColor) {
      return true;
    }

    if (card.value === discardTop?.value) {
      return true;
    }

    return false;
  };

  const onWilCard = (card: CardDTO) => {
    setWildCard(card);
  };

  const onWildCardColorSelect = (color: Color) => {
    if (!wildCard) return;

    colyseusService.playCard(wildCard.id, color);

    setWildCard(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleCreateRoom = async () => {
    const room = await colyseusService.createRoom(user.username);

    GameEvents.initialize(room);

    setRoomId(room.roomId);

    setJoined(true);
  };

  const handleJoinRoom = async () => {
    const room = await colyseusService.joinRoomById(roomId, user.username);

    GameEvents.initialize(room);

    setJoined(true);
  };

  const currentTurnPlayer = players.find((p) => p.id === currentTurn) ?? null;

  if (!joined) {
    return (
      <LobbyScreen
        roomId={roomId}
        setRoomId={setRoomId}
        onCreate={handleCreateRoom}
        onJoin={handleJoinRoom}
      />
    );
  }

  if (!localPlayer) {
    return <div>Loading...</div>;
  }

  const isMyTurn = localPlayer.id === currentTurn;

  return (
    <div
      className="relative h-screen w-screen text-white overflow-hidden bg-gradient-to-b from-[#ac61a3] to-[#2a57c0]"
      onClick={() => {
        setSelectedCardId(null);
      }}
    >
      {/* 2D UI Overlay */}
      <GameHUD
        roomId={roomId}
        players={players}
        currentTurnPlayer={currentTurnPlayer}
        discardTop={discardTop}
        activeColor={activeColor}
        isMyTurn={isMyTurn}
        localPlayer={localPlayer}
      />

      {winner && (
        <VictoryOverlay
          winnerName={winner.name}
          isLocalWinner={winner.id === localPlayer.id}
        />
      )}

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Table3D />
      </div>
      {/* Floating Ation Highlighting */}
      <FloatingActionText />

      {/* Hand Cards */}
      <HandCards
        cards={localPlayer.hand}
        onWildCard={onWilCard}
        isPlayable={isPlayable}
        selectedCardId={selectedCardId}
        setSelectedCardId={setSelectedCardId}
      />
      <DrawButton
        isMyTurn={isMyTurn}
        onDraw={() => colyseusService.drawCard()}
      />

      {wildCard && <WildColorPicker onSelect={onWildCardColorSelect} />}
    </div>
  );
}

export default App;
