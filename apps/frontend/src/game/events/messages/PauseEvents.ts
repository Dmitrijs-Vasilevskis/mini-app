import { useGameStore } from "../../../store/gameStore";
import type { GameRoom } from "../types";

export function RegisterPauseEvents(room: GameRoom) {
    const store = useGameStore.getState();

    room.onMessage("gamePaused",
        (data: { playerId: string, remainingMs: number }) => {
            store.setPaused(
                true,
                data.playerId,
                data.remainingMs
            );
        });

    room.onMessage("gameResumed", () => {
        store.setPaused(
            false,
            undefined,
            undefined
        );
    });
}