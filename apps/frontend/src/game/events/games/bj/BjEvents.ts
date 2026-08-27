import { useEffectStore } from "../../../../store/effectsStore";
import { useGameStore } from "../../../../store/gameStore";
import type { GameRoom } from "../../types";

export function BjEvents(
    room: GameRoom
): Array<() => void> {
    const effects = useEffectStore.getState();

    return [
        room.onMessage("playerBust", ({ playerId }: { playerId: string }) => {
            const player = useGameStore.getState().players.find(p => p.id === playerId);

            if (!player) return;

            effects.addEffect({
                text: `${player.name} BUST`,
                color: "#ef4444",
                emphasis: "special"
            });
        }),
        room.onMessage("playerBlackjack", ({ playerId }: { playerId: string }) => {
            const player = useGameStore.getState().players.find(p => p.id === playerId);

            if (!player) return;

            effects.addEffect({
                text: `${player.name} BLACKJACK!`,
                color: "#facc15",
                emphasis: "special"
            });
        }),
        room.onMessage("dealerBust", () => {
            effects.addEffect({
                text: "DEALER BUST!",
                color: "#ef4444",
                emphasis: "normal"
            });
        }),
        room.onMessage("dealerBlackjack", () => {
            effects.addEffect({
                text: "DEALER BLACKJACK",
                color: "#facc15",
                emphasis: "normal"
            });
        })
    ];
}