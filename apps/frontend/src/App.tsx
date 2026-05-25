import { useGameStore } from "./store/gameStore";
import { Table3D } from "./components/table/Table3D";
import { useTelegramContext } from "./providers/telegram/TelegramContext";
import { colyseusService } from "./services/colyseus";
import { useState } from "react";
import { GameEvents } from "./game/GameEvents";
import type { CardDTO } from "./types/game";
import { LobbyScreen } from "./game/LobbyScreen";
import { HandCards } from "./game/HandCards";
import { FloatingActionText } from "./game/FloatingActionText";
import { WildColorPicker } from "./game/WildColorPicker";
import type { Color } from "@uno/shared";
import { VictoryOverlay } from "./game/VictoryOverlay";
import { DrawButton } from "./game/DrawButton";

function App() {
  const { user, ready } = useTelegramContext();
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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
    if(!wildCard) return;
    
    colyseusService.playCard(wildCard.id, color);

    setWildCard(null);
  };

  const currentTurnPlayer = players.find((p) => p.id === currentTurn);
  const currentTurnPlayerName = currentTurnPlayer ? currentTurnPlayer.name : "Unknown";

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
      className="relative h-screen w-screen bg-gray-900 text-white overflow-hidden"
      onClick={() => {
        setSelectedCardId(null);
      }}
    >
      {/* 2D UI Overlay */}
      <div className="absolute top-0 left-0 z-10 p-4 bg-black/50 rounded-br-lg">
        <h1 className="text-2xl font-bold">UNO Mini App</h1>
        <div>Room ID: {colyseusService.room?.roomId}</div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(colyseusService.room?.roomId || "");
          }}
          className="bg-gray-700 px-2 py-1 rounded"
        >
          Copy
        </button>
        <div>Players: {players.map((p) => p.name).join(", ")}</div>
        <div>Current turn: {currentTurnPlayerName}</div>
        <div>Your cards: {localPlayer.hand.length}</div>
        <div>
          <span>Last played card:</span>
          <span>{discardTop?.color}</span>
          <span>{discardTop?.value}</span>
        </div>
        {isMyTurn && <div className="text-green-400 font-bold">YOUR TURN!</div>}
      </div>

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
      <DrawButton isMyTurn={isMyTurn} onDraw={() => colyseusService.drawCard()} />

      {wildCard && <WildColorPicker onSelect={onWildCardColorSelect} />}
    </div>
  );
}

export default App;
