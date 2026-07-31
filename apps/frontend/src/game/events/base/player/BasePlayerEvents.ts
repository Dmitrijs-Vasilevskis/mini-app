import { useGameStore } from "../../../../store/gameStore";
import { BasePlayerListeners } from "./BasePlayerListeners";
import type { GameRoom, PlayerSchema, StateCallbacks } from "../../types";
import { mapPlayer } from "../../mappers/PlayerMapper";

export function RegisterBasePlayerEvents(
    room: GameRoom,
    $: StateCallbacks
) {
    const store = useGameStore.getState();

    $(room.state).players.onAdd((player: PlayerSchema) => {
        const existingPlayers = useGameStore.getState().players.filter((p) => p.id !== player.id);
        const mappedPlayer = mapPlayer(player);

        store.setPlayers([
            ...existingPlayers,
            mappedPlayer
        ]);

        BasePlayerListeners(
            room,
            player,
            $
        );

        if (player.id === room.sessionId) {
            store.setLocalPlayer(mappedPlayer);
        }
    });

    $(room.state).players.onRemove((_player: PlayerSchema, key: string) => {
        const store = useGameStore.getState();

        store.setPlayers(
            useGameStore.
                getState().
                players.
                filter((p) => p.id != key)
        );
    });
}