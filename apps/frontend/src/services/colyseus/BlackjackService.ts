import type { ColyseusService } from "./ColyseusService";

export class BlackjackService {
    private readonly colyseus: ColyseusService;

    constructor(colyseus: ColyseusService) {
        this.colyseus = colyseus;
    }

    stand(actionId: string) {
        this.colyseus.send("stand", { actionId });
    }

    hit(actionId: string) {
        this.colyseus.send("hit", { actionId });
    }
}