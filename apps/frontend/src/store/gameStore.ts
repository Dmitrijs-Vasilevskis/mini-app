import { create } from "zustand";
import { type Color } from "@uno/shared";

import type {
    CardDTO,
    GameStore,
    GameWinner,
    LocalPlayerDTO,
    PlayerDTO,
} from '../types/game';

export const useGameStore =
    create<GameStore>((set) => ({
        connected: false,
        roomId: null,
        currentTurn: '',
        activeColor: 'red',
        discardTop: null,
        players: [],
        localPlayer: null,
        winner: null,
        setConnected: (value: boolean) => {
            set({ connected: value })
        },
        setRoomId: (roomId: string) => {
            set({ roomId })
        },
        setCurrentTurn: (currentTurn: string) => {
            set({ currentTurn })
        },
        setPlayers: (players: PlayerDTO[]) => {
            set({ players })
        },
        setLocalPlayer: (localPlayer: LocalPlayerDTO) => {
            set({ localPlayer })
        },
        setDiscardTop: (discardTop: CardDTO) => {
            set({ discardTop })
        },
        setActiveColor: (activeColor: Color) => {
            set({ activeColor })
        },
        setWinner: (winner: GameWinner) => {
            set({ winner });
        },
        resetGame: () => {
            set({ winner: null });
        }
    }));
