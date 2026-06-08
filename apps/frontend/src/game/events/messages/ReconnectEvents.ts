import type { GameRoom } from "../types";

export function RegisterReconnectEvents(room: GameRoom) {
    room.onMessage("playerReconnected", ({ playerId }) => {
        // todo: add effect ti highlihgt reconnected player

        console.log(">> player reconnected", playerId);
    });
}