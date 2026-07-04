import { useGameStore } from "../../../store/gameStore";
import type { CardSchema, GameRoom, PlayerSchema, StateCallbacks } from "../types";

export function HandListeners(
    room: GameRoom,
    player: PlayerSchema,
    $: StateCallbacks
) {
    if (player.id !== room.sessionId) return;

    $(player).hand.onAdd((card: CardSchema) => {
        const store = useGameStore.getState();
        const curr = store.localPlayer;

        if (!curr) return;
        if (curr.hand.some((c) => c.id === card.id)) return

        store.setLocalPlayer({
            ...curr,
            hand: [
                ...curr.hand,
                {
                    id: card.id,
                    color: card.color,
                    value: card.value,
                },
            ],
            handCount: player.handCount,
        });
    });

    $(player).hand.onRemove((card: CardSchema) => {
        const store = useGameStore.getState();

        const curr = store.localPlayer;
        if (!curr) return;

        store.setLocalPlayer({
            ...curr,
            hand: curr.hand.
                filter((c) => c.id !== card.id),
            handCount: player.handCount,
        });
    });
}