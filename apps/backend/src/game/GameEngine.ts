import { Room } from "@colyseus/core";
import { Color, GameState, RoomStatus } from "@uno/shared";
import { DeckManager } from './DeckManager';
import { TurnManager } from './TurnManager';
import { CardValidator } from "./validators/CardValidator";
import { ScodeCalculator } from "./ScoreCalculator";
import { MATCH_WINNING_SCORE } from "./constants";

export class GameEngine {
    constructor(
        private room: Room,
        private state: GameState,
        private deckManager: DeckManager,
        private turnManager: TurnManager,
    ) { }

    startGame() {
        for (const player of this.state.players.values()) {
            player.score = 0;
        }
        this.state.matchWinnerId = "";

        const firstPlayer = this.state.playerOrder[0];

        this.setupRound(firstPlayer);
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

        for (const playerId of this.state.players.values()) {
            playerId.hand.clear();

            playerId.isTurn = false;
            playerId.saidUno = false;

            for (let i = 0; i < 7; i++) {
                const card = this.deckManager.draw();
                if (card) {
                    playerId.hand.push(card);
                }
            }
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
        if (this.state.status !== RoomStatus.PLAYING || this.state.isPaused) return;

        this.resolveUnoWindow();

        const player = this.state.players.get(playerId);

        if (!player || !player.isTurn) {
            return;
        }

        const card = this.deckManager.draw();

        if (card) {
            player.hand.push(card);

            this.room.broadcast(
                'cardDrawn',
                {
                    playerId,
                    count: player.hand.length
                }
            );
        }

        const result = this.turnManager.nextTurn();

        if (result?.type === 'advanced') {
            this.room.broadcast('turnChanged',
                {
                    playerId: result.playerId
                }
            );
        }

        if (result?.type === 'paused') {
            this.room.broadcast('gamePaused', {
                playerId: result.playerId,
                remainingMs: result.remainingMs
            })
        }
    }

    addCardsToPlayer(playerId: string, count: number) {
        const player = this.state.players.get(playerId);
        if (!player) return;

        for (let i = 0; i < count; i++) {
            const card = this.deckManager.draw();
            if (card) {
                player.hand.push(card);
            }
        }

        this.room.broadcast('playerDrewPenalty', { playerId, count });
    }

    playCard(playerId: string, cardId: string, chosenColor?: Color) {
        if (this.state.status !== RoomStatus.PLAYING || this.state.isPaused) return;

        this.resolveUnoWindow()

        const player = this.state.players.get(playerId);
        let turnsToAdvance = 1;

        if (!player || !player.isTurn) {
            return;
        }

        const cardIndex = player.hand.findIndex(c => c.id === cardId);

        if (cardIndex === -1) return;

        const card = player.hand[cardIndex];
        const topCard = this.state.discardPile[this.state.discardPile.length - 1];

        if (!CardValidator.canPlay(card, topCard, this.state.activeColor)) return;

        if (card.value === 'wild' || card.value === 'wildDrawFour') {
            if (!chosenColor) {
                return;
            }
            this.state.activeColor = chosenColor;
        } else {
            this.state.activeColor = card.color!;
        }

        player.hand.splice(cardIndex, 1);

        if (player.hand.length === 1) {
            player.saidUno = false;

            this.state.unoPendingPlayerId = player.id;

            this.room.broadcast(
                'unoAvailable',
                {
                    playerId: player.id
                }
            );
        }

        this.state.discardPile.push(card);

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

        if (result?.type === "advanced") {
            this.room.broadcast(
                "turnChanged",
                {
                    playerId: result.playerId
                }
            );
        }

        if (result?.type === "paused") {
            this.room.broadcast(
                "gamePaused",
                {
                    playerId:
                        result.playerId,
                    remainingMs:
                        result.remainingMs
                }
            );
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

        this.room.broadcast("unoWindowClosed");

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
            this.state.matchWinnerId = playerId;
            this.state.gameEnded = true;

            this.room.broadcast("gameEnd",
                {
                    matchWinnerId: playerId,
                    winnerName: winner.name,
                    winnerScore: winner.score
                }
            );

            return;
        };

        // prevent stuck match if a round winner leaves
        setTimeout(() => {
            if (this.state.players.size < 2) return;

            const starterId = this.state.players.has(playerId)
                ? playerId
                : this.state.playerOrder[0];

            if (!starterId) return;

            this.startNextRound(starterId);
        }, 10000);
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

        if (!offender) return;

        if (offender.id === challengerId) return;

        if (offender.saidUno) return;

        this.addCardsToPlayer(offender.id, 2);

        this.state.unoPendingPlayerId = "";

        this.room.broadcast(
            "unoPenalty",
            {
                offenderId: offender.id,
                challengerId
            }
        );

        this.room.broadcast(
            "unoWindowClosed"
        );
    }

    private resolveUnoWindow() {
        const pendingPlayerId = this.state.unoPendingPlayerId;

        if (!pendingPlayerId) return;

        const player = this.state.players.get(pendingPlayerId);

        if (!player) {
            this.state.unoPendingPlayerId = "";

            this.room.broadcast(
                "unoWindowClosed"
            );

            return;
        }

        player.saidUno = true;

        this.state.unoPendingPlayerId = "";

        this.room.broadcast(
            "unoWindowClosed"
        );
    }
}