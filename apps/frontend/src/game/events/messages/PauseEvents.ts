import { useGameStore } from "../../../store/gameStore";
import { GameEvents, type GameRoom, type StateCallbacks } from "../types";

export function RegisterPauseEvents(
    room: GameRoom,
    $: StateCallbacks
) {
    const store = useGameStore.getState();

    $(room.state).listen("isPaused", (isPaused: boolean) => {
        if (!isPaused) {
            store.setPaused(false, undefined, undefined);
        } else {
            store.setPaused(
                true,
                room.state.pausedPlayerId,
                room.state.pausedReconnectRemainingMs
            );
        }
    });

    $(room.state).listen("pausedReconnectRemainingMs", (remainingMs: number) => {
        
        if (room.state.isPaused) {
            store.setPaused(
                true,
                room.state.pausedPlayerId,
                remainingMs
            )
        }
    });

    room.onMessage(GameEvents.GAME_PAUSED,
        (data: { playerId: string, remainingMs: number }) => {
            store.setPaused(
                true,
                data.playerId,
                data.remainingMs
            );
        });
}