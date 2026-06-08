import { useGameStore } from "../../../store/gameStore";
import { PlayerListeners } from "./PlayerListeners";
import { HandListeners } from "./HandListeners";
import type { CardDTO } from "../../../types/game";
import type { GameRoom, StateCallbacks } from "../types";

export function RegisterPlayerEvents(
    room: GameRoom,
    $: StateCallbacks
) {
    $(room.state).players.onAdd((player: any) => {
        const store = useGameStore.getState();
        const existingPlayers = useGameStore.getState().players.filter((p) => p.id !== player.id);

        store.setPlayers([
            ...existingPlayers,
            {
                id: player.id,
                name: player.name,
                handCount: player.hand.length,
                isTurn: player.isTurn,
                isReady: player.isReady,
                isConnected: player.isConnected,
                saidUno: player.saidUno
            },
        ]);

        PlayerListeners(
            room,
            player,
            $
        );

        HandListeners(
            room,
            player,
            $
        );

        if (player.id === room.sessionId) {

            const initialHand = player.hand.map((card: CardDTO) => ({
                id: card.id,
                color: card.color,
                value: card.value,
            }));

            store.setLocalPlayer({
                id: player.id,
                name: player.name,
                hand: initialHand,
                handCount: initialHand.length,
                isTurn: player.isTurn,
                isConnected: player.isConnected,
                isReady: player.isReady,
                saidUno: player.saidUno
            });
        }
    });

    $(room.state).players.onRemove((_player: any, key: string) => {
        const store = useGameStore.getState();

        store.setPlayers(
            useGameStore.
                getState().
                players.
                filter((p) => p.id != key)
        );
    });
}