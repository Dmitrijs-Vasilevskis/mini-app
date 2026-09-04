import { bjService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { useBjDealer, useBjLocalPlayer } from "./hooks";
import { DealerHand } from "./scene/DealerHand";
import { HandCards } from "./scene/HandCards";
import { ActionButtons } from "./scene/ActionButtons";
import { usePlayerAnimationStore } from "../../store/playerAnimationStore";

export function BjGameplay() {
  const localPlayer = useBjLocalPlayer();
  const currentTurn = useGameStore((s) => s.currentTurn);
  const bjDelaer = useBjDealer();

  if (!localPlayer) {
    return null;
  }

  const isPlayerTurn = currentTurn === localPlayer.id;
  const hasNaturalBlackjack =
    localPlayer.gameData.handValue === 21 &&
    localPlayer.gameData.hand.length === 2;

  const canHit = isPlayerTurn && !hasNaturalBlackjack;

  const hit = () => {
    const actionId = crypto.randomUUID();

    usePlayerAnimationStore
      .getState()
      .triggerOptimisticAnimation(localPlayer.id, "Hit", actionId);

    bjService.hit(actionId);
  };

  const stand = () => {
    const actionId = crypto.randomUUID();

    usePlayerAnimationStore
      .getState()
      .triggerOptimisticAnimation(localPlayer.id, "No", actionId);

    bjService.stand(actionId);
  };

  return (
    <>
      <ActionButtons
        onHit={hit}
        onStand={stand}
        isPlayerTurn={isPlayerTurn}
        canHit={canHit}
      />
      <HandCards
        cards={localPlayer.gameData.hand}
        handValue={localPlayer.gameData.handValue}
      />
      <DealerHand dealer={bjDelaer} />
    </>
  );
}
