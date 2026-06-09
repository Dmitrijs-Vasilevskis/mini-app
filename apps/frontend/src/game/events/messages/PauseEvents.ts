import { useGameStore } from "../../../store/gameStore";
import { GameEvents, type GameRoom } from "../types";

export function RegisterPauseEvents(room: GameRoom) {
    const store = useGameStore.getState();

    room.onMessage(GameEvents.GAME_PAUSED,
        (data: { playerId: string, remainingMs: number }) => {
            store.setPaused(
                true,
                data.playerId,
                data.remainingMs
            );
        });

    room.onMessage(GameEvents.GAME_RESUMED, () => {
        store.setPaused(
            false,
            undefined,
            undefined
        );
    });
}