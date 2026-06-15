import type { CardDTO, Color, PlayerDTO } from "../../types/game";
import { MatchInfoPanel } from "./MatchInfoPanel";

type Props = {
  currentTurnPlayer: PlayerDTO | null;
  discardTop: CardDTO | null;
  activeColor: Color;
  isMyTurn: boolean;
};

export function GameHUD({
  currentTurnPlayer,
  discardTop,
  activeColor,
  isMyTurn,
}: Props) {
  return (
    <>
      <MatchInfoPanel
        currentTurnPlayer={currentTurnPlayer?.name ?? ""}
        activeColor={activeColor}
        discardTop={discardTop}
        isMyTurn={isMyTurn}
      />
    </>
  );
}
