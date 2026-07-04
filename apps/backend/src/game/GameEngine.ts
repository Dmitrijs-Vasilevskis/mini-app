import { Room } from "@colyseus/core";
import { Card, Color, GameState, Player, RoomStatus } from "@uno/shared";
import { DeckManager } from './DeckManager';
import { TurnManager } from './TurnManager';
import { CardValidator } from "./validators/CardValidator";
import { ScodeCalculator } from "./ScoreCalculator";
import { MATCH_WINNING_SCORE, ROUND_INTERMISSION_MS } from "./constants";

export class GameEngine {
    private roundStartTimer: ReturnType<typeof setTimeout> | null = null;
    private pauseIntervalTimer: ReturnType<typeof setInterval> | null = null;

    constructor(
        private room: Room,
        private state: GameState,
        private deckManager: DeckManager,
        private turnManager: TurnManager,
    ) { }

    dispose() {
        this.clearRoundStartTimer();
    }

    private clearRoundStartTimer() {
        if (this.roundStartTimer) {
            clearTimeout(this.roundStartTimer);
            this.roundStartTimer = null;
        }
    }

    private clearPauseInterval() {
        if (this.pauseIntervalTimer) {
            clearInterval(this.pauseIntervalTimer);
            this.pauseIntervalTimer = null;
        }
    }

    private isGameplayBlocked(): boolean {
        return this.state.gameEnded || Boolean(this.state.roundWinnerId);
    }

    startGame() {
        for (const player of this.state.players.values()) {
            player.score = 0;
        }
        this.state.matchWinnerId = "";

        const firstPlayer = this.state.playerOrder[0];

        this.setupRound(firstPlayer);
    }

    private syncHandCount(player: Player) {
        player.handCount = player.hand.length;
    }

    private setupRound(startingPlayerId: string) {
        this.deckManager.initialize();

        this.state.isPaused = false;
        this.state.pausedPlayerId = "";
        this.state.roundWinnerId = "";
        this.state.unoPendingPlayerId = "";
        this.state.gameEnded = false;
        this.state.direction = 1;
        this.state.currentTurn = "";

        for (const player of this.state.players.values()) {
            player.hand.clear();
            const client = this.room.clients.find(c => c.sessionId === player.id);

            for (let i = 0; i < 7; i++) {

                const card = this.deckManager.draw((allocatedCard: Card) => {
                    player.hand.push(allocatedCard);

                    if (client?.view) {
                        client.view.add(allocatedCard);
                    }
                });
            }

            player.isTurn = false;
            player.saidUno = false;
            this.syncHandCount(player);
        }

        this.turnManager.assignTurn(startingPlayerId);
        this.state.status = RoomStatus.PLAYING;
    }

    private startNextRound(roundWinnerId: string) {
        this.setupRound(roundWinnerId);

        this.room.broadcast("roundStarted",
            {
                starterPlayerId: roundWinnerId
            }
        );
    }

    drawCard(playerId: string) {
        if (this.state.status !== RoomStatus.PLAYING || this.state.isPaused || this.isGameplayBlocked()) return;

        this.resolveUnoWindow();

        const player = this.state.players.get(playerId);

        if (!player || !player.isTurn) return;

        const client = this.room.clients.find(c => c.sessionId === playerId);

        const card = this.deckManager.draw((allocatedCard) => {
            player.hand.push(allocatedCard);

            if (client?.view) {
                client.view.add(allocatedCard);
            }
        });

        if (card) {
            this.syncHandCount(player);
        }

        const result = this.turnManager.nextTurn();

        if (result?.type === 'paused') {
            this.state.isPaused = true;
            this.state.pausedPlayerId = result.playerId;
            this.state.pausedReconnectRemainingMs = result.remainingMs;
        }
    }

    addCardsToPlayer(playerId: string, count: number) {
        const player = this.state.players.get(playerId);
        if (!player) return;

        const client = this.room.clients.find(c => c.sessionId === playerId);

        for (let i = 0; i < count; i++) {
            this.deckManager.draw((allocatedCard) => {
                player.hand.push(allocatedCard);

                if (client?.view) {
                    client.view.add(allocatedCard);
                }
            });
        }

        this.syncHandCount(player);
    }

    playCard(playerId: string, cardId: string, chosenColor?: Color) {
        if (this.state.status !== RoomStatus.PLAYING || this.state.isPaused || this.isGameplayBlocked()) return;

        this.resolveUnoWindow()

        const player = this.state.players.get(playerId);
        let turnsToAdvance = 1;

        if (!player || !player.isTurn) {
            return;
        }

        const cardIndex = player.hand.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        const card = player.hand[cardIndex];

        if (!CardValidator.canPlay(card, this.state.topDiscardCard, this.state.activeColor)) return;

        if (card.value === 'wild' || card.value === 'wildDrawFour') {
            if (!chosenColor) return;

            this.state.activeColor = chosenColor;
        } else {
            this.state.activeColor = card.color!;
        }

        player.hand.splice(cardIndex, 1);
        this.syncHandCount(player);

        if (player.hand.length === 1) {
            player.saidUno = false;

            this.state.unoPendingPlayerId = player.id;
        }

        this.deckManager.discard(card);

        if (card.value === 'skip') {
            turnsToAdvance = 2;
        } else if (card.value === 'reverse') {
            if (this.state.players.size === 2) {
                turnsToAdvance = 2;
            } else {
                this.state.direction = this.state.direction === 1
                    ? -1
                    : 1;
            }
        } else if (card.value === 'drawTwo') {
            const nextPlayerId = this.turnManager.getNextPlayerId(playerId);

            if (!nextPlayerId) return;

            this.addCardsToPlayer(
                nextPlayerId,
                2
            );

            turnsToAdvance = 2;
        } else if (card.value === 'wildDrawFour') {
            const nextPlayerId = this.turnManager.getNextPlayerId(playerId);

            if (!nextPlayerId) return;

            this.addCardsToPlayer(
                nextPlayerId,
                4
            );

            turnsToAdvance = 2;
        }

        // check for win condition before next turn
        if (player.hand.length === 0) {
            this.handleRoundWin(playerId);
            return;
        }

        let result;
        for (let i = 0; i < turnsToAdvance; i++) {
            result = this.turnManager.nextTurn();
        }

        if (result?.type === "paused") {
            this.state.isPaused = true;
            this.state.pausedPlayerId = result.playerId;
            this.state.pausedReconnectRemainingMs = result.remainingMs;
        }
    }

    private handleRoundWin(playerId: string) {
        const winner = this.state.players.get(playerId);

        if (!winner) {
            return;
        }

        const points = ScodeCalculator.CalculateRoundPoints(
            this.state.players.values(),
            playerId
        );

        winner.score += points;

        this.state.unoPendingPlayerId = "";
        this.state.roundWinnerId = playerId;

        const standings = Array.from(this.state.players.values()).map(player => ({
            playerId: player.id,
            playerName: player.name,
            score: player.score
        })).sort((a, b) => b.score - a.score);

        this.room.broadcast("roundEnded",
            {
                roundWinnerId: playerId,
                roundWinnerName: winner.name,
                pointsAwarded: points,
                totalScore: winner.score,
                standings
            }
        );

        if (winner.score >= MATCH_WINNING_SCORE) {
            this.clearRoundStartTimer();
            this.state.matchWinnerId = playerId;
            this.state.gameEnded = true;
            this.state.status = RoomStatus.FINISHED;

            this.room.broadcast("gameEnd",
                {
                    matchWinnerId: playerId,
                    winnerName: winner.name,
                    winnerScore: winner.score
                }
            );

            return;
        };

        this.clearRoundStartTimer();

        // prevent stuck match if a round winner leaves
        this.roundStartTimer = setTimeout(() => {
            this.roundStartTimer = null;

            if (this.state.players.size < 2) return;

            const starterId = this.state.players.has(playerId)
                ? playerId
                : this.state.playerOrder[0];

            if (!starterId) return;

            this.startNextRound(starterId);
        }, ROUND_INTERMISSION_MS);
    }

    callUno(playerId: string) {
        const player = this.state.players.get(playerId);

        if (!player) return;

        if (this.state.unoPendingPlayerId !== playerId) {
            return;
        }

        player.saidUno = true;
        this.state.unoPendingPlayerId = "";

        this.room.broadcast('unoCalled',
            {
                playerId
            }
        );
    }

    challengeUno(challengerId: string) {
        const offenderId = this.state.unoPendingPlayerId;
        if (!offenderId) return;

        const offender = this.state.players.get(offenderId);
        if (!offender || offender.id === challengerId || offender.saidUno) return;

        this.addCardsToPlayer(offender.id, 2);
        this.state.unoPendingPlayerId = "";

        this.room.broadcast(
            "unoPenalty",
            {
                offenderId: offender.id,
                challengerId
            }
        );
    }

    private resolveUnoWindow() {
        const pendingPlayerId = this.state.unoPendingPlayerId;

        if (!pendingPlayerId) return;

        const player = this.state.players.get(pendingPlayerId);

        if (!player) {
            this.state.unoPendingPlayerId = "";

            return;
        }

        player.saidUno = true;

        this.state.unoPendingPlayerId = "";
    }

    handlePlayerDisconnect(playerId: string, durationMs: number) {
        if (this.state.status !== RoomStatus.PLAYING || this.state.isPaused) return;

        this.state.isPaused = true;
        this.state.pausedPlayerId = playerId;
        this.state.pausedReconnectRemainingMs = durationMs;

        this.clearPauseInterval();

        this.pauseIntervalTimer = setInterval(() => {
            if (this.state.pausedReconnectRemainingMs <= 1000) {
                this.clearPauseInterval();
                this.state.pausedReconnectRemainingMs = 0;
                return;
            }

            this.state.pausedReconnectRemainingMs -= 1000;
        }, 1000);
    }

    handlePlayerReconnect(playerId: string) {
        if (this.state.isPaused && this.state.pausedPlayerId === playerId) {
            this.clearPauseInterval();

            this.state.isPaused = false;
            this.state.pausedPlayerId = "";
            this.state.pausedReconnectRemainingMs = 0;

            // this.room.broadcast("gameResumed");
        }
    }

    handleTimeoutForfeit() {
        this.clearPauseInterval();

        this.state.isPaused = false;
        this.state.pausedPlayerId = "";
        this.state.pausedReconnectRemainingMs = 0;

        this.turnManager.nextTurn();

        // this.room.broadcast("gameResumed");
    }
}