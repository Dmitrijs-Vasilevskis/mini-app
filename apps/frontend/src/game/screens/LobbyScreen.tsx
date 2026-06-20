import { useState } from "react";
import { useGameContext } from "../../providers/game/GameProvider";
import { useGameStore } from "../../store/gameStore";
import { LobbyActions } from "../../components/lobby/LobbyActions";
import { LobbyHeader } from "../../components/lobby/LobbyHeader";
import { LobbyPlayers } from "../../components/lobby/LobbyPlayers";

export function LobbyScreen() {
  const roomCode = useGameStore((s) => s.roomCode);
  const hostId = useGameStore((s) => s.hostId);
  const players = useGameStore((s) => s.players);
  const localPlayer = useGameStore((s) => s.localPlayer);

  const { leaveRoom } = useGameContext();
  const [copied, setCopied] = useState(false);

  const isHost = localPlayer?.id === hostId;

  const canStart = players.length >= 1 && players.every((p) => p.isReady);

  const copyInviteLink = async () => {
    if (!roomCode) return;

    // const inviteLink = `https://t.me/mercuria_test_bot/play?startapp=${roomCode}`;

    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#1c0a26] via-[#2a1b40] to-[#0f081d] text-white p-4 select-none overflow-hidden">
      <LobbyHeader
        roomCode={roomCode}
        copied={copied}
        copyInviteLink={copyInviteLink}
      />

      <LobbyPlayers
        players={players}
        localPlayer={localPlayer}
        hostId={hostId}
      />

      <LobbyActions
        isReady={localPlayer?.isReady ?? false}
        isHost={isHost}
        canStart={canStart}
        onLeave={leaveRoom}
      />
    </div>
  );
}
