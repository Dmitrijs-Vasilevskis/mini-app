import { BjCard, BJCardValue, Rank, Suit } from '@uno/shared';
import { v4 as uuidv4 } from 'uuid';

export function createDeck(): BjCard[] {
    const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
    const suits: Suit[] = ["clubs", "diamonds", "hearts", "spades"];
    const deck: BjCard[] = [];

    for (const rank of ranks) {
        for (const suit of suits) {
            const card = new BjCard();
            card.id = uuidv4();
            card.suit = suit;
            card.rank = rank;
            card.value = getValueForRank(rank);

            deck.push(card);
        }
    }

    return deck;
}

export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        const temp = array[i];
        array[i] = array[j]
        array[j] = temp!;
    }

    return array;
}

function getValueForRank(rank: Rank): BJCardValue {
    if (rank === "ace") return "11";
    if (["jack", "queen", "king"].includes(rank)) return "10";

    return rank as BJCardValue;
}