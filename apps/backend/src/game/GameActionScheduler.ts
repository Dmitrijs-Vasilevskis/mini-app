export interface GameAction {
    delayMs: number;
    action: () => void;
}
export class GameActionScheduler {
    private timers = new Set<NodeJS.Timeout>();

    schedule(delayMs: number, action: () => void
    ): void {

        const timer = setTimeout(() => {
            this.timers.delete(timer);
            action();
        }, delayMs);

        this.timers.add(timer);
    }

    sequence(actions: GameAction[]) {
        let index: number = 0;

        const executeNext = () => {
            if (index >= actions.length) return;

            const { delayMs, action } = actions[index++];

            this.schedule(delayMs, () => {
                action();
                executeNext();
            });
        };

        executeNext();
    }

    cancel(timer: NodeJS.Timeout): void {
        if (!this.timers.has(timer)) return;

        clearTimeout(timer);
        this.timers.delete(timer);
    }

    cancelAll(): void {
        for (const timer of this.timers) {
            clearTimeout(timer);
        }

        this.timers.clear();
    }

    hasPendingActions(): boolean {
        return this.timers.size > 0;
    }
}