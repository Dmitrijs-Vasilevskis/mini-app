import { useGameStore } from "../../../store/gameStore";
import type { BaseLocalPlayerDTO, BasePlayerDTO } from "../../../store/types";

export type BasePlayerUpdate = Partial<
    Pick<
        BasePlayerDTO,
        | "name"
        | "score"
        | "isTurn"
        | "isReady"
        | "isConnected"
        | "photoUrl"
        | "avatarId"
    >
>;

export function updatePlayerState(sessionId: string, playerId: string, updates: BasePlayerUpdate) {
    updatePlayer(playerId, updates);

    if (playerId === sessionId) {
        updateLocalPlayer(updates);
    }
}

export function updatePlayerGameState<T>(sessionId: string, playerId: string, updates: Partial<T>) {
    updatePlayerGameData(playerId, updates);

    if (playerId === sessionId) {
        updateLocalPlayerGameData(updates);
    }
}

export function updatePlayer(playerId: string, updates: Partial<BasePlayerDTO>) {
    const { players, setPlayers } = useGameStore.getState();

    setPlayers(
        players.map((player) =>
            player.id === playerId
                ? {
                    ...player,
                    ...updates
                }
                : player
        ));
};

export function updateLocalPlayer(updates: Partial<BaseLocalPlayerDTO>) {
    const { localPlayer, setLocalPlayer } = useGameStore.getState();

    if (!localPlayer) return;

    setLocalPlayer({
        ...localPlayer,
        ...updates
    });
}

export function updatePlayerGameData<T>(playerId: string, updates: Partial<T>) {
    const { players, setPlayers } = useGameStore.getState();

    setPlayers(
        players.map((player) =>
            player.id === playerId
                ? {
                    ...player,
                    gameData: {
                        ...(player.gameData as T),
                        ...updates
                    },
                }
                : player
        ));
}

export function updateLocalPlayerGameData<T>(updates: Partial<T>) {
    const { localPlayer, setLocalPlayer } = useGameStore.getState();

    if (!localPlayer) return;

    setLocalPlayer({
        ...localPlayer,
        gameData: {
            ...(localPlayer.gameData as T),
            ...updates
        },
    });
}

export function isLocalPlayer(playerId: string) {
    return useGameStore
        .getState()
        .localPlayer?.id === playerId;
}