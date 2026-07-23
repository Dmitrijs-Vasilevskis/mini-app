import { GameState } from "@uno/shared";


export type TurnResult =
    | { type: "advanced"; playerId: string }
    | { type: "dealer" }
    | { type: "paused"; playerId: string; remainingMs: number }
    | undefined;


export class TurnManager {
    constructor(private state: GameState) { }

    getNextPlayerId(currentId: string): string | null {
        const players = this.state.playerOrder;

        if (players.length === 0) {
            return null;
        }

        const idx = players.indexOf(currentId);

        if (idx === -1 || currentId === "dealer") {
            return null;
        }

        const nextIdx = idx + 1;

        if (nextIdx >= players.length) {
            return "dealer";
        }

        return players[nextIdx];
    }

    assignTurn(playerId: string) {
        const prevPlayer = this.state.players.get(this.state.currentTurn);

        if (prevPlayer) {
            prevPlayer.isTurn = false;
        }

        const nextPlayer = this.state.players.get(playerId);
        if (nextPlayer) {
            nextPlayer.isTurn = true;
        }

        this.state.currentTurn = playerId;
    }

    nextTurn(nextPlayerId: string): TurnResult {
        if (!nextPlayerId) {
            return;
        }

        if (nextPlayerId === "dealer") {
            this.assignTurn("dealer");
            return {
                type: "advanced",
                playerId: "dealer"
            };
        }

        const nextPlayer = this.state.players.get(nextPlayerId);

        if (!nextPlayer) {
            return;
        }

        if (!nextPlayer.isConnected) {
            const elapsed = Date.now() - nextPlayer.disconnectedAt;
            const remainingMs = Math.max(0, 30000 - elapsed);

            this.state.isPaused = true;
            this.state.pausedPlayerId = nextPlayerId;

            return {
                type: "paused",
                playerId: nextPlayerId,
                remainingMs
            };
        }

        this.assignTurn(nextPlayerId);

        return {
            type: "advanced",
            playerId: nextPlayerId
        };
    }
}