import { BaseGameState, BasePlayerData, BjGameState, BjPlayerData, Color, GameState, GameType, UnoGameState, UnoPlayerData } from "@uno/shared";
import { Room } from "@colyseus/core";
import { UnoGameEngine } from "../games/uno/GameEngine";
import { BlackjackGameEngine } from "../games/blackjack/GameEngine";

export interface GameDefinition {
    createGameState: () => BaseGameState;
    createPlayerData: () => BasePlayerData;
    createEngine: (room: Room, state: GameState) => void;
    setupMessages: (room: Room, engine: any) => void;
    syncView?: (client: any, player: any) => void;
    onSessionIdSwapped?: (state: GameState, oldId: string, newId: string) => void;
}

export const GAME_REGISTRY: Record<GameType, GameDefinition> = {
    uno: {
        createGameState: () => new UnoGameState(),
        createPlayerData: () => new UnoPlayerData(),
        createEngine: (room, state) => {
            const { DeckManager } = require("../games/uno/DeckManager");
            const { TurnManager } = require("../games/uno/TurnManager");

            const deckManager = new DeckManager(state);
            const turnManager = new TurnManager(state);

            return new UnoGameEngine(room, state, deckManager, turnManager)
        },
        setupMessages: (room, engine) => {
            room.onMessage('playCard', (client, payload: { cardId: string; chosenColor?: Color }) => {
                engine.playCard(client.sessionId, payload.cardId, payload.chosenColor);
            });

            room.onMessage('drawCard', (client) => {
                engine.drawCard(client.sessionId);
            });

            room.onMessage('challengeUno', (client) => {
                engine.challengeUno(client.sessionId);
            });

            room.onMessage('uno', (client) => {
                engine.callUno(client.sessionId);
            });
        },
        syncView: (client, player) => {
            const unoData = player.gameData as UnoPlayerData;

            if (unoData && unoData.hand) {
                for (const card of unoData.hand) {
                    client.view.add(card);
                }
            }
        },
        onSessionIdSwapped: (state, oldId, newId) => {
            const unoGameData = state.gameState as UnoGameState;

            if (unoGameData && unoGameData.unoPendingPlayerId === oldId) {
                unoGameData.unoPendingPlayerId = newId;
            }
        }
    },
    blackjack: {
        createGameState: () => new BjGameState(),
        createPlayerData: () => new BjPlayerData(),
        createEngine: (room, state) => {
            const { DeckManager } = require("../games/blackjack/DeckManager");
            const { TurnManager } = require("../games/blackjack/TurnManager");

            const deckManager = new DeckManager(state);
            const turnManager = new TurnManager(state);

            return new BlackjackGameEngine(room, state, deckManager, turnManager);
        },
        setupMessages: (room, engine) => {
            room.onMessage('stand', (client) => {
                engine.handlePlayerStand(client.sessionId);
            });

            room.onMessage('hit', (client) => {
                engine.handlePlayerHit(client.sessionId);
            });
        },
        syncView: (client, player) => {
            const bjData = player.gameData as BjPlayerData;

            if (bjData && bjData.hand) {
                for (const card of bjData.hand) {
                    client.view.add(card);
                }
            }
        }
    }
}