import type { Card, Color, UnoGameState } from "@uno/shared";
import { useGameStore } from "../../../../store/gameStore";
import { useEffectStore } from "../../../../store/effectsStore";
import type { GameDirection } from "../../../../types/game";
import type { CardSchema, StateCallbacks } from "../../types";

export function UnoGameStateEvents(
    $: StateCallbacks,
    gameState: UnoGameState
): Array<() => void> {
    const store = useGameStore.getState();
    const effects = useEffectStore.getState();

    // init state sync
    store.setDirection(gameState.direction as GameDirection);
    store.setActiveColor(gameState.activeColor as Color);
    store.setDiscardTop(gameState.topDiscardCard as Card);

    return [
        $(gameState).listen(
            "direction",
            (direction: GameDirection) => {
                store.setDirection(direction);
            }
        ),

        $(gameState).listen(
            "activeColor",
            (color: Color) => {
                store.setActiveColor(color);
            }
        ),

        $(gameState).listen("unoPendingPlayerId", (currPendingPlayerId: string) => {
            console.log(">>>unoPendingPlayerId", currPendingPlayerId);

            if (!currPendingPlayerId) {
                store.setUnoWindowPlayerId(null);
                return;
            }

            store.setUnoWindowPlayerId(currPendingPlayerId);

            const player = useGameStore.getState().players.find(p => p.id === currPendingPlayerId);

            effects.addEffect({
                text: `${player?.name ?? "Player"} UNO?`,
                color: "#f59e0b",
                emphasis: "special"
            });
        }),

        $(gameState).listen("topDiscardCard", ((card: CardSchema | null) => {
            if (!card) return;

            store.setDiscardTop({
                id: card.id,
                color: card.color,
                value: card.value,
            });

            const label = `${card.color?.toUpperCase() ?? ""}${card.value.toUpperCase()}`;

            switch (card.value) {
                case "skip":
                    effects.addEffect({
                        text: label,
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                case "reverse":
                    effects.addEffect({
                        text: label,
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                case "drawTwo":
                    effects.addEffect({
                        text: "+2",
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                case "wildDrawFour":
                    effects.addEffect({
                        text: "+4",
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break
                case "wild":
                    effects.addEffect({
                        text: "WILD",
                        color: card.color ?? "white",
                        emphasis: "special"
                    });
                    break;
                default:
                    effects.addEffect({
                        text: label,
                        color: card.color ?? "white",
                        emphasis: "normal"
                    });
            }
        })),
    ];
}