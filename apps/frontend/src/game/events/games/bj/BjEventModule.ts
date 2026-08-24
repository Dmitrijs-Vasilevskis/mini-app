import type { BjGameState } from "@uno/shared";
import type { GameEventModule } from "../uno/UnoEventModule";
import { BjGameStateEvents } from "./BjGameStateEvents";
import { BjPlayerGameDataEvents } from "./BjPlayerGameDataEvents";
import { BjEvents } from "./BjEvents";
import { BjGameLifeCycleEvents } from "./BjGameLifeCycleEvents";

export const BjEventModule: GameEventModule = {
    initialize(room, $) {
        const unlisteners: Array<() => void> = [];

        unlisteners.push(
            ...BjGameStateEvents($, room.state.gameState as BjGameState),
            ...BjPlayerGameDataEvents($, room),
            ...BjEvents(room),
            ...BjGameLifeCycleEvents(room),
        );

        return unlisteners;
    }
}