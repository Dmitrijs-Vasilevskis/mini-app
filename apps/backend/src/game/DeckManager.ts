import { GameState, Card, Color, Value } from "@uno/shared";
import { createDeck, shuffle } from "./UNODeck";

export class DeckManager {
    constructor(private state: GameState) { }

    // init deck
    initialize() {
        this.state.deck.clear();
        this.state.discardPile.clear();

        let deckCards = createDeck();
        let firstCardData = deckCards.pop()!;
        // avoid wild as first card
        while (firstCardData.value === 'wild' || firstCardData.value === 'wildDrawFour') {
            deckCards.push(firstCardData);
            deckCards = shuffle(deckCards);
            firstCardData = deckCards.pop()!;
        }
        // Convert plain objects to Card instances
        for (const c of deckCards) {
            const card = new Card();
            card.id = c.id;
            card.color = c.color;
            card.value = c.value;
            this.state.deck.push(card);
        }

        const firstCard = new Card();
        firstCard.id = firstCardData.id;
        firstCard.color = firstCardData.color;
        firstCard.value = firstCardData.value;

        this.state.discardPile.push(firstCard);
        this.state.activeColor = firstCard.color!;
    }

    // reshuffle deck
    reshuffleDiscard() {
        if (this.state.discardPile.length <= 1) {
            return;
        }
        // Remove the top card from discard pile
        const top = this.state.discardPile.pop()!;
        // Convert remaining discard pile to plain objects for shuffling
        const cardsToShuffle = this.state.discardPile.map(c => ({
            id: c.id,
            color: c.color,
            value: c.value
        })) as { id: string; color: Color | null; value: Value }[];
        const shuffledDeck = shuffle(cardsToShuffle);

        for (const cardData of shuffledDeck) {
            const card = new Card();
            card.id = cardData.id;
            card.color = cardData.color;
            card.value = cardData.value;
            this.state.deck.push(card);
        }

        this.state.discardPile.push(top);
    }

    // draw card
    draw(): Card | null {
        if (this.state.deck.length === 0) {
            this.reshuffleDiscard();
        }

        const card = this.state.deck.pop();

        return card || null;
    }
}