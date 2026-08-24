import type { BJCardValue, Rank, Suit } from "@uno/shared";
import type { BasePlayerDTO, StoreSlice } from "../types";

export interface BjPlayerDataDTO {
    blackjackStood: boolean;
    handValue: number;
}

export type BjPlayerDTO = BasePlayerDTO<BjPlayerDataDTO>;

export interface BjLocalPlayerDataDTO extends BjPlayerDataDTO {
    hand: BjCardDTO[];
}

export type BjLocalPlayerDTO = BasePlayerDTO<BjLocalPlayerDataDTO>;

export interface BjCardDTO {
    id: string;
    value: BJCardValue;
    suit: Suit;
    rank: Rank;
    isFaceDown?: boolean;
}

export interface BjDealerCardDTO {
    id: string;
    value: BJCardValue | "";
    suit: Suit | "";
    rank: Rank | "";
    isFaceDown: boolean;
}

export interface BjDealerDTO {
    hand: BjDealerCardDTO[];
    handValue: number;
}

export interface BjScoreAnimation {
    points: number;
    id: number;
}

export type BjScoreAnimations = Record<string, BjScoreAnimation>;

export type BjSlice = BjState & BjActions;

export interface BjState {
    cardsRemaining: number;
    bjDealer: BjDealerDTO | null;
    scoreAnimations: BjScoreAnimations;
}

export interface BjActions {
    setCardsRemaining: (count: number) => void;
    setBjDealer: (dealer: BjDealerDTO | null) => void;
    setScoreAnimation: (playerId: string, points: number) => void;
    clearScoreAnimation: (playerId: string, animationId: number) => void;
}

export const initialBjState: BjState = {
    cardsRemaining: 0,
    bjDealer: null,
    scoreAnimations: {},
}

export const bjSlice: StoreSlice<BjSlice> = (set) => ({
    ...initialBjState,
    setCardsRemaining: (count: number) => set({ cardsRemaining: count }),
    setBjDealer: (dealer: BjDealerDTO | null) => set({ bjDealer: dealer }),
    setScoreAnimation: (
        playerId: string,
        points: number
    ) =>
        set((state) => ({
            scoreAnimations: {
                ...state.scoreAnimations,
                [playerId]: {
                    points,
                    id: Date.now() + Math.random(),
                },
            },
        })),
    clearScoreAnimation: (playerId: string, animationId: number) =>
        set((state) => {
            const animation = state.scoreAnimations[playerId];
            if (!animation || animation.id !== animationId) {
                return state;
            }
            const scoreAnimations = {
                ...state.scoreAnimations,
            };

            delete scoreAnimations[playerId];

            return {
                scoreAnimations,
            };
        }),
});