import { colyseusService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { ReactionButton } from "./ReactionButton";

export function ChallengeUnoButton() {
  const localPlayer = useGameStore((s) => s.localPlayer);
  const unoWindowPlayerId = useGameStore((s) => s.unoWindowPlayerId);

  const visible =
    !!localPlayer &&
    !!unoWindowPlayerId &&
    unoWindowPlayerId !== localPlayer.id;

  return (
    <ReactionButton
      visible={visible}
      text="Challenge UNO!"
      color="red"
      onClick={() => colyseusService.challengeUno()}
    />
  );
}
