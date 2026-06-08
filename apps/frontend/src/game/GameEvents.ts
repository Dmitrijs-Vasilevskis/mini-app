
import { getStateCallbacks } from '@colyseus/sdk';
import { RegisterPlayerEvents } from './events/player/PlayerEvents';
import { RegisterRoomEvents } from './events/room/RoomEvents';
import { RegisterGameLifecycleEvents } from './events/messages/GameLifecycleEvents';
import { RegisterPauseEvents } from './events/messages/PauseEvents';
import { RegisterReconnectEvents } from './events/messages/ReconnectEvents';
import { RegisterUnoEvents } from './events/messages/UnoEvents';
import { RegisterDiscardPileEvents } from './events/gameplay/DiscardPileEvents';
import type { GameRoom } from './events/types';

export class GameEvents {
    static initialize(room: GameRoom) {
        const $ = getStateCallbacks(room);

        RegisterPlayerEvents(room, $);
        RegisterRoomEvents(room, $);
        RegisterGameLifecycleEvents(room);
        RegisterPauseEvents(room);
        RegisterReconnectEvents(room);
        RegisterUnoEvents(room);
        RegisterDiscardPileEvents(room, $)
    }
}