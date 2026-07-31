import type { CardDTO } from "../../../types/game";
import type { CardSchema } from "../types";

export function mapCardSchema(card: CardSchema): CardDTO {
    return {
        id: card.id,
        color: card.color,
        value: card.value,
    };
}