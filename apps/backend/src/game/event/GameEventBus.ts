import { GameEvent, GameEventInput, GameEventType } from "@uno/shared";

type EventHandler<T extends GameEvent> = (event: T) => void;

export class GameEventBus {
    private handlers = new Map<GameEventType, Set<EventHandler<any>>>();

    emit(event: GameEventInput): void {
        const e = {
            ...event,
            eventId: crypto.randomUUID(),
            timestamp: Date.now(),
        } as GameEvent;
        const handlers = this.handlers.get(e.type);

        if (!handlers) {
            return;
        }

        for (const handler of handlers) {
            handler(event);
        }
    }

    on<T extends GameEventType>(
        type: T,
        handler: EventHandler<Extract<GameEvent, { type: T }>>,
    ): () => void {
        let handlers = this.handlers.get(type);

        if (!handlers) {
            handlers = new Set();
            this.handlers.set(type, handlers);
        }

        handlers.add(handler);

        return () => {
            handlers?.delete(handler);

            if (handlers?.size === 0) {
                this.handlers.delete(type);
            }
        };
    }

    clear(): void {
        this.handlers.clear();
    }
}