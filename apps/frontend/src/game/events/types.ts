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