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
    PLAYER_JOINED: "playerJoined",
    PLAYER_LEFT: "playerLeft",

    CARD_DRAWN: "cardDrawn",
    TURN_CHANGED: "turnChanged",

    UNO_AVAILABLE: "unoAvailable",
    UNO_CALLED: "unoCalled",
    UNO_PENALTY: "unoPenalty",
    UNO_WINDOW_CLOSE: "unoWindowClosed",

    ROUND_ENDED: "roundEnded",
    ROUND_STARTED: "roundStarted",

    GAME_END: "gameEnd",
    GAME_START: "gameStarted",
    GAME_PAUSED: "gamePaused",
    GAME_RESUMED: "gameResumed"
} as const;