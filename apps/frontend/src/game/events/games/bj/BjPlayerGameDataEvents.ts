import type { BjCard, BjPlayerData } from "@uno/shared";
import type { GameRoom, PlayerSchema, StateCallbacks } from "../../types";
import { updateLocalPlayerGameData, updatePlayerGameState } from "../../helpers/UnoPlayerStore";
import { useGameStore } from "../../../../store/gameStore";
import type { BjLocalPlayerDataDTO, BjPlayerDataDTO } from "../../../../store/slices/bjSlice";
import { mapCardSchema } from "../../mappers/bj/CardMapper";

export function BjPlayerGameDataEvents(
    $: StateCallbacks,
    room: GameRoom
): Array<() => void> {
    const unlisteners: Array<() => void> = [];

    room.state.players.forEach((player: PlayerSchema) => {
        const gameData = player.gameData as BjPlayerData;

        if (!gameData) return;

        unlisteners.push(...registerBjPlayerDataEvents(room, gameData, player, $));
    });

    return unlisteners;
}

function registerBjPlayerDataEvents(
    room: GameRoom,
    gameData: BjPlayerData,
    player: PlayerSchema,
    $: StateCallbacks
): Array<() => void> {

    const unlisteners = [
        $(gameData).listen("blackjackStood", (blackjackStood: boolean) => {
            updatePlayerGameState<BjPlayerDataDTO>(room.sessionId, player.id, { blackjackStood });
        }),

        $(gameData).listen("handValue", (handValue: number) => {
            updatePlayerGameState<BjPlayerDataDTO>(room.sessionId, player.id, { handValue });
        }),
    ];

    if (player.id === room.sessionId) {
        // set local player initial values
        updateLocalPlayerGameData<BjLocalPlayerDataDTO>({
            handValue: gameData.handValue,
            blackjackStood: gameData.blackjackStood,
            hand: gameData.hand.map(mapCardSchema)
        });

        unlisteners.push(...registerBjPlayerHandEvents(gameData, $));
    }

    return unlisteners;
}

function registerBjPlayerHandEvents(
    gameData: BjPlayerData,
    $: StateCallbacks
): Array<() => void> {
    return [
        $(gameData).hand.onAdd((card: BjCard) => {
            const localPlayer = useGameStore.getState().localPlayer;

            if (!localPlayer) return;

            const localGameData = localPlayer.gameData as BjLocalPlayerDataDTO;

            if (localGameData.hand.some(c => c.id === card.id)) {
                return
            }

            updateLocalPlayerGameData<BjLocalPlayerDataDTO>({
                hand: [
                    ...localGameData.hand,
                    mapCardSchema(card),
                ]
            });
        }),

        $(gameData).hand.onRemove((card: BjCard) => {
            const localPlayer = useGameStore.getState().localPlayer;

            if (!localPlayer) return;

            const localGameData = localPlayer.gameData as BjLocalPlayerDataDTO;

            updateLocalPlayerGameData<BjLocalPlayerDataDTO>({
                hand: localGameData.hand.filter((c) => c.id !== card.id),
            });
        })
    ];
}