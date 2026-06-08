import { create } from "zustand";
import { RoomStatus, type Color } from "@uno/shared";

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
        roomCode: null,
        status: null,
        hostId: '',
        currentTurn: '',
        activeColor: 'red',
        discardTop: null,
        players: [],
        localPlayer: null,
        winner: null,
        isPaused: false,
        pausedPlayerId: null,
        reconnectRemaining: null,
        unoWindowPlayerId: null,
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
            set({
                winner: null,
                isPaused: false,
                pausedPlayerId: null,
                reconnectRemaining: null,
                unoWindowPlayerId: null,
            });
        },
        setRoomCode: (roomCode: string) => {
            set({ roomCode });
        },
        setStatus: (status: RoomStatus) => {
            set({ status });
        },
        setHostId: (hostId: string) => {
            set({ hostId });
        },
        setPaused(isPaused: boolean, pausedPlayerId: string, reconnectRemaining: number) {
            set({
                isPaused,
                pausedPlayerId: pausedPlayerId ?? null,
                reconnectRemaining: reconnectRemaining ?? null,
            });
        },
        setUnoWindowPlayerId(playerId) {
            set({
                unoWindowPlayerId: playerId
            });
        },
    }));
