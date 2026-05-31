import type {
  CardDTO,
  Color,
  LocalPlayerDTO,
  PlayerDTO,
} from "../../types/game";
import { MatchInfoPanel } from "./MatchInfoPanel";
import { PlayerInfoPanel } from "./PlayerInfoPanel";
import { RoomInfoPanel } from "./RoomInfoPanel";

type Props = {
  roomId: string;
  players: PlayerDTO[];
  currentTurnPlayer: PlayerDTO | null;
  discardTop: CardDTO;
  activeColor: Color;
  isMyTurn: boolean;
  localPlayer: LocalPlayerDTO;
};

export function GameHUD({
  roomId,
  players,
  currentTurnPlayer,
  discardTop,
  activeColor,
  isMyTurn,
  localPlayer,
}: Props) {
  return (
    <>
    <MatchInfoPanel
        currentTurnPlayer={currentTurnPlayer.name ?? ""}
        activeColor={activeColor}
        discardTop={discardTop}
      />
      
      <RoomInfoPanel roomId={roomId} playerCount={players.length} />

      <PlayerInfoPanel cardsCount={localPlayer.handCount} isMyTurn={isMyTurn} />
    </>
  );
}
