import { useEffectStore } from "../../../store/effectsStore";
import { useGameStore } from "../../../store/gameStore";
import { GameEvents, type GameRoom } from "../types";

interface UnoPenalty {
    offenderId: string;
    challengerId: string;
}

export function RegisterUnoEvents(
    room: GameRoom
) {
    const store = useGameStore.getState();
    const effects = useEffectStore.getState();

    room.onMessage(GameEvents.UNO_CALLED, ({ playerId }: { playerId: string }) => {
        const player = useGameStore.getState().players.find(p => p.id === playerId);

        effects.addEffect({
            text: `${player?.name ?? 'Player'} UNO!`,
            color: "#facc15",
            emphasis: "special"
        });

        store.setUnoWindowPlayerId(null);
    });

    room.onMessage(GameEvents.UNO_PENALTY, (data: UnoPenalty) => {
        const offender = useGameStore.getState()
            .players.find(p => p.id === data.offenderId);

        effects.addEffect({
            text: `${offender?.name ?? "Player"} +2`,
            color: "#ef4444",
            emphasis: "special",
        });

        store.setUnoWindowPlayerId(null);
    });
}