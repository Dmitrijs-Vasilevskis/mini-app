import { useEffectStore } from "../../../store/effectsStore";
import { useGameStore } from "../../../store/gameStore";
import type { PlayerDTO } from "../../../types/game";
import type { GameRoom, PlayerSchema, StateCallbacks } from "../types";

export function PlayerListeners(
    room: GameRoom,
    player: PlayerSchema,
    $: StateCallbacks
) {
    const store = useGameStore.getState();

    const updatePlayer = (updates: Partial<PlayerDTO>) => {
        const players = useGameStore.getState().players;

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

    let wasConnected = player.isConnected;

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
            const reconnected = !wasConnected && isConnected;
            wasConnected = isConnected;

            updatePlayer({ isConnected });

            if (reconnected) {
                useEffectStore.getState().addEffect({
                    text: `${player.name} went back!`,
                    color: "#facc15",
                    emphasis: "special",
                });
            }
        }
    );
}