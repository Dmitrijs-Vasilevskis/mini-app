import type {
  CardDTO,
  Color,
  LocalPlayerDTO,
  PlayerDTO,
} from "../../types/game";
import { MatchInfoPanel } from "./MatchInfoPanel";
import { PlayerInfoPanel } from "./PlayerInfoPanel";

type Props = {
  roomId: string;
  players: PlayerDTO[];
  currentTurnPlayer: PlayerDTO | null;
  discardTop: CardDTO | null;
  activeColor: Color;
  isMyTurn: boolean;
  localPlayer: LocalPlayerDTO;
};

export function GameHUD({
  currentTurnPlayer,
  discardTop,
  activeColor,
  isMyTurn,
  localPlayer,
}: Props) {
  return (
    <>
      <MatchInfoPanel
        currentTurnPlayer={currentTurnPlayer?.name ?? ""}
        activeColor={activeColor}
        discardTop={discardTop}
      />

      <PlayerInfoPanel cardsCount={localPlayer.handCount} isMyTurn={isMyTurn} />
    </>
  );
}
