import { create } from "zustand";
import type { CardDTO } from "../types/game";

export type FlyingCard = {
    id: string;
    card: CardDTO;
    from: {
        x: number;
        y: number;
    };
    to: {
        x: number;
        y: number;
    };
};

type AnimationStore = {
    flyingCards: FlyingCard[];
    addFlyingCard: (card: FlyingCard) => void;
    removeFlyingCard: (id: string) => void;
};

export const useAnimationStore = create<AnimationStore>((set) => ({
    flyingCards: [],
    addFlyingCard: (card: FlyingCard) => set((state) => ({
        flyingCards: [
            ...state.flyingCards,
            card,
        ],
    })),
    removeFlyingCard: (id: string) => set((state) => ({
        flyingCards:
            state.flyingCards.filter(
                (c) => c.id != id
            ),
    })),
}));