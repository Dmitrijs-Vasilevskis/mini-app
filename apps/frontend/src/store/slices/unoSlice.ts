import type { Color } from "@uno/shared";
import type { CardDTO, GameDirection } from "../../types/game";
import type { BasePlayerDTO, StoreSlice } from "../types";

export interface UnoPlayerDTO extends BasePlayerDTO {
    handCount: number;
    saidUno: boolean;
}

export interface UnoLocalPlayerDTO extends UnoPlayerDTO {
    hand: CardDTO[];
}

export type UnoSlice = UnoState & UnoActions;

export interface UnoState {
    direction: GameDirection;
    activeColor: Color;
    discardTop: CardDTO | null;
    unoWindowPlayerId: string | null;
}

export interface UnoActions {
    setDiscardTop: (discardTop: CardDTO) => void;
    setActiveColor: (color: Color) => void;
    setDirection: (direction: GameDirection) => void;
    setUnoWindowPlayerId: (playerId: string | null) => void;
}

export const initialUnoState: UnoState = {
    direction: 1,
    activeColor: 'red',
    discardTop: null,
    unoWindowPlayerId: null
}

export const unoSlice: StoreSlice<UnoSlice> = (set) => ({
    direction: 1,
    activeColor: 'red',
    discardTop: null,
    unoWindowPlayerId: null,
    setDiscardTop: (discardTop: CardDTO | null) => set({ discardTop }),
    setActiveColor: (activeColor: Color) => set({ activeColor }),
    setDirection: (direction) => set({ direction }),
    setUnoWindowPlayerId: (playerId: string | null) => set({ unoWindowPlayerId: playerId })
});