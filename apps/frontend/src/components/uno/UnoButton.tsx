import { colyseusService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { ReactionButton } from "./ReactionButton";

export function UnoButton() {
  const localPlayer = useGameStore((s) => s.localPlayer);

  const visible =
    !!localPlayer && localPlayer.handCount === 1 && !localPlayer.saidUno;

  return (
    <ReactionButton
      visible={visible}
      text="UNO!!"
      color="yellow"
      onClick={() => colyseusService.callUno()}
    />
  );
}
