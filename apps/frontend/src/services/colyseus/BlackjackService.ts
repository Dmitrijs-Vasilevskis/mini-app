import type { ColyseusService } from "./ColyseusService";

export class BlackjackService {
    private readonly colyseus: ColyseusService;

    constructor(colyseus: ColyseusService) {
        this.colyseus = colyseus;
    }

    stand() {
        this.colyseus.send("stand");
    }

    hit() {
        this.colyseus.send("hit");
    }
}