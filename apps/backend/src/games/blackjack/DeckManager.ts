import { BjCard, BjGameState, GameState } from "@uno/shared";
import { createDeck, shuffle } from "./BJDeck";

export class DeckManager {
    private totalDecks: number;
    private totalInitialCards: number;
    private internalDeck: BjCard[] = [];
    private internalDiscardPile: BjCard[] = [];
    private crossedCutCard = false;

    constructor(
        private state: GameState,
        numberOfDecks = 4,
    ) {
        this.totalDecks = numberOfDecks;
        this.totalInitialCards = numberOfDecks * 52;
    }

    private getBjState(): BjGameState {
        return this.state.gameState as BjGameState;
    }

    initialize() {
        const bjState = this.getBjState();
        this.internalDeck = [];
        this.internalDiscardPile = [];

        for (let i = 0; i < this.totalDecks; i++) {
            this.internalDeck.push(...createDeck());
        }

        shuffle(this.internalDeck);
        bjState.cardsRemaining = this.internalDeck.length;
    }

    drawCard(onCardAllocated?: (card: BjCard) => void): { card: BjCard | null; crossedThreshold: boolean } {
        const bjState = this.getBjState();

        // fallback if the shoe becomes empty mid round
        if (this.internalDeck.length === 0) {
            this.recycleDiscardPile();
        }

        const card = this.internalDeck.pop();
        if (!card) return { card: null, crossedThreshold: false };;

        bjState.cardsRemaining = this.internalDeck.length;

        if (onCardAllocated) {
            onCardAllocated(card);
        }

        let crossed = false;
        if (!this.crossedCutCard && this.internalDeck.length < (this.totalInitialCards * 0.25)) {
            this.crossedCutCard = true;
            crossed = true;
        }

        return { card, crossedThreshold: crossed };
    }

    recycleDiscardPile() {
        const combinedDeck = [...this.internalDeck, ...this.internalDiscardPile];
        this.internalDeck = shuffle(combinedDeck);
        this.internalDiscardPile = [];

        this.getBjState().cardsRemaining = this.internalDeck.length;
    }

    collectToDiscard(cards: BjCard[]) {
        this.internalDiscardPile.push(...cards);
    }

    remainingCards(): number {
        return this.internalDeck.length;
    }
}