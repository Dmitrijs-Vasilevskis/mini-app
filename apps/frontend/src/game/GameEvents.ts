
import { getStateCallbacks } from '@colyseus/sdk';
import { RegisterBasePlayerEvents } from './events/base/player/BasePlayerEvents';
import { RegisterRoomEvents } from './events/base/room/RoomEvents';
import type { GameRoom } from './events/types';
import { RegisterPauseEvents } from './events/base/messages/PauseEvents';
import { RegisterEmoteEvents } from './events/base/messages/EmotesEvents';
import { RegisterGameLifecycleEvents } from './events/lifecycle/GameLifecycleEvents';
import { RegisterGameModuleEvents } from './events/lifecycle/GameModuleEvents';

export class GameEvents {
    private static currentRoom: GameRoom | null = null;

    static initialize(room: GameRoom) {
        this.destroy();

        this.currentRoom = room;
        const $ = getStateCallbacks(this.currentRoom);

        RegisterBasePlayerEvents(this.currentRoom, $);
        RegisterRoomEvents(this.currentRoom, $);
        RegisterGameLifecycleEvents(this.currentRoom);
        RegisterPauseEvents(this.currentRoom, $);
        RegisterEmoteEvents(this.currentRoom);
        RegisterGameModuleEvents(this.currentRoom, $);
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