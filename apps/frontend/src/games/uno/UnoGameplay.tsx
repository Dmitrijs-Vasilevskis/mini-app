import { useState } from "react";
import { ChallengeUnoButton } from "../../components/games/uno/ChallengeUnoButton";
import { DrawButton } from "../../components/games/uno/DrawButton";
import { LandscapeHandCards } from "../../components/games/uno/card/LandscapeHandCards";
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
import { UnoButton } from "../../components/games/uno/UnoButton";
import { HandCards } from "./hud/HandCards";
import { UnoWildColorPicker } from "../../components/games/uno/UnoWildColorPicker";
import { usePlayerAnimationStore } from "../../store/playerAnimationStore";

export function UnoGameplay() {
  const { isLandscape } = useGameContext();
  const localPlayer = useUnoLocalPlayer();
  const activeColor = useUnoActiveColor();
  const discardTop = useUnoDiscardTop();
  const currentTurn = useGameStore((s) => s.currentTurn);

  const [wildCard, setWildCard] = useState<CardDTO | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  if (!localPlayer) {
    return null;
  }

  const onWilCard = (card: CardDTO) => {
    setWildCard(card);
  };

  const onWildCardColorSelect = (color: Color) => {
    if (!wildCard) return;

    const actionId = crypto.randomUUID();

    usePlayerAnimationStore
      .getState()
      .triggerOptimisticAnimation(localPlayer.id, "Hit", actionId);

    unoService.playCard(wildCard.id, color, actionId);

    setWildCard(null);
  };

  const onDraw = () => {
    const actionId = crypto.randomUUID();

    usePlayerAnimationStore
      .getState()
      .triggerOptimisticAnimation(localPlayer.id, "Hit", actionId);

    unoService.drawCard(actionId);
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

      <DrawButton isMyTurn={localPlayer.id === currentTurn} onDraw={onDraw} />

      {wildCard && <UnoWildColorPicker onSelect={onWildCardColorSelect} />}
    </>
  );
}
