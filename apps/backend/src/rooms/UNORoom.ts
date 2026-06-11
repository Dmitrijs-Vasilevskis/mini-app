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

    state.roomCode = roomCode;
    this.setMetadata({ roomCode });

    this.onMessage('playCard', (client, payload: { cardId: string; chosenColor?: Color }) => {
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

  async onLeave(client: Client) {
    const state = this.state as GameState;

    const player = state.players.get(client.sessionId);

    if (!player) {
      return;
    }

    player.isConnected = false;
    player.disconnectedAt = Date.now();

    try {
      await this.allowReconnection(client, 60);

      player.isConnected = true;
      player.disconnectedAt = 0;

      this.broadcast("playerReconnected", {
        playerId: player.id,
      });
    } catch {
      const wasPausedPlayer =
        state.pausedPlayerId === player.id;

      this.removePlayer(player.id);

      if (wasPausedPlayer) {
        state.isPaused = false;
        state.pausedPlayerId = "";

        this.turnManager.nextTurn();

        this.broadcast("gameResumed");

        this.broadcast("turnChanged", {
          playerId: state.currentTurn,
        });
      }
    }
  }

  onJoin(client: Client, options: { name: string; playerId: string; telegramId?: string }) {
    const state = this.state as GameState;

    const existingPlayer = this.findExistingPlayer(options.playerId, options.telegramId);

    console.log(">> options", options);

    console.log(">> existing", existingPlayer);

    console.log(">> client.sessionId", client.sessionId);

    if (existingPlayer) {
      const oldSessionId = existingPlayer.id;
      const newSessionId = client.sessionId;

      state.players.delete(oldSessionId);

      existingPlayer.id = newSessionId;
      existingPlayer.connectionId = newSessionId;
      existingPlayer.isConnected = true;
      existingPlayer.disconnectedAt = 0;

      state.players.set(newSessionId, existingPlayer);

      if (state.hostId === oldSessionId) {
        state.hostId = newSessionId;
      }

      if (state.currentTurn === oldSessionId) {
        state.currentTurn = newSessionId;
      }

      if (state.pausedPlayerId === oldSessionId) {
        state.pausedPlayerId = newSessionId;
      }

      if (state.unoPendingPlayerId === oldSessionId) {
        state.unoPendingPlayerId = newSessionId;
      }

      if (state.roundWinnerId === oldSessionId) {
        state.roundWinnerId = newSessionId;
      }

      if (state.matchWinnerId === oldSessionId) {
        state.matchWinnerId = newSessionId;
      }

      const playerIndex =
        state.playerOrder.indexOf(oldSessionId);

      if (playerIndex !== -1) {
        state.playerOrder[playerIndex] = newSessionId;
      }

      this.broadcast("playerReconnected", {
        playerId: newSessionId,
      });

      return;
    }

    const newPlayer = new Player();

    newPlayer.id = client.sessionId;
    newPlayer.connectionId = client.sessionId;
    newPlayer.telegramId = options.telegramId ?? "";
    newPlayer.playerId = options.playerId ?? "";

    newPlayer.name = options.name;
    newPlayer.isTurn = false;
    newPlayer.hand = new ArraySchema<Card>();

    state.players.set(client.sessionId, newPlayer);
    state.playerOrder.push(client.sessionId);

    if (!state.hostId) {
      state.hostId = client.sessionId;
    }

    this.broadcast('playerJoined',
      {
        id: client.sessionId,
        name: options.name
      }
    );
  }

  private removePlayer(playerId: string) {
    const state = this.state as GameState;

    const playerIndex = state.playerOrder.indexOf(playerId);

    if (playerIndex !== -1) {
      state.playerOrder.splice(playerIndex, 1);
    }

    state.players.delete(playerId);

    if (state.currentTurn === playerId) {
      state.currentTurn = "";
    }

    if (state.hostId === playerId) {
      state.hostId = state.playerOrder[0] ?? "";
    }

    this.broadcast("playerLeft", {
      playerId,
    });
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

  private findExistingPlayer(playerId?: string, telegramId?: string): Player | undefined {
    const state = this.state as GameState;

    return Array.from(state.players.values()).find(p => {
      if (telegramId) {
        return p.telegramId === telegramId;
      }

      if (playerId) {
        return p.playerId === playerId;
      }

      return false;
    })
  }
}