import type { GameEventModule } from "../uno/UnoEventModule";

export const BjEventModule: GameEventModule = {
    initialize(_room, _$) {
        const unlisteners: Array<() => void> = [];


        return unlisteners;
    }
}