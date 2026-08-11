import type { GameType } from "@uno/shared";
import { LobbyGameChange } from "./LobbyGameChange";
import { LobbyGameCode } from "./LobbyGameCode";

interface Props {
  roomCode: string | null;
  copyInviteLink: () => void;
  copied: boolean;
  gameType: GameType;
  onAction: () => void;
}

export function LobbyHeader({
  roomCode,
  copyInviteLink,
  copied,
  gameType,
  onAction,
}: Props) {
  return (
    <>
      <LobbyGameCode
        roomCode={roomCode}
        copyInviteLink={copyInviteLink}
        copied={copied}
      />
      <LobbyGameChange gameType={gameType} onAction={onAction} />
    </>
  );
}
