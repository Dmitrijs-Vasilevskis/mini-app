import { Room, Client } from '@colyseus/core';
import { GameState, Card, Player, Color, RoomStatus } from '@uno/shared';
import { ArraySchema } from '@colyseus/schema';
import { generateRoomCode } from '../utils/roomCode';
import { DeckManager } from '../game/DeckManager';
import { TurnManager } from '../game/TurnManager';
import { GameEngine } from '../game/GameEngine';

export class UNORoom extends Room {
  private deckManager!: DeckManager;
  private turnManager!: TurnManager;
  private gameEngine!: GameEngine;

  onCreate(options: any) {
    this.setState(new GameState());
    const state = this.state as GameState;
    this.initializeState();
    this.deckManager = new DeckManager(this.state as GameState);
    this.turnManager = new TurnManager(this.state as GameState);
    this.gameEngine = new GameEngine(this,
      this.state as GameState,
      this.deckManager,
      this.turnManager
    );

    const roomCode = generateRoomCode();

    console.log(">>> roomCode", roomCode);

    state.roomCode = roomCode;
    this.setMetadata({ roomCode });

    this.onMessage('playCard', (client, payload: { cardId: string; chosenColor?: Color }) => {
      console.log(">> playCard payload", payload)
      this.gameEngine.playCard(client.sessionId, payload.cardId, payload.chosenColor);
    });

    this.onMessage('drawCard', (client) => {
      this.gameEngine.drawCard(client.sessionId);
    });

    this.onMessage('uno', (client) => {
      this.gameEngine.callUno(client.sessionId);
    });

    this.onMessage('challengeUno', (client) => {
      this.gameEngine.challengeUno(client.sessionId);
    });

    this.onMessage('startGame', (client) => {
      this.startGame(client.sessionId)
    });

    this.onMessage('toggleReady', (client) => {
      const player = state.players.get(client.sessionId);
      if (!player) {
        return;
      }
      player.isReady = !player.isReady;
    });
  }

  private startGame(playerId?: string) {
    const state = this.state as GameState;

    if (playerId !== state.hostId) {
      return;
    }

    if (state.players.size < 1) {
      this.broadcast('error', { message: 'At least 2 players required to start the game.' });
      return;
    }

    if (state.status !== RoomStatus.LOBBY) {
      return;
    }

    this.gameEngine.startGame();

    this.broadcast("gameStarted");
  }

  async onLeave(client: Client, code?: number) {
    const state = this.state as GameState;

    const player = state.players.get(client.sessionId);

    if (!player) return;

    player.isConnected = false;
    player.disconnectedAt = Date.now();

    try {
      await this.allowReconnection(
        client,
        60
      );

      player.isConnected = true;
      player.disconnectedAt = 0;

      if (state.pausedPlayerId === client.sessionId) {
        state.isPaused = false;
        state.pausedPlayerId = '';

        this.broadcast("gameResumed", {
          playerId: client.sessionId
        });
      }

      this.broadcast("playerReconnected", {
        playerId: client.sessionId
      });
    } catch {
      const wasPausedPlayer = state.pausedPlayerId === client.sessionId;

      this.removePlayer(client.sessionId);

      if (wasPausedPlayer) {
        state.isPaused = false;
        state.pausedPlayerId = '';

        this.turnManager.nextTurn();

        this.broadcast('gameResumed');

        this.broadcast('turnChanged', {
          playerId: state.currentTurn
        });
      }
    }
  }

  onJoin(client: Client, options: { name: string; telegramId?: string }) {
    const state = this.state as GameState;

    if (state.players.has(client.sessionId)) {
      console.warn(`Player ${client.sessionId} already exists`);
      return;
    }

    if (!state.hostId) {
      state.hostId = client.sessionId;
    }

    const newPlayer = new Player();
    newPlayer.id = client.sessionId;
    newPlayer.name = options.name;
    newPlayer.hand = new ArraySchema<Card>();
    newPlayer.isTurn = false;
    if (options.telegramId) newPlayer.telegramId = options.telegramId;

    state.players.set(client.sessionId, newPlayer);
    state.playerOrder.push(client.sessionId);

    this.broadcast('playerJoined', { id: client.sessionId, name: options.name });
  }

  private removePlayer(playerId: string) {
    const state = this.state as GameState;

    const playerIndex = state.playerOrder.indexOf(playerId);

    if (playerIndex !== -1) {
      state.playerOrder.splice(playerIndex, 1);
    }

    state.players.delete(playerId);

    if (state.currentTurn === playerId) {
      state.currentTurn = '';
    }

    if (state.hostId === playerId) {
      state.hostId = state.playerOrder[0] ?? "";
    }

    this.broadcast('playerLeft', {
      playerId
    })
  }

  private initializeState() {
    const state = this.state as GameState;

    state.deck.clear();
    state.discardPile.clear();

    state.status = RoomStatus.LOBBY;

    state.currentTurn = '';
    state.direction = 1;

    state.roundWinnerId = '';
    state.matchWinnerId = '';
    state.gameEnded = false;

    state.isPaused = false;
    state.pausedPlayerId = '';

    state.unoPendingPlayerId = '';
  }
}