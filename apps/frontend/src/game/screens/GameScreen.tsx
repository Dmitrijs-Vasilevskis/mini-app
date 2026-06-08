import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { GameHUD } from "../hud/GameHUD";
import { Table3D } from "../../components/table/Table3D";
import { FloatingActionText } from "../../components/uno/FloatingActionText";
import { HandCards } from "../../components/uno/HandCards";
import { DrawButton } from "../../components/uno/DrawButton";
import { WildColorPicker } from "../../components/uno/WildColorPicker";
import type { CardDTO, Color } from "../../types/game";
import { colyseusService } from "../../services/colyseus";
import { UnoButton } from "../../components/uno/UnoButton";
import { ChallengeUnoButton } from "../../components/uno/ChallengeUnoButton";
import { VictoryOverlay } from "../../components/uno/VictoryOverlay";

export function GameScreen() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [wildCard, setWildCard] = useState<CardDTO | null>(null);

  const localPlayer = useGameStore((s) => s.localPlayer);
  const players = useGameStore((s) => s.players);
  const discardTop = useGameStore((s) => s.discardTop);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const activeColor = useGameStore((s) => s.activeColor);
  const winner = useGameStore((s) => s.winner);
  const roomCode = useGameStore((s) => s.roomCode);

  // todo: add reloader/name input field to a join screen
  if (!localPlayer || !roomCode) {
    return <div className="text-white">Loading game...</div>;
  }

  const currentTurnPlayer = players.find((p) => p.id === currentTurn) ?? null;
  const isMyTurn = localPlayer.id === currentTurn;

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

  return (
    <div
      className="relative h-screen w-screen text-white overflow-hidden bg-gradient-to-b from-[#ac61a3] to-[#2a57c0]"
      onClick={() => {
        setSelectedCardId(null);
      }}
    >
      {/* 2D UI Overlay */}
      <GameHUD
        roomId={roomCode}
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

      <UnoButton />

      <ChallengeUnoButton />

      <DrawButton
        isMyTurn={isMyTurn}
        onDraw={() => colyseusService.drawCard()}
      />

      {wildCard && <WildColorPicker onSelect={onWildCardColorSelect} />}
    </div>
  );
}
