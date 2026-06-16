import { useEffectStore } from "../../../store/effectsStore";
import type { GameRoom } from "../types";

export function RegisterReconnectEvents(room: GameRoom) {
    const effects = useEffectStore.getState();

    room.onMessage("playerReconnected", ({ playerName }) => {
        effects.addEffect({
            text: `${playerName} went back!`,
            color: "#facc15",
            emphasis: "special"
        });
    });
}