import { useState } from "react";
import { ChallengeUnoButton } from "../../components/uno/ChallengeUnoButton";
import { DrawButton } from "../../components/uno/DrawButton";
import { HandCards } from "../../components/uno/HandCards";
import { LandscapeHandCards } from "../../components/uno/LandscapeHandCards";
import { UnoButton } from "../../components/uno/UnoButton";
import { UnoWildColorPicker } from "../../components/uno/UnoWildColorPicker";
import { useGameContext } from "../../providers/game/GameProvider";
import type { CardDTO } from "../../types/game";
import {
  useUnoActiveColor,
  useUnoDiscardTop,
  useUnoLocalPlayer,
} from "./hooks";
import type { Color } from "@uno/shared";
import { unoService } from "../../services/colyseus/";
import { useGameStore } from "../../store/gameStore";

export function UnoGameplay() {
  const { isLandscape } = useGameContext();
  const localPlayer = useUnoLocalPlayer();
  const activeColor = useUnoActiveColor();
  const discardTop = useUnoDiscardTop();
  const currentTurn = useGameStore((s) => s.currentTurn);

  const [wildCard, setWildCard] = useState<CardDTO | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const onWilCard = (card: CardDTO) => {
    setWildCard(card);
  };

  const onWildCardColorSelect = (color: Color) => {
    if (!wildCard) return;

    unoService.playCard(wildCard.id, color);

    setWildCard(null);
  };

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

  return (
    <>
      <UnoButton />
      <ChallengeUnoButton />

      {isLandscape ? (
        <HandCards
          cards={localPlayer.gameData.hand}
          onWildCard={onWilCard}
          isPlayable={isPlayable}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
        />
      ) : (
        <LandscapeHandCards
          cards={localPlayer.gameData.hand}
          isPlayable={isPlayable}
          setSelectedCardId={setSelectedCardId}
          onWildCard={onWilCard}
        />
      )}

      <DrawButton
        isMyTurn={localPlayer.id === currentTurn}
        onDraw={() => unoService.drawCard()}
      />

      {wildCard && <UnoWildColorPicker onSelect={onWildCardColorSelect} />}
    </>
  );
}
