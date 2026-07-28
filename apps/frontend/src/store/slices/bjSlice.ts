import type { BJCardValue, Rank, Suit } from "@uno/shared";
import type { StoreSlice } from "../types";

export interface BjCardDTO {
    id: string;
    value: BJCardValue;
    suit: Suit;
    rank: Rank;
    isFaceDown?: boolean;
}

export interface BjDealerDTO {
    hand: BjCardDTO[];
    handValue: number;
}

export type BjSlice = BjState & BjActions;

export interface BjState {
    cardsRemaining: number;
    bjDealer: BjDealerDTO | null;
}
export interface BjActions {
    setCardsRemaining: (count: number) => void,
    setBjDealer: (dealer: BjDealerDTO | null) => void,
}

export const initialBjState: BjState = {
    cardsRemaining: 0,
    bjDealer: null,
}

export const bjSlice: StoreSlice<BjSlice> = (set) => ({
    cardsRemaining: 0,
    bjDealer: null,
    setCardsRemaining: (count: number) => set({ cardsRemaining: count }),
    setBjDealer: (dealer: BjDealerDTO | null) => set({ bjDealer: dealer }),
});