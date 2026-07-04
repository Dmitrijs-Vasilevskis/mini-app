import { Card, Color } from "@uno/shared";

export class CardValidator {
    static canPlay(
        card: Card,
        topCard: Card | null,
        activeColor: Color
    ): boolean {
        // wild cards, can be played in any time
        if (card.color === null) {
            return true;
        }

        if (card.color === activeColor) {
            return true;
        }

        if (card.value === topCard?.value) {
            return true;
        }

        return false;
    }
}