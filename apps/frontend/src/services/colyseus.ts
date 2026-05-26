import { Client, Room } from "@colyseus/sdk";
import type { Card } from "@uno/shared";

export class ColyseusService {
  client: Client;
  room: Room | null = null;
  hand: Card[] = [];

  constructor() {
    this.client = new Client(
      import.meta.env.VITE_COLYSEUS_URL ||
      "ws://localhost:2567"
    );
  }

  async createRoom(username: string) {
    this.room = await this.client.create("uno", { name: username });

    console.log(
      "ROOM CREATED",
      this.room.roomId
    );

    if (!this.room) {
      throw new Error("Failed to create room");
    }

    return this.room;
  }

  async joinRoomById(roomId: string, username: string) {
    this.room = await this.client.joinById(
      roomId,
      {
        name: username
      }
    );

    console.log(
      "JOINED ROOM",
      this.room.roomId
    );

    return this.room;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(type: string, payload?: any) {
    this.room?.send(type, payload);
  }

  leave() {
    if (this.room) {
      this.room.leave();
      this.room = null;
    }
  }

  playCard(cardId: string, chosenColor?: string) {
    if (!this.room) return;

    this.room.send('playCard', { cardId, chosenColor });
  }

  drawCard() {
    if (!this.room) return;

    this.room.send('drawCard');
  }
}

export const colyseusService = new ColyseusService();