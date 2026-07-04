import { GameState, Card, Color, Value } from "@uno/shared";
import { createDeck, shuffle } from "./UNODeck";

const NUMBER_VALUES: Value[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
];

export class DeckManager {
    private internalDeck: Card[] = [];
    private internalDiscardPile: Card[] = [];

    constructor(
        private state: GameState,

    ) { }

    initialize() {
        this.internalDeck = createDeck();
        this.internalDiscardPile = [];
        this.state.topDiscardCard = null;

        const firstCardIndex = this.internalDeck.findIndex(card => NUMBER_VALUES.includes(card.value));
        const [firstCard] = this.internalDeck.splice(firstCardIndex, 1);

        this.internalDiscardPile.push(firstCard);
        this.state.topDiscardCard = firstCard;
        this.state.activeColor = firstCard.color!;
    }

    reshuffleDiscard() {
        if (this.internalDiscardPile.length <= 1) return;

        const top = this.internalDiscardPile.pop()!;

        this.internalDeck = shuffle(this.internalDiscardPile);
        this.internalDiscardPile = [top];
    }

    draw(onCardAllocated?: (card: Card) => void): Card | null {
        if (this.internalDeck.length === 0) {
            this.reshuffleDiscard();
        }

        const card = this.internalDeck.pop();
        if (!card) return null;

        if (onCardAllocated) {
            onCardAllocated(card);
        }

        return card;
    }

    discard(card: Card) {
        this.internalDiscardPile.push(card);
        this.state.topDiscardCard = card;
    }
}