import { ArraySchema, Schema, type, view } from "@colyseus/schema";
import { BaseGameState, BasePlayerData } from "../types";

export type BJCardValue = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11"
export type Suit = "clubs" | "diamonds" | "hearts" | "spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "jack" | "queen" | "king" | "ace";

export class BjCard extends Schema {
  @type("string") id: string = "";
  @type("string") value: BJCardValue = "2"
  @type("string") suit: Suit = "clubs";
  @type("string") rank: Rank = "2"
  @type("boolean") isFaceDown?: boolean = false;
}

export class BjDealerPublicCard extends Schema {
  @type("string") id: string = "";
  @type("string") value: BJCardValue | "" = ""
  @type("string") suit: Suit | "" = "";
  @type("string") rank: Rank | "" = ""
  @type("boolean") isFaceDown: boolean = false;
}

export class BjPlayerData extends BasePlayerData {
  @view() @type([BjCard]) hand = new ArraySchema<BjCard>();
  @type("boolean") blackjackStood: boolean = false;
  @type("int8") handValue: number = 0;
}

export class BlackjackDealer extends Schema {
  @type([BjDealerPublicCard]) hand = new ArraySchema<BjDealerPublicCard>();
  @type("int8") handValue: number = 0;
}

export class BjGameState extends BaseGameState {
  @type(BlackjackDealer) bjDealer = new BlackjackDealer();
  @type("int8") cardsRemaining: number = 0;
}