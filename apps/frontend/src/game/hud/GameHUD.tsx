import type { BasePlayerDTO } from "../../store/types";
import type { CardDTO, Color } from "../../types/game";
import { MatchInfoPanel } from "./MatchInfoPanel";
import { PauseOverlay } from "./PauseOverlay";

type Props = {
  currentTurnPlayer: BasePlayerDTO | null;
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

      <PauseOverlay />
    </>
  );
}
