import { AvatarAnimation } from "../avatar/playerAvatar";

export type GameEventType =
    | "player.animation"
    | "player.emote"
    | "game.roundStart"
    | "game.roundEnd"
    | "game.turnChange";

export interface BaseGameEvent {
    type: GameEventType;
    eventId: string;
    timestamp: number;
}

export interface PlayerAnimationEvent extends BaseGameEvent {
    type: "player.animation";
    playerId: string;
    animation: AvatarAnimation;
    actionId?: string;
}

export interface PlayerEmoteEvent extends BaseGameEvent {
    type: "player.emote";
    playerId: string;
    emote: string;
}

export interface RoundStartedEvent extends BaseGameEvent {
    type: "game.roundStart";
    roundNumber: number;
}

export interface RoundEndedEvent extends BaseGameEvent {
    type: "game.roundEnd";
    winnerId: string;
}

export interface TurnChangedEvent extends BaseGameEvent {
    type: "game.turnChange";
    playerId: string;
}

export type GameEventInput = {
    [K in GameEvent["type"]]: Omit<
        Extract<GameEvent, { type: K }>,
        "eventId" | "timestamp"
    >
}[GameEvent["type"]];

export type GameEvent =
    | PlayerAnimationEvent
    | PlayerEmoteEvent
    | RoundStartedEvent
    | RoundEndedEvent
    | TurnChangedEvent;