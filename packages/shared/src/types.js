"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.Player = exports.Card = void 0;
const schema_1 = require("@colyseus/schema");
class Card extends schema_1.Schema {
    id = "";
    color = null;
    value = "0";
}
exports.Card = Card;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], Card.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", Object)
], Card.prototype, "color", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], Card.prototype, "value", void 0);
class Player extends schema_1.Schema {
    id = "";
    name = "";
    hand = new schema_1.ArraySchema();
    isTurn = false;
    telegramId; // optional
}
exports.Player = Player;
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], Player.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], Player.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)([Card]),
    __metadata("design:type", Object)
], Player.prototype, "hand", void 0);
__decorate([
    (0, schema_1.type)("boolean"),
    __metadata("design:type", Boolean)
], Player.prototype, "isTurn", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], Player.prototype, "telegramId", void 0);
class GameState extends schema_1.Schema {
    players = new schema_1.MapSchema();
    deck = new schema_1.ArraySchema();
    discardPile = new schema_1.ArraySchema();
    currentTurn = "";
    direction = 1;
    winnerId = "";
}
exports.GameState = GameState;
__decorate([
    (0, schema_1.type)({ map: Player }),
    __metadata("design:type", Object)
], GameState.prototype, "players", void 0);
__decorate([
    (0, schema_1.type)([Card]),
    __metadata("design:type", Object)
], GameState.prototype, "deck", void 0);
__decorate([
    (0, schema_1.type)([Card]),
    __metadata("design:type", Object)
], GameState.prototype, "discardPile", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], GameState.prototype, "currentTurn", void 0);
__decorate([
    (0, schema_1.type)("int8"),
    __metadata("design:type", Number)
], GameState.prototype, "direction", void 0);
__decorate([
    (0, schema_1.type)("string"),
    __metadata("design:type", String)
], GameState.prototype, "winnerId", void 0);
