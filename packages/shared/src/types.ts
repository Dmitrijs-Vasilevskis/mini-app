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
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type([Card]) hand = new ArraySchema<Card>();
  @type("boolean") isTurn: boolean = false;
  @type("string") telegramId?: string; // optional
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type([Card]) deck = new ArraySchema<Card>();
  @type([Card]) discardPile = new ArraySchema<Card>();
  @type(["string"]) playerOrder = new ArraySchema<string>();
  @type("string") activeColor: Color = "red";
  @type("string") currentTurn: string = "";
  @type("int8") direction: 1 | -1 = 1;
  @type("string") winnerId?: string = "";
  @type("boolean") gameEnded = false;
}