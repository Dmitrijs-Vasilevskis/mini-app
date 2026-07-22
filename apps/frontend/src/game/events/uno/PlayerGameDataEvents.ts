import type { UnoPlayerData } from "@uno/shared";
import { useGameStore } from "../../../store/gameStore";
import type { PlayerDTO } from "../../../types/game";
import type { CardSchema, GameRoom, PlayerSchema, StateCallbacks } from "../types";

export function UnoPlayerGameDataEvents(
    $: StateCallbacks,
    room: GameRoom,
): Array<() => void> {
    const unlisteners: Array<() => void> = [];

    room.state.players.forEach((player: PlayerSchema) => {
        const unoData = player.gameData as UnoPlayerData;
        if (!unoData) return;

        const playerUnlisteners = setupSinglePlayerEvents($, room, player, unoData);
        unlisteners.push(...playerUnlisteners);
    });

    return unlisteners;
}

function setupSinglePlayerEvents(
    $: StateCallbacks,
    room: GameRoom,
    player: PlayerSchema,
    unoData: UnoPlayerData
): Array<() => void> {
    const { setPlayers, setLocalPlayer } = useGameStore.getState();
    const isLocal = player.id === room.sessionId;
    const unlisteners: Array<() => void> = [];

    const updatePlayer = (updates: Partial<PlayerDTO>) => {
        const { players } = useGameStore.getState();
        setPlayers(
            players.map((p) => (p.id === player.id ? { ...p, ...updates } : p))
        );
    };

    updatePlayer({
        handCount: unoData.handCount || 0,
        saidUno: unoData.saidUno || false,
    });

    unlisteners.push(
        $(unoData).listen("handCount", (count: number) => {
            updatePlayer({ handCount: count });
        })
    );

    unlisteners.push(
        $(unoData).listen("saidUno", (saidUno: boolean) => {
            updatePlayer({ saidUno });

            if (isLocal) {
                const local = useGameStore.getState().localPlayer;
                if (local) setLocalPlayer({ ...local, saidUno });
            }
        })
    );

    if (isLocal && unoData.hand) {
        // initial state sync
        const initialHand = unoData.hand.map(mapCardSchema);
        const local = useGameStore.getState().localPlayer;
        if (local) {
            setLocalPlayer({
                ...local,
                hand: initialHand,
                handCount: unoData.handCount,
            });
        }

        const addCardListener = $(unoData).hand.onAdd((card: CardSchema) => {
            const curr = useGameStore.getState().localPlayer;
            if (!curr || curr.hand.some((c) => c.id === card.id)) return;

            setLocalPlayer({
                ...curr,
                hand: [...curr.hand, mapCardSchema(card)],
                handCount: unoData.handCount,
            });
        });

        const removeCardListener = $(unoData).hand.onRemove((card: CardSchema) => {
            const curr = useGameStore.getState().localPlayer;
            if (!curr) return;

            setLocalPlayer({
                ...curr,
                hand: curr.hand.filter((c) => c.id !== card.id),
                handCount: unoData.handCount,
            });
        });

        unlisteners.push(addCardListener, removeCardListener);
    }

    return unlisteners;
}

function mapCardSchema(card: CardSchema) {
    return {
        id: card.id,
        color: card.color,
        value: card.value,
    };
}