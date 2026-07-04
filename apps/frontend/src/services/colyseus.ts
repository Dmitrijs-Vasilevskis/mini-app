import { Client, Room } from "@colyseus/sdk";
import type { Card } from "@uno/shared";

const STORAGE_SESSION_KEY = "uno_player_session";

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

  async trySessionRecovery(): Promise<Room | null> {
    const cached = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (!cached) return null;

    try {
      this.room = await this.client.reconnect(cached);

      this.persistSession();

      return this.room;
    } catch (error) {
      console.warn("[RECONNECTION FAILED]: Session missing on the server or token expired. Clearing cache.", error);

      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      this.room = null;

      return null;
    }
  }

  async createRoom(initData: string) {
    this.room = await this.client.create("uno",
      { initData }
    );

    console.log("ROOM CREATED", this.room.roomId);
    this.persistSession();

    return this.room;
  }

  async joinRoomByCode(
    roomCode: string,
    initData: string
  ) {
    this.room = await this.client.join("uno", {
      roomCode,
      initData
    });

    console.log("JOINED ROOM", this.room.roomId);
    this.persistSession();

    return this.room;
  }

  async reconnect(roomId: string, sessionId: string) {
    this.room = await this.client.reconnect(roomId, sessionId);
    this.persistSession();
    return this.room;
  }

  send(type: string, payload?: any) {
    this.room?.send(type, payload);
  }

  async leave() {
    if (!this.room) return;

    sessionStorage.removeItem(STORAGE_SESSION_KEY);

    this.room.leave();
    this.room = null;
  }

  playCard(cardId: string, chosenColor?: string) {
    this.room?.send('playCard', { cardId, chosenColor });
  }

  drawCard() {
    this.room?.send('drawCard');
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

  sendEmote(emoteId: string) {
    this.room?.send('sendEmote', { emoteId });
  }

  private persistSession() {
    if (!this.room) return;

    sessionStorage.setItem(STORAGE_SESSION_KEY, this.room.reconnectionToken)
  }
}

export const colyseusService = new ColyseusService();