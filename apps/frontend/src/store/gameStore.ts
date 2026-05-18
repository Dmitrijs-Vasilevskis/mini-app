import { create } from "zustand";
import { Client, Room } from "colyseus.js";
import { Card, Player, type Color } from "@uno/shared";

interface GameStore {
    client: Client | null;
    room: Room | null;
    players: Map<string, Player>;
    currentTurn: string;
    myPlayerId: string | null;
    hand: Card[];
    connect: (url: string, roomId: string, playerName: string, telegramId?: string) => Promise<void>;
    playCard: (cardId: string, chosenColor?: Color) => void;
    drawCard: () => void;
    setHand: (hand: Card[]) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    client: null,
    room: null,
    players: new Map(),
    currentTurn: "",
    myPlayerId: null,
    hand: [],
    connect: async (url, roomId, playerName, telegramId) => {
        const client = new Client(url);

        console.log(">> urld, roomId, playerName, telegramId", url, roomId, playerName, telegramId);
        const room = await client.joinOrCreate(roomId, { name: playerName, telegramId });

        console.log(">> room", room);

        set({ client, room, myPlayerId: room.sessionId });

        room.onStateChange((state) => {
            const playersMap = new Map();
            state.players.forEach((player: Player, id: string) => {
                playersMap.set(id, player);
            });
            set({ players: playersMap, currentTurn: state.currentTurn });

            // Update local hand for this player
            const myPlayer = state.players.get(room.sessionId);
            if (myPlayer) {
                set({ hand: myPlayer.hand });
            }
        });

        room.onMessage("cardPlayed", (message) => {
            console.log("Card played:", message);
        })

        room.onMessage('cardDrawn', (message) => {
            console.log('Card drawn:', message);
        });

        room.onMessage('turnChanged', (message) => {
            console.log('Turn changed:', message);
        });

        room.onMessage('gameEnd', (message) => {
            alert(`Game ended! Winner: ${message.winnerName}`);
        });
    },
    playCard: (cardId, chosenColor) => {
        const { room } = get();
        if (room) {
          room.send('playCard', { cardId, chosenColor });
        }
    },
    drawCard: () => {
        const { room } = get();
    if (room) {
      room.send('drawCard');
    }
    },
    setHand: (hand) => {
        set({ hand });
    }
}))