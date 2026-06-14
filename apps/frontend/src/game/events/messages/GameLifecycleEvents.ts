import { useEffectStore } from "../../../store/effectsStore";
import { useGameStore } from "../../../store/gameStore";
import type { RoundResults } from "../../../types/game";
import { GameEvents, type GameRoom } from "../types";

export function RegisterGameLifecycleEvents(room: GameRoom) {
    const store = useGameStore.getState();
    const effects = useEffectStore.getState();

    room.onMessage(GameEvents.GAME_END, (data: { winnerId: string, winnerName: string }) => {
        store.setWinner({ id: data.winnerId, name: data.winnerName });

        effects.addEffect({
            text: `${data.winnerName} WINS!`,
            color: "#facc15",
            emphasis: "special",
        });
    });

    room.onMessage(GameEvents.GAME_START, () => {
        store.resetGame()
    });

    room.onMessage(GameEvents.ROUND_STARTED, () => {
        store.setRoundResults(null);
    });

    room.onMessage(GameEvents.ROUND_ENDED, (results: RoundResults) => {
        store.setRoundResults(results);
    });

    room.onMessage(GameEvents.PLAYER_LEFT, (data: { playerId: string }) => {
        console.log(">> player left", data.playerId);
    })
}