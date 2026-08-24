import type { BjCard, BjDealerPublicCard } from "@uno/shared";
import type { BjCardDTO, BjDealerCardDTO } from "../../../../store/slices/bjSlice";

export function mapCardSchema(card: BjCard): BjCardDTO {
    return {
        id: card.id,
        value: card.value,
        suit: card.suit,
        rank: card.rank,
        isFaceDown: card.isFaceDown
    };
}

export function mapDealerCard(card: BjDealerPublicCard): BjDealerCardDTO {
    return {
        id: card.id,
        value: card.value,
        suit: card.suit,
        rank: card.rank,
        isFaceDown: card.isFaceDown
    };
}