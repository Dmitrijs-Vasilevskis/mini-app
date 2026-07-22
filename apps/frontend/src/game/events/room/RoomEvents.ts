import { RoomStatus, type UnoGameState } from '@uno/shared';
import { useGameStore } from '../../../store/gameStore';
import type { GameRoom, StateCallbacks } from '../types';
import { UnoGameStateEvents } from '../uno/UnoGameStateEvents';
import { UnoPlayerGameDataEvents } from '../uno/PlayerGameDataEvents';

export function RegisterRoomEvents(
    room: GameRoom,
    $: StateCallbacks
) {
    const store = useGameStore.getState();
    let activeSubListeners: Array<() => void> = [];

    const cleanupActiveSubListeners = () => {
        if (activeSubListeners.length > 0) {
            activeSubListeners.forEach((unlisten) => unlisten());
            activeSubListeners = [];
        }
    };

    $(room.state).listen(
        "currentTurn",
        (currentTurn: string) => {
            store.setCurrentTurn(currentTurn);
        }
    );

    $(room.state).listen(
        "hostId",
        (hostId: string) => {
            store.setHostId(hostId);
        }
    );

    $(room.state).listen(
        "roomCode",
        (roomCode: string) => {
            console.log(">>> room code update", roomCode);
            store.setRoomCode(roomCode);
        }
    );

    $(room.state).listen(
        "isPaused",
        (isPaused: boolean) => {
            if (!isPaused) {
                store.setPaused(
                    false,
                    undefined,
                    undefined
                );
            }
        }
    );

    $(room.state).listen(
        "pausedPlayerId",
        (pausedPlayerId: string) => {
            const curr = useGameStore.getState();

            curr.setPaused(
                room.state.isPaused,
                pausedPlayerId,
                curr.reconnectRemaining ?? undefined
            );
        }
    );

    $(room.state).listen(
        "status",
        (status: RoomStatus) => {
            store.setStatus(status);

            // clean up gameState listeners
            if (status !== RoomStatus.PLAYING) {
                cleanupActiveSubListeners();
                return;
            }

            const currentGameState = room.state.gameState;
            if (!currentGameState) {
                console.warn("[WARN] Status shifted to PLAYING but room.state.gameState is missing!");
                return;
            }

            switch (room.state.gameType) {
                case "uno":
                    const gameUnlisteners = UnoGameStateEvents($, currentGameState as UnoGameState);
                    const playerUnlisteners = UnoPlayerGameDataEvents($, room);

                    activeSubListeners = [...gameUnlisteners, ...playerUnlisteners];
                    break;
                default:
                    console.error(`[ERROR] Unrecognized game type: ${room.state.gameType}`);
            }
        }
    );
}