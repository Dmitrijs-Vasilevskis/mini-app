import { HitButton } from "../../components/games/bj/HitButton";
import { StandButton } from "../../components/games/bj/StandButton";
import { bjService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { useBjDealer, useBjLocalPlayer } from "./hooks";
import { DealerHand } from "./scene/DealerHand";
import { HandCards } from "./scene/HandCards";

export function BjGameplay() {
  const localPlayer = useBjLocalPlayer();
  const currentTurn = useGameStore((s) => s.currentTurn);
  const bjDelaer = useBjDealer();

  if (!localPlayer) {
    return null;
  }

  const canTakeAction = currentTurn === localPlayer.id;
  const hasNaturalBlackjack =
    localPlayer.gameData.handValue === 21 &&
    localPlayer.gameData.hand.length === 2;

  const isActionAvailable = canTakeAction && !hasNaturalBlackjack;

  const hit = () => {
    bjService.hit();
  };

  const stand = () => {
    bjService.stand();
  };

  // todo: add landscape support for actions buttons

  return (
    <>
      <StandButton onClick={stand} isAvailable={canTakeAction} />
      <HitButton onClick={hit} isAvailable={isActionAvailable} />
      <HandCards
        cards={localPlayer.gameData.hand}
        handValue={localPlayer.gameData.handValue}
      />
      <DealerHand dealer={bjDelaer} />
    </>
  );
}
