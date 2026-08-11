import { Schema, type, MapSchema, ArraySchema, view, entity } from "@colyseus/schema";

// uno card
export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type Value =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'drawTwo' | 'wild' | 'wildDrawFour';

// bj card
export type BJCardValue = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11"
export type Suit = "clubs" | "diamonds" | "hearts" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "jack" | "queen" | "king" | "ace";

export enum GameType {
  UNO = "uno",
  BLACKJACK = "blackjack"
}

export class Card extends Schema {
  @type("string") id: string = "";
  @type("string") color: Color | null = null;
  @type("string") value: Value = "0";
}

export class BjCard extends Schema {
  @type("string") id: string = "";
  @type("string") value: BJCardValue = "2"
  @type("string") suit: Suit = "clubs";
  @type("string") rank: Rank = "2"
  @type("boolean") isFaceDown?: boolean = false;
}

export class BasePlayerData extends Schema {

}

export class UnoPlayerData extends BasePlayerData {
  @view() @type([Card]) hand = new ArraySchema<Card>();
  @type("int8") handCount: number = 0;
  @type("boolean") saidUno: boolean = false;
}

export class BjPlayerData extends BasePlayerData {
  @view() @type([BjCard]) hand = new ArraySchema<BjCard>();
  @type("boolean") blackjackStood: boolean = false;
  @type("int8") handValue: number = 0;
}

export class Player extends Schema {
  @type("string") id: string = "";
  @type("string") connectionId: string = "";
  @type("string") name: string = "";
  @type("string") photoUrl: string = "";
  @type("number") score: number = 0;
  @type("boolean") isConnected: boolean = true;
  @type("number") disconnectedAt: number = 0;
  @type("boolean") isReady: boolean = false;
  @type("boolean") isTurn: boolean = false;
  @type("string") telegramId?: string;
  @type("string") playerId?: string;

  @type(BasePlayerData) gameData: BasePlayerData | null = null;
}

export class BlackjackDealer extends Schema {
  @view() @type([BjCard]) hand = new ArraySchema();
  @type("int8") handValue: number = 0;
}

export class BaseGameState extends Schema {

}

export class UnoGameState extends BaseGameState {
  @type("string") activeColor: Color = "red";
  @type("int8") direction: 1 | -1 = 1;
  @type(Card) topDiscardCard: Card | null = null;
  @type("string") unoPendingPlayerId: string = "";
}

export class BjGameState extends BaseGameState {
  @type(BlackjackDealer) bjDealer = new BlackjackDealer();
  @type("int8") cardsRemaining: number = 0;
}

export class GameState extends Schema {
  @type("string") hostId: string = "";
  @type("string") roomCode: string = "";
  @type("string") status: RoomStatus = RoomStatus.LOBBY;
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("string") gameType: GameType = GameType.UNO;

  @type(["string"]) playerOrder = new ArraySchema<string>();
  @type("string") currentTurn: string = "";
  @type("uint16") roundNumber: number = 1;

  @type("string") roundWinnerId?: string = "";
  @type("string") matchWinnerId?: string = "";
  @type("boolean") gameEnded: boolean = false;

  @type("boolean") isPaused: boolean = false;
  @type("string") pausedPlayerId: string = "";
  @type("uint32") pausedReconnectRemainingMs: number = 0;

  @type(BaseGameState) gameState: BaseGameState | null = null;
}

export interface RoomOptions {
  state: GameState;
}

export enum RoomStatus {
  LOBBY = "lobby",
  PLAYING = "playing",
  FINISHED = "finished"
}