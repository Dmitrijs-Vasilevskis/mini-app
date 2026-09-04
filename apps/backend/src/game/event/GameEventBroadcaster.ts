import { Room } from "colyseus";
import { GameEventBus } from "./GameEventBus";
import { GameEvent } from "@uno/shared";


export class GameEventBroadcaster {
    private unsubscriber: (() => void)[] = [];

    constructor(
        private readonly eventBus: GameEventBus,
        private readonly room: Room
    ) { }

    start(): void {
        this.unsubscriber.push(
            this.eventBus.on(
                "player.animation",
                event => this.broadcast(event)),
            this.eventBus.on(
                "player.emote",
                event => this.broadcast(event)
            ),
        );
    }

    stop(): void {
        for (const unsubscribe of this.unsubscriber) {
            unsubscribe();
        }

        this.unsubscriber = [];
    }

    private broadcast(event: GameEvent): void {
        this.room.broadcast("game_event", event);
    }
}