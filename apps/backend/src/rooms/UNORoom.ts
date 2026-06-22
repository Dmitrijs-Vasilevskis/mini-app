import { Room, Client, CloseCode } from '@colyseus/core';
import { GameState, Card, Player, Color, RoomStatus, UnoRoomOptions } from '@uno/shared';
import { ArraySchema } from '@colyseus/schema';
import { generateRoomCode } from '../utils/roomCode';
import { DeckManager } from '../game/DeckManager';
import { TurnManager } from '../game/TurnManager';
import { GameEngine } from '../game/GameEngine';
import { TelegramAuthUser, validateTelegramInitData } from '../auth/telegram';

export class UNORoom extends Room<UnoRoomOptions> {
  private deckManager!: DeckManager;
  private turnManager!: TurnManager;
  private gameEngine!: GameEngine;

  onCreate(options: any) {
    this.state = new GameState();

    this.initializeState();

    this.deckManager = new DeckManager(this.state as GameState);
    this.turnManager = new TurnManager(this.state as GameState);
    this.gameEngine = new GameEngine(this,
      this.state as GameState,
      this.deckManager,
      this.turnManager
    );

    const roomCode = generateRoomCode();

    this.state.roomCode = roomCode;
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
      const player = this.state.players.get(client.sessionId);
      if (!player) {
        return;
      }
      player.isReady = !player.isReady;
    });
  }

  async onAuth(client: Client, options: { initData: string },) {
    console.log(">>>onAuth initData:", options.initData);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.error("Environment variable TELEGRAM_BOT_TOKEN is missing");

      return false;
    }

    if (!options.initData) {
      return false;
    }

    const tgUser = validateTelegramInitData(options.initData, botToken);

    if (!tgUser) {
      console.error(`[AUTH FAILED]: Client ${client.sessionId} - Invalid authentification raw data`);
      return false;
    }

    return tgUser;
  }

  private startGame(playerId?: string) {

    if (playerId !== this.state.hostId) {
      return;
    }

    if (this.state.players.size < 1) {
      this.broadcast('error', { message: 'At least 2 players required to start the game.' });
      return;
    }

    if (this.state.status !== RoomStatus.LOBBY) {
      return;
    }

    this.gameEngine.startGame();

    this.broadcast("gameStarted");
  }

  async onLeave(client: Client, code?: number) {
    const player = this.state.players.get(client.sessionId);

    if (!player) {
      return;
    }

    console.log("[PLAYER LEFT]", client.sessionId, "closeCode:", code);

    // leave room action
    if (code === CloseCode.CONSENTED) {
      this.removePlayer(client.sessionId);

      return;
    }

    player.isConnected = false;
    player.disconnectedAt = Date.now();

    try {
      await this.allowReconnection(client, 60);

      player.isConnected = true;
      player.disconnectedAt = 0;

      this.broadcast("playerReconnected", {
        playerName: player.name,
      });
    } catch {
      const wasPausedPlayer =
        this.state.pausedPlayerId === player.id;

      this.removePlayer(player.id);

      if (wasPausedPlayer) {
        this.state.isPaused = false;
        this.state.pausedPlayerId = "";

        this.turnManager.nextTurn();

        this.broadcast("gameResumed");

        this.broadcast("turnChanged", {
          playerId: this.state.currentTurn,
        });
      }
    }
  }

  onJoin(client: Client, options: { roomCode: string }) {
    const user = client.auth as TelegramAuthUser;
    const telegramId = String(user.id);
    const displayName = user.username || user.first_name || "Player";
    const photoUrl = user.photo_url || "";
    const existingPlayer = this.findExistingPlayer(telegramId);

    if (existingPlayer) {
      const oldSessionId = existingPlayer.id;
      const newSessionId = client.sessionId;

      this.state.players.delete(oldSessionId);

      existingPlayer.id = newSessionId;
      existingPlayer.connectionId = newSessionId;
      existingPlayer.isConnected = true;
      existingPlayer.disconnectedAt = 0;

      this.state.players.set(newSessionId, existingPlayer);

      if (this.state.hostId === oldSessionId) {
        this.state.hostId = newSessionId;
      }

      if (this.state.currentTurn === oldSessionId) {
        this.state.currentTurn = newSessionId;
      }

      if (this.state.pausedPlayerId === oldSessionId) {
        this.state.pausedPlayerId = newSessionId;
      }

      if (this.state.unoPendingPlayerId === oldSessionId) {
        this.state.unoPendingPlayerId = newSessionId;
      }

      if (this.state.roundWinnerId === oldSessionId) {
        this.state.roundWinnerId = newSessionId;
      }

      if (this.state.matchWinnerId === oldSessionId) {
        this.state.matchWinnerId = newSessionId;
      }

      const playerIndex =
        this.state.playerOrder.indexOf(oldSessionId);

      if (playerIndex !== -1) {
        this.state.playerOrder[playerIndex] = newSessionId;
      }

      this.broadcast("playerReconnected", {
        playerName: existingPlayer.name,
      });

      return;
    }

    const newPlayer = new Player();

    newPlayer.id = client.sessionId;
    newPlayer.connectionId = client.sessionId;
    newPlayer.telegramId = telegramId;
    newPlayer.playerId = telegramId;

    newPlayer.name = displayName;
    newPlayer.photoUrl = photoUrl;
    newPlayer.isTurn = false;
    newPlayer.hand = new ArraySchema<Card>();

    this.state.players.set(client.sessionId, newPlayer);
    this.state.playerOrder.push(client.sessionId);

    if (!this.state.hostId) {
      this.state.hostId = client.sessionId;
    }

    this.broadcast('playerJoined',
      {
        id: client.sessionId,
        name: displayName
      }
    );
  }

  private removePlayer(playerId: string) {
    const playerIndex = this.state.playerOrder.indexOf(playerId);

    if (playerIndex !== -1) {
      this.state.playerOrder.splice(playerIndex, 1);
    }

    this.state.players.delete(playerId);

    if (this.state.currentTurn === playerId) {
      this.state.currentTurn = "";
    }

    if (this.state.hostId === playerId) {
      this.state.hostId = this.state.playerOrder[0] ?? "";
    }

    this.broadcast("playerLeft", {
      playerId,
    });

    if (this.state.players.size === 0) {
      this.disconnect();
    }
  }

  private initializeState() {
    this.state.deck.clear();
    this.state.discardPile.clear();

    this.state.status = RoomStatus.LOBBY;

    this.state.currentTurn = '';
    this.state.direction = 1;

    this.state.roundWinnerId = '';
    this.state.matchWinnerId = '';
    this.state.gameEnded = false;

    this.state.isPaused = false;
    this.state.pausedPlayerId = '';

    this.state.unoPendingPlayerId = '';
  }

  private findExistingPlayer(telegramId: string): Player | undefined {
    return Array.from(this.state.players.values()).find(p => p.telegramId === telegramId);
  }
}