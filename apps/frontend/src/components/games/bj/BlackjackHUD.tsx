import {
  useBjDealer,
  useBjLocalPlayer,
  useBjPlayers,
} from "../../../games/blackjack/hooks";
import { useGameStore } from "../../../store/gameStore";
import { MatchInfoPanel } from "./MatchInfoPanel";

export function BlackjackHUD() {
  const currentTurn = useGameStore((s) => s.currentTurn);
  const players = useBjPlayers();
  const localPlayer = useBjLocalPlayer();
  const bjDealder = useBjDealer();
  const currentTurnPlayer =
    players.find((p) => p.id === currentTurn)?.name ?? "Dealer";

  if (!localPlayer) {
    return null;
  }

  return (
    <>
      <MatchInfoPanel
        isMyTurn={localPlayer.id === currentTurn}
        currentTurnPlayer={currentTurnPlayer}
        localPlayerHandValue={localPlayer.gameData.handValue}
        dealderHandValue={bjDealder.handValue}
        players={players}
        localPlayer={localPlayer}
      />
    </>
  );
}
