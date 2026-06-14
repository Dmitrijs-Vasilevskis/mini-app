import { Client, Room } from "@colyseus/sdk";
import type { Card } from "@uno/shared";

export class ColyseusService {
  client: Client;
  room: Room | null = null;
  hand: Card[] = [];

  constructor() {
    this.client = new Client(
      import.meta.env.VITE_COLYSEUS_SERVER_URL ||
      "ws://localhost:2567"
    );
  }

  async createRoom(name: string, playerId?: string, telegramId?: string) {
    this.room = await this.client.create("uno",
      {
        name,
        playerId,
        telegramId
      }
    );

    console.log(
      "ROOM CREATED",
      this.room.roomId
    );

    return this.room;
  }

  async joinRoomByCode(
    roomCode: string,
    name: string,
    playerId: string,
    telegramId: string | null
  ) {
    this.room = await this.client.join("uno", {
      roomCode,
      name,
      playerId,
      telegramId,
    });

    console.log(
      "JOINED ROOM",
      this.room.roomId
    );

    return this.room;
  }

  async reconnect(roomId: string, sessionId: string) {
    this.room = await this.client.reconnect(roomId, sessionId);

    return this.room;
  }

  send(type: string, payload?: any) {
    this.room?.send(type, payload);
  }

  async leave() {
    if (!this.room) return;

    this.room.leave();
    this.room = null;
  }

  playCard(cardId: string, chosenColor?: string) {
    if (!this.room) return;

    this.room.send('playCard', { cardId, chosenColor });
  }

  drawCard() {
    if (!this.room) return;

    this.room.send('drawCard');
  }

  toggleReady() {
    this.room?.send('toggleReady');
  }

  startGame() {
    this.room?.send('startGame');
  }

  callUno() {
    this.room?.send('uno');
  }

  challengeUno() {
    this.room?.send('challengeUno');
  }
}

export const colyseusService = new ColyseusService();