import { useGameStore } from "../../../store/gameStore";
import type { PlayerDTO } from "../../../types/game";
import type { GameRoom, PlayerSchema, StateCallbacks } from "../types";

export function PlayerListeners(
    room: GameRoom,
    player: PlayerSchema,
    $: StateCallbacks
) {
    const updatePlayer = (updates: Partial<PlayerDTO>) => {
        const players = useGameStore.getState().players;
        const store = useGameStore.getState();
        
        store.setPlayers(
            players.map((p) =>
                p.id === player.id
                    ? {
                        ...p,
                        ...updates
                    }
                    : p
            )
        );

        if (player.id === room.sessionId) {
            const curr = useGameStore.getState().localPlayer;

            if (!curr) {
                return;
            }

            store.setLocalPlayer({
                ...curr,
                ...updates
            });
        }
    };

    $(player).listen(
        "isTurn",
        (isTurn: boolean) => {
            updatePlayer({ isTurn });
        }
    );

    $(player).listen(
        "name",
        (name: string) => {
            updatePlayer({ name });
        }
    );

    $(player).listen(
        "isReady",
        (isReady: boolean) => {
            updatePlayer({ isReady });
        }
    );

    $(player).listen(
        "isConnected",
        (isConnected: boolean) => {
            updatePlayer({ isConnected });
        }
    );

    $(player).listen(
        "saidUno",
        (saidUno: boolean) => {
            updatePlayer({ saidUno });

            if (player.id === room.sessionId) {
                const store = useGameStore.getState();
                const curr = store.localPlayer;

                if (!curr) return;

                store.setLocalPlayer({
                    ...curr,
                    saidUno
                });
            }
        }
    );
}