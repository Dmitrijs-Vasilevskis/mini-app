import { Card, Player, UnoPlayerData } from "@uno/shared";

export class ScodeCalculator {
    static getCardPoints(card: Card): number {
        switch (card.value) {
            case "skip":
            case "reverse":
            case "drawTwo":
                return 20;

            case "wild":
            case "wildDrawFour":
                return 50;

            default:
                return Number(card.value);
        }
    }

    static CalculateRoundPoints(players: Iterable<Player>, winnderId: string): number {
        let total = 0;

        for (const player of players) {
            const unoData = player.gameData as UnoPlayerData;
            
            if (player.id === winnderId) {
                continue;
            }

            for (const card of unoData.hand) {
                total += this.getCardPoints(card);
            }
        }

        return total;
    }
}