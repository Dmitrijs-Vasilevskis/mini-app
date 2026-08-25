import { bjService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { useBjDealer, useBjLocalPlayer } from "./hooks";
import { DealerHand } from "./scene/DealerHand";
import { HandCards } from "./scene/HandCards";
import { ActionButtons } from "./scene/ActionButtons";

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
    bjService.hit();
  };

  const stand = () => {
    bjService.stand();
  };

  // todo: add landscape support for actions buttons

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
