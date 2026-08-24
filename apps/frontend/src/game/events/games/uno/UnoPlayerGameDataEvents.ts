import type { UnoPlayerData } from "@uno/shared";
import type { CardSchema, GameRoom, PlayerSchema, StateCallbacks } from "../../types";
import { updateLocalPlayerGameData, updatePlayerGameState } from "../../helpers/UnoPlayerStore";
import type { UnoLocalPlayerDataDTO, UnoPlayerDataDTO } from "../../../../store/slices/unoSlice";
import { useGameStore } from "../../../../store/gameStore";
import { mapCardSchema } from "../../mappers/uno/CardMapper";

export function UnoPlayerGameDataEvents(
    $: StateCallbacks,
    room: GameRoom
): Array<() => void> {
    const unlisteners: Array<() => void> = [];

    room.state.players.forEach((player: PlayerSchema) => {
        const gameData = player.gameData as UnoPlayerData;

        if (!gameData) return;

        unlisteners.push(...registerUnoPlayerDataEvents(room, gameData, player, $));
    });

    return unlisteners;
}

function registerUnoPlayerDataEvents(
    room: GameRoom,
    gameData: UnoPlayerData,
    player: PlayerSchema,
    $: StateCallbacks
) {
    // set initial values
    updatePlayerGameState(room.sessionId, player.id, {
        handCount: gameData.handCount,
        saidUno: gameData.saidUno
    });

    const unlisteners = [
        $(gameData).listen("handCount", (handCount: number) => {
            updatePlayerGameState<UnoPlayerDataDTO>(room.sessionId, player.id, { handCount });
        }),

        $(gameData).listen("saidUno", (saidUno: boolean) => {
            updatePlayerGameState<UnoPlayerDataDTO>(room.sessionId, player.id, { saidUno });
        }),
    ];

    if (player.id === room.sessionId) {
        // set local player initial values
        updateLocalPlayerGameData<UnoLocalPlayerDataDTO>({
            handCount: gameData.handCount,
            saidUno: gameData.saidUno,
            hand: gameData.hand.map(mapCardSchema)
        });

        unlisteners.push(...registerUnoPlayerHandEvents(gameData, $));
    }

    return unlisteners;
}

function registerUnoPlayerHandEvents(
    gameData: UnoPlayerData,
    $: StateCallbacks
): Array<() => void> {
    const addCardListener = $(gameData).hand.onAdd((card: CardSchema) => {
        const localPlayer = useGameStore.getState().localPlayer;

        if (!localPlayer) return;

        const localGameData = localPlayer.gameData as UnoLocalPlayerDataDTO;

        if (localGameData.hand.some(c => c.id === card.id)) {
            return;
        }

        updateLocalPlayerGameData<UnoLocalPlayerDataDTO>({
            hand: [
                ...localGameData.hand,
                mapCardSchema(card),
            ],
        })
    });

    const removeCardListener = $(gameData).hand.onRemove((card: CardSchema) => {
        const localPlayer = useGameStore.getState().localPlayer;

        if (!localPlayer) return;

        const localGameData = localPlayer.gameData as UnoLocalPlayerDataDTO;


        updateLocalPlayerGameData<UnoLocalPlayerDataDTO>({
            hand: localGameData.hand.filter((c) => c.id !== card.id),
        });
    });

    return [
        addCardListener,
        removeCardListener
    ];
}