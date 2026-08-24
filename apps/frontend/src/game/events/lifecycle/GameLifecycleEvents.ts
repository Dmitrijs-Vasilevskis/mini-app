import { useEffectStore } from "../../../store/effectsStore";
import { useGameStore } from "../../../store/gameStore";
import type { RoundResults } from "../../../types/game";
import { GameEvents, type GameRoom } from "../types";


export function RegisterGameLifecycleEvents(room: GameRoom) {
    const store = useGameStore.getState();
    const effects = useEffectStore.getState();

    room.onMessage(GameEvents.GAME_END, (data: {
        matchWinnerId: string;
        winnerName: string;
        winnerScore?: number;
    }) => {
        store.setWinner({ id: data.matchWinnerId, name: data.winnerName });

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

    room.onMessage(GameEvents.ERROR, (data: { message: string }) => {
        store.setRoomError(data.message);

        effects.addEffect({
            text: data.message,
            color: "#ef4444",
            emphasis: "special",
        });
    });

    room.onMessage(GameEvents.ROUND_HIGHLIGHT, ({ roundNumber }: { roundNumber: number }) => {
        effects.addEffect({
            text: `ROUND ${roundNumber}`,
            color: "facc15",
            emphasis: "special",
        });
    });
}