import { useGameStore } from "../../../store/gameStore";
import { PlayerListeners } from "./PlayerListeners";
import type { CardDTO } from "../../../types/game";
import type { GameRoom, StateCallbacks } from "../types";
import type { UnoPlayerData } from "@uno/shared";

export function RegisterPlayerEvents(
    room: GameRoom,
    $: StateCallbacks
) {
    const store = useGameStore.getState();

    $(room.state).players.onAdd((player: any) => {
        const existingPlayers = useGameStore.getState().players.filter((p) => p.id !== player.id);

        const unoData = player.gameData as UnoPlayerData;
        const handCount = unoData ? unoData.handCount : 0;
        const saidUno = unoData ? unoData.saidUno : false;

        store.setPlayers([
            ...existingPlayers,
            {
                id: player.id,
                name: player.name,
                handCount: handCount,
                isTurn: player.isTurn,
                isReady: player.isReady,
                isConnected: player.isConnected,
                saidUno: saidUno,
                score: player.score,
                photoUrl: player.photoUrl
            },
        ]);

        PlayerListeners(
            room,
            player,
            $
        );

        if (player.id === room.sessionId) {
            const initialHand = unoData && unoData.hand
                ? unoData.hand.map((card: CardDTO) => ({
                    id: card.id,
                    color: card.color,
                    value: card.value,
                }))
                : [];

            store.setLocalPlayer({
                id: player.id,
                name: player.name,
                hand: initialHand,
                handCount: handCount,
                isTurn: player.isTurn,
                isConnected: player.isConnected,
                isReady: player.isReady,
                saidUno: saidUno,
                score: player.score,
                photoUrl: player.photoUrl,
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