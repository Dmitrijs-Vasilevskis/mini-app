import type { getStateCallbacks, Room } from "@colyseus/sdk";
import type {
    GameState,
    Player,
    Card,
} from "@uno/shared";

export type GameRoom = Room<GameState>;

export type PlayerSchema = Player;

export type CardSchema = Card;

export type StateCallbacks = ReturnType<typeof getStateCallbacks>

export const GameEvents = {
    UNO_CALLED: "unoCalled",
    UNO_PENALTY: "unoPenalty",

    ROUND_ENDED: "roundEnded",
    ROUND_STARTED: "roundStarted",

    GAME_END: "gameEnd",
    GAME_START: "gameStarted",
    GAME_PAUSED: "gamePaused",
    GAME_RESUMED: "gameResumed",

    ERROR: "error",
} as const;