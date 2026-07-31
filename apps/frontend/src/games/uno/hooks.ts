import { useGameStore } from "../../store/gameStore";
import type { UnoLocalPlayerDTO, UnoPlayerDTO } from "../../store/slices/unoSlice";

export const useUnoPlayers = () =>
    useGameStore(state => state.players as UnoPlayerDTO[]);

export const useUnoLocalPlayer = () =>
    useGameStore(state => state.localPlayer as UnoLocalPlayerDTO | null);

export const useUnoGameState = () =>
    useGameStore(state => ({
        direction: state.direction,
        activeColor: state.activeColor,
        discardTop: state.discardTop,
        unoWindowPlayerId: state.unoWindowPlayerId,
    }));