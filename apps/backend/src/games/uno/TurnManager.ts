import { GameState, UnoGameState } from "@uno/shared";

export type TurnResult =
    | {
        type: "advanced";
        playerId: string;
    }
    | {
        type: "paused";
        playerId: string;
        remainingMs: number;
    }
    | undefined;

export class TurnManager {
    constructor(private state: GameState) { }

    private getUnoState(): UnoGameState {
        return this.state.gameState as UnoGameState;
    }

    getNextPlayerId(currentId: string): string | null {
        const players = this.state.playerOrder;

        if (players.length === 0) {
            return null;
        }

        const idx = players.indexOf(currentId);

        if (idx === -1) {
            return players[0];
        }

        const unoState = this.getUnoState();

        let next = idx + unoState.direction;

        if (next < 0) {
            next = players.length - 1;
        }

        if (next >= players.length) {
            next = 0;
        }

        return players[next];
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

    nextTurn(): TurnResult {
        const nextPlayerId = this.getNextPlayerId(this.state.currentTurn);

        if (!nextPlayerId) {
            return;
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
            }
        }

        this.assignTurn(nextPlayerId);

        return {
            type: "advanced",
            playerId: nextPlayerId
        }
    }
}