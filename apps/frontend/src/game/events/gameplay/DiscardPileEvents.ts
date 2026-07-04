import { useEffectStore } from "../../../store/effectsStore";
import { useGameStore } from "../../../store/gameStore";
import type { CardSchema, GameRoom, StateCallbacks } from "../types";

export function RegisterDiscardPileEvents(
    room: GameRoom,
    $: StateCallbacks
) {

    const store = useGameStore.getState();
    const effects = useEffectStore.getState();
    $(room.state).listen("topDiscardCard", ((card: CardSchema) => {

        if(!card) return;

        store.setDiscardTop({
            id: card.id,
            color: card.color,
            value: card.value,
        });

        const label =
            `${card.color?.toUpperCase() ?? ""}
                    ${card.value.toUpperCase()}
                    `;

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
                })
        }
    }));
}