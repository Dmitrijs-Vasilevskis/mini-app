import { Room } from "@colyseus/core";
import { GameState, BjCard, RoomStatus, Player, BjPlayerData, BjGameState } from '@uno/shared';
import { MATCH_WINNING_SCORE } from "./constants";
import { DeckManager } from "./DeckManager";
import { TurnManager } from "./TurnManager";
import { evaluateHand } from "./utils/HandEvaluator";

export class BlackjackGameEngine {
    private needsReshuffle = false;

    constructor(
        private room: Room,
        private state: GameState,
        private deckManager: DeckManager,
        private turnManager: TurnManager,
    ) { }

    private getBjState(): BjGameState {
        return this.state.gameState as BjGameState;
    }

    private getBjData(player: Player): BjPlayerData {
        return player.gameData as BjPlayerData;
    }

    startGame() {
        for (const player of this.state.players.values()) {
            player.score = 0;
        }

        this.state.matchWinnerId = "";
        this.state.roundNumber = 1;
        this.needsReshuffle = false;

        this.deckManager.initialize();

        this.setupRound();
    }

    private setupRound() {
        const bjState = this.getBjState();

        const shiftAmount = (this.state.roundNumber - 1) % this.state.playerOrder.length;
        const shiftedOrder = [
            ...this.state.playerOrder.slice(shiftAmount),
            ...this.state.playerOrder.slice(0, shiftAmount)
        ];

        this.state.playerOrder.clear();
        shiftedOrder.forEach(id => this.state.playerOrder.push(id));

        bjState.bjDealer.hand.clear();

        // initial player states
        this.state.playerOrder.forEach((playerId) => {
            const player = this.state.players.get(playerId);
            if (!player) return;

            if (!(player.gameData instanceof BjPlayerData)) {
                player.gameData = new BjPlayerData();
            }

            const bjData = this.getBjData(player);

            bjData.hand.clear();
            bjData.handValue = 0;
            bjData.blackjackStood = false;

            player.isTurn = false;
        });

        // deal initial hands
        this.state.playerOrder.forEach((playerId) => {
            const player = this.state.players.get(playerId);
            if (!player) return;

            const client = this.room.clients.find(c => c.sessionId === player.id);
            const bjData = this.getBjData(player);

            for (let i = 0; i < 2; i++) {
                const { crossedThreshold } = this.deckManager.drawCard((allocatedCard: BjCard) => {
                    bjData.hand.push(allocatedCard);

                    if (client?.view) {
                        client.view.add(allocatedCard);
                    }
                });

                if (crossedThreshold) {
                    this.needsReshuffle = true;
                };
            }

            const hand = evaluateHand(bjData.hand);
            bjData.handValue = hand.value;
        });

        this.initDealer();

        this.turnManager.assignTurn(this.state.playerOrder[0]);
        this.state.status = RoomStatus.PLAYING;
    }

    private initDealer() {
        const bjState = this.getBjState();

        for (let i = 0; i < 2; i++) {
            const { crossedThreshold } = this.deckManager.drawCard((allocatedCard: BjCard) => {
                allocatedCard.isFaceDown = (i === 1);
                bjState.bjDealer.hand.push(allocatedCard);

                if (i === 0) {
                    this.room.clients.forEach(client => client.view?.add(allocatedCard));
                }
            });

            if (crossedThreshold) {
                this.needsReshuffle = true;
            }
        }

        const hand = evaluateHand(bjState.bjDealer.hand);

        bjState.bjDealer.handValue = hand.value;
    }

    handlePlayerHit(playerId: string) {
        const player = this.state.players.get(playerId);

        if (!player || !player.isTurn) return;

        const client = this.room.clients.find(c => c.sessionId === playerId);
        const bjData = this.getBjData(player);

        const { crossedThreshold } = this.deckManager.drawCard((allocatedCard: BjCard) => {
            bjData.hand.push(allocatedCard);

            if (client?.view) {
                client.view.add(allocatedCard);
            }
        });

        if (crossedThreshold) {
            this.needsReshuffle = true;
        }


        const hand = evaluateHand(bjData.hand);
        bjData.handValue = hand.value;

        if (hand.isBust) {
            player.isTurn = false;
            bjData.blackjackStood = true;

            this.moveToNextTurn();
        }
    }

    handlePlayerStand(playerId: string) {
        const player = this.state.players.get(playerId);

        if (!player || !player.isTurn) return;

        const bjData = this.getBjData(player);

        player.isTurn = false;
        bjData.blackjackStood = true;

        this.moveToNextTurn();
    }

    private moveToNextTurn() {
        const nextPlayerId = this.turnManager.getNextPlayerId(this.state.currentTurn);

        if (!nextPlayerId) return;

        const result = this.turnManager.nextTurn(nextPlayerId);

        switch (result?.type) {
            case "advanced":
                break;
            case "paused":
                this.state.isPaused = true;
                this.state.pausedPlayerId = result.playerId;
                this.state.pausedReconnectRemainingMs = result.remainingMs;
                break;
            case "dealer":
                this.executeDealerTurn();
                break;
        }
    }

    private executeDealerTurn() {
        const bjState = this.getBjState();
        // reveal dealer hidden card
        bjState.bjDealer.hand.forEach((card: BjCard) => {
            if (card.isFaceDown === true) {
                card.isFaceDown = false;

                this.room.clients.forEach((client) => {
                    client.view?.add(card);
                })
            }
        });

        let dealerScore = evaluateHand(bjState.bjDealer.hand);

        while (dealerScore.value < 17) {
            const { crossedThreshold } = this.deckManager.drawCard((allocatedCard: BjCard) => {
                bjState.bjDealer.hand.push(allocatedCard);

                this.room.clients.forEach(client => {
                    if (client?.view) {
                        client.view.add(allocatedCard);
                    }
                });
            });

            if (crossedThreshold) {
                this.needsReshuffle = true;
            }

            dealerScore = evaluateHand(bjState.bjDealer.hand);
        }
        bjState.bjDealer.handValue = dealerScore.value;
        this.finalizeRound();
    }

    private finalizeRound() {
        const bjState = this.getBjState();
        const dealerHand = evaluateHand(bjState.bjDealer.hand);

        this.state.playerOrder.forEach((playerId) => {
            const player = this.state.players.get(playerId);
            if (!player) return;

            const bjData = this.getBjData(player);
            const playerHand = evaluateHand(bjData.hand);

            if (playerHand.isBust) {
                return;
            }

            if (playerHand.isBlackJack) {
                if (dealerHand.isBlackJack) return;

                player.score += 2;
                return;
            }

            if (dealerHand.value > 21 || playerHand.value > dealerHand.value) {
                player.score += 1;
            }
        });

        this.collectPlayedCardsToDiscard();
        this.handleRoundWin();
    }

    private collectPlayedCardsToDiscard() {
        const bjState = this.getBjState();
        const dealerCards: BjCard[] = [];

        bjState.bjDealer.hand.forEach((c: BjCard) => dealerCards.push(c));
        this.deckManager.collectToDiscard(dealerCards);

        this.state.players.forEach((player) => {
            const bjData = this.getBjData(player);
            if (bjData.hand) {
                const playerCards: BjCard[] = [];
                bjData.hand.forEach((c: BjCard) => playerCards.push(c));
                this.deckManager.collectToDiscard(playerCards);
            }
        });
    }

    private handleRoundWin() {
        let leadingPlayerId = "";
        let maxScore = 0;

        for (const player of this.state.players.values()) {
            if (player.score >= MATCH_WINNING_SCORE && player.score > maxScore) {
                maxScore = player.score;
                leadingPlayerId = player.id;
            }
        }

        if (leadingPlayerId) {
            this.state.matchWinnerId = leadingPlayerId;
            this.state.gameEnded = true;
            this.state.status = RoomStatus.FINISHED;

        } else {
            this.state.roundNumber = (this.state.roundNumber || 1) + 1;

            if (this.needsReshuffle) {
                this.deckManager.recycleDiscardPile();
                this.needsReshuffle = false;
            }

            this.setupRound();
        }
    }
}