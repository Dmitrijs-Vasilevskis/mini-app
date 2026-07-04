
import { getStateCallbacks } from '@colyseus/sdk';
import { RegisterPlayerEvents } from './events/player/PlayerEvents';
import { RegisterRoomEvents } from './events/room/RoomEvents';
import { RegisterGameLifecycleEvents } from './events/messages/GameLifecycleEvents';
import { RegisterPauseEvents } from './events/messages/PauseEvents';
import { RegisterUnoEvents } from './events/messages/UnoEvents';
import { RegisterDiscardPileEvents } from './events/gameplay/DiscardPileEvents';
import type { GameRoom } from './events/types';
import { RegisterEmoteEvents } from './events/messages/EmotesEvents';

export class GameEvents {
    private static currentRoom: GameRoom | null = null;

    static initialize(room: GameRoom) {
        this.destroy();

        this.currentRoom = room;
        const $ = getStateCallbacks(this.currentRoom);

        RegisterPlayerEvents(this.currentRoom, $);
        RegisterRoomEvents(this.currentRoom, $);
        RegisterGameLifecycleEvents(this.currentRoom);
        RegisterPauseEvents(this.currentRoom, $);
        RegisterUnoEvents(this.currentRoom, $);
        RegisterDiscardPileEvents(this.currentRoom, $);
        RegisterEmoteEvents(this.currentRoom);
    }

    static destroy() {
        if (!this.currentRoom) return;

        try {

            this.currentRoom.removeAllListeners();
        } catch (error) {
            console.warn("[GAME EVENTS] Error clearing state callbacks structure:", error);
        }

        this.currentRoom = null;
    }
}