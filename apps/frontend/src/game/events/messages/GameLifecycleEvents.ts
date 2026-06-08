import { useEffectStore } from "../../../store/effectsStore";
import { useGameStore } from "../../../store/gameStore";
import type { GameRoom } from "../types";

export function RegisterGameLifecycleEvents(room: GameRoom) {
    const store = useGameStore.getState();
    const effects = useEffectStore.getState();

    room.onMessage("gameEnd", (data: { winnerId: string, winnerName: string }) => {
        store.setWinner({ id: data.winnerId, name: data.winnerName });

        effects.addEffect({
            text: `${data.winnerName} WINS!`,
            color: "#facc15",
            emphasis: "special",
        });
    });

    room.onMessage("gameStarted", () => {
        store.resetGame()
    });
}