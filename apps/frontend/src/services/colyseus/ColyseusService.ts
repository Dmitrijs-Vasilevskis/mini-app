import { Client, type Room } from "@colyseus/sdk";

const STORAGE_SESSION_KEY = "uno_player_session";

export class ColyseusService {
    readonly client: Client;
    room: Room | null = null;

    constructor() {
        this.client = new Client(
            import.meta.env.VITE_COLYSEUS_SERVER_URL ||
            "ws://localhost:2567"
        );
    }

    async createRoom(initData: string) {
        this.room = await this.client.create("game", {
            initData
        });

        this.persistSession();

        return this.room;
    }

    async joinRoomByCode(
        roomCode: string,
        initData: string
    ) {
        this.room = await this.client.join("game", {
            roomCode,
            initData
        });

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

    private persistSession() {
        if (!this.room) return;

        sessionStorage.setItem(STORAGE_SESSION_KEY, this.room.reconnectionToken)
    }
}