var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
export class Card extends Schema {
    id = "";
    color = null;
    value = "0";
}
__decorate([
    type("string"),
    __metadata("design:type", String)
], Card.prototype, "id", void 0);
__decorate([
    type("string"),
    __metadata("design:type", Object)
], Card.prototype, "color", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], Card.prototype, "value", void 0);
export class Player extends Schema {
    id = "";
    name = "";
    hand = new ArraySchema();
    isTurn = false;
    telegramId; // optional
}
__decorate([
    type("string"),
    __metadata("design:type", String)
], Player.prototype, "id", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], Player.prototype, "name", void 0);
__decorate([
    type([Card]),
    __metadata("design:type", Object)
], Player.prototype, "hand", void 0);
__decorate([
    type("boolean"),
    __metadata("design:type", Boolean)
], Player.prototype, "isTurn", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], Player.prototype, "telegramId", void 0);
export class GameState extends Schema {
    players = new MapSchema();
    deck = new ArraySchema();
    discardPile = new ArraySchema();
    playerOrder = new ArraySchema();
    activeColor = "red";
    currentTurn = "";
    direction = 1;
    winnerId = "";
    gameEnded = false;
}
__decorate([
    type({ map: Player }),
    __metadata("design:type", Object)
], GameState.prototype, "players", void 0);
__decorate([
    type([Card]),
    __metadata("design:type", Object)
], GameState.prototype, "deck", void 0);
__decorate([
    type([Card]),
    __metadata("design:type", Object)
], GameState.prototype, "discardPile", void 0);
__decorate([
    type(["string"]),
    __metadata("design:type", Object)
], GameState.prototype, "playerOrder", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], GameState.prototype, "activeColor", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], GameState.prototype, "currentTurn", void 0);
__decorate([
    type("int8"),
    __metadata("design:type", Number)
], GameState.prototype, "direction", void 0);
__decorate([
    type("string"),
    __metadata("design:type", String)
], GameState.prototype, "winnerId", void 0);
__decorate([
    type("boolean"),
    __metadata("design:type", Object)
], GameState.prototype, "gameEnded", void 0);
