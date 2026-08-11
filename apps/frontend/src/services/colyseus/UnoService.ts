import { ColyseusService } from "./ColyseusService";

export class UnoService {
    private readonly colyseus: ColyseusService;

    constructor(colyseus: ColyseusService) {
        this.colyseus = colyseus;
    }

    callUno() {
        this.colyseus.send("uno");
    }

    challengeUno() {
        this.colyseus.send("challengeUno");
    }

    playCard(cardId: string, chosenColor?: string) {
        this.colyseus.send("playCard", { cardId, chosenColor });
    }

    drawCard() {
        this.colyseus.send("drawCard");
    }
}