import type { GameEvent } from "@uno/shared";
import { useEmoteStore } from "../../../../store/emoteStore";
import type { GameRoom } from "../../types";
import { usePlayerAnimationStore } from "../../../../store/playerAnimationStore";

export function RegisterPlayerPresentationEvents(room: GameRoom) {
    const emotes = useEmoteStore.getState();
    const animations = usePlayerAnimationStore.getState();

    room.onMessage("game_event", (event: GameEvent) => {
        switch (event.type) {
            case "player.emote":
                emotes.triggerEmote(event.playerId, event.emote);
                break;
            case "player.animation":
                animations.triggerServerAnimation(
                    event.playerId,
                    event.animation,
                    event.eventId,
                    event.actionId
                );
                break;
        }
    });
}