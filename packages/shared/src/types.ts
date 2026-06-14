import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type Value =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'drawTwo' | 'wild' | 'wildDrawFour';

export class Card extends Schema {
  @type("string") id: string = "";
  @type("string") color: Color | null = null;
  @type("string") value: Value = "0";
}

export class Player extends Schema {
  @type("string") id: string = ""; // sessionId
  @type("string") connectionId: string = "";
  @type("string") name: string = "";
  @type("number") score: number = 0;
  @type("boolean") isConnected: boolean = true;
  @type("number") disconnectedAt: number = 0;
  @type("boolean") isReady: boolean = false;
  @type([Card]) hand = new ArraySchema<Card>();
  @type("boolean") isTurn: boolean = false;
  @type("boolean") saidUno: boolean = false;
  @type("string") telegramId?: string; // optional telegram webapp user identificator
  @type("string") playerId?: string; // web page local storage uuid
}

export class GameState extends Schema {
  @type("string") hostId: string = "";
  @type("string") roomCode: string = "";
  @type("string") status: RoomStatus = RoomStatus.LOBBY;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Card]) deck = new ArraySchema<Card>();
  @type([Card]) discardPile = new ArraySchema<Card>();
  @type(["string"]) playerOrder = new ArraySchema<string>();
  @type("string") activeColor: Color = "red";
  @type("string") currentTurn: string = "";
  @type("int8") direction: 1 | -1 = 1;
  @type("string") roundWinnerId?: string = "";
  @type("string") matchWinnerId?: string = "";
  @type("boolean") gameEnded: boolean = false;
  @type("boolean") isPaused: boolean = false;
  @type("string") pausedPlayerId: string = "";
  @type("string") unoPendingPlayerId: string = "";
}

export interface UnoRoomOptions {
  state: GameState;
}

export enum RoomStatus {
  LOBBY = "lobby",
  PLAYING = "playing",
  FINISHED = "finished"
}