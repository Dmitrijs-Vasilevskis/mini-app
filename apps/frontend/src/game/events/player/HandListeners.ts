import { useGameStore } from "../../../store/gameStore";
import type { CardSchema, GameRoom, PlayerSchema, StateCallbacks } from "../types";

export function HandListeners(
    room: GameRoom,
    player: PlayerSchema,
    $: StateCallbacks
) {
    $(player).hand.onAdd((card: CardSchema) => {
        const store = useGameStore.getState();

        store.setPlayers(
            store.players.map((p) =>
                p.id === player.id
                    ? {
                        ...p,
                        handCount: p.handCount + 1
                    }
                    : p
            )
        );

        // local player hand sync
        if (player.id === room.sessionId) {
            const current = useGameStore.getState().localPlayer;

            if (!current) return;

            const exists = current.hand.some(
                (c) => c.id === card.id
            );

            if (exists) return;

            store.setLocalPlayer({
                ...current,
                hand: [
                    ...current.hand,
                    {
                        id: card.id,
                        color: card.color,
                        value: card.value,
                    },
                ],
                handCount: current.handCount + 1,
            })
        }
    });

    $(player).hand.onRemove((card: CardSchema) => {
        const store = useGameStore.getState();

        store.setPlayers(
            store.players.map((p) =>
                p.id === player.id
                    ? {
                        ...p,
                        handCount: p.handCount - 1
                    }
                    : p
            )
        );

        // local player hand sync
        if (player.id === room.sessionId) {
            const current = useGameStore.getState().localPlayer;

            if (!current) return;

            store.setLocalPlayer({
                ...current,
                hand: current.hand.
                    filter((c) => c.id !== card.id),
                handCount: current.handCount - 1,
            })
        }
    });
}