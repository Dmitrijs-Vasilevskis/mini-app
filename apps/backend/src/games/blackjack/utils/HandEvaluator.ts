import { ArraySchema } from "@colyseus/schema";
import { BjCard } from "@uno/shared";

export interface HandEvaluation {
    value: number;
    isSoft: boolean;
    isSoft17: boolean;
    isBlackJack: boolean;
    isBust: boolean;
}

export function evaluateHand(hand: ArraySchema<BjCard>): HandEvaluation {
    let total = 0;
    let aceCount = 0;

    for (const card of hand) {
        if (card.rank === 'ace') {
            aceCount++;
            total += 11;
        } else {
            total += parseInt(card.value, 10);
        }
    }

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return {
        value: total,
        isSoft: aceCount > 0,
        isSoft17: aceCount > 0 && total === 17,
        isBlackJack: hand.length === 2 && total === 21,
        isBust: total > 21
    };
}