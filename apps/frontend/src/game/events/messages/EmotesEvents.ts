import { useEmoteStore } from "../../../store/emoteStore";
import type { GameRoom } from "../types";

export function RegisterEmoteEvents(room: GameRoom) {
    const emotes = useEmoteStore.getState();

    room.onMessage("onEmoteReceived", (data: { senderId: string, emoteId: string }) => {
        emotes.triggerEmote(data.senderId, data.emoteId);
    });
}