import { Room, Client } from '@colyseus/core';
import { GameState, Card, Player, Color, Value } from '@uno/shared';
import { createDeck, shuffle } from '../game/UNODeck';
import { ArraySchema } from '@colyseus/schema';

export class UNORoom extends Room {
  onCreate(options: any) {
    this.setState(new GameState());

    this.onMessage('playCard', (client, payload: { cardId: string; chosenColor?: Color }) => {
      this.handlePlayCard(client.sessionId, payload.cardId, payload.chosenColor);
    });

    this.onMessage('drawCard', (client) => {
      this.handleDrawCard(client.sessionId);
    });
  }

  onLeave(client: Client, code?: number) {
    const state = this.state as GameState;
    state.players.delete(client.sessionId);
    if (state.currentTurn === client.sessionId) {
      this.nextTurn();
    }
  }

  onJoin(client: Client, options: { name: string; telegramId?: string }) {
    console.log(">> ", client, options);
    const state = this.state as GameState;
    if (state.players.size === 0) {
      this.initGame();
    }

    const newPlayer = new Player();
    newPlayer.id = client.sessionId;
    newPlayer.name = options.name;
    newPlayer.hand = new ArraySchema();
    newPlayer.isTurn = false;
    if (options.telegramId) newPlayer.telegramId = options.telegramId;

    // Deal 7 cards
    for (let i = 0; i < 7; i++) {
      if (state.deck.length === 0) this.reshuffleDiscard();
      const cardData = state.deck.pop();
      if (cardData) {
        const card = new Card();
        card.id = cardData.id;
        card.color = cardData.color;
        card.value = cardData.value;
        newPlayer.hand.push(card);
      }
    }

    state.players.set(client.sessionId, newPlayer);

    if (state.players.size === 1) {
      state.currentTurn = client.sessionId;
      newPlayer.isTurn = true;
    }

    this.broadcast('playerJoined', { id: client.sessionId, name: options.name });
  }

  private initGame() {
    const state = this.state as GameState;
    let deckCards = createDeck();
    let firstCardData = deckCards.pop()!;
    // avoid wild as first card
    while (firstCardData.value === 'wild' || firstCardData.value === 'wildDrawFour') {
      deckCards.push(firstCardData);
      deckCards = shuffle(deckCards);
      firstCardData = deckCards.pop()!;
    }
    // Convert plain objects to Card instances
    const deck = new ArraySchema<Card>();
    for (const c of deckCards) {
      const card = new Card();
      card.id = c.id;
      card.color = c.color;
      card.value = c.value;
      deck.push(card);
    }
    const firstCard = new Card();
    firstCard.id = firstCardData.id;
    firstCard.color = firstCardData.color;
    firstCard.value = firstCardData.value;
    const discardPile = new ArraySchema<Card>();
    discardPile.push(firstCard);

    state.deck = deck;
    state.discardPile = discardPile;
  }

  private handlePlayCard(playerId: string, cardId: string, chosenColor?: Color) {
    const state = this.state as GameState;
    const player = state.players.get(playerId);
    if (!player || !player.isTurn) return;

    const cardIndex = player.hand.findIndex((c: Card) => c.id === cardId);
    if (cardIndex === -1) return;

    const card = player.hand[cardIndex];
    const topCard = state.discardPile[state.discardPile.length - 1];

    if (!this.isValidPlay(card, topCard)) return;

    player.hand.splice(cardIndex, 1);
    state.discardPile.push(card);

    // Special card handling
    if (card.value === 'skip') {
      this.nextTurn();
    } else if (card.value === 'reverse') {
      state.direction = (state.direction === 1 ? -1 : 1) as 1 | -1;
    } else if (card.value === 'drawTwo') {
      const nextPlayerId = this.getNextPlayerId(playerId);
      this.addCardsToPlayer(nextPlayerId, 2);
    } else if (card.value === 'wild' || card.value === 'wildDrawFour') {
      if (chosenColor) {
        this.broadcast('wildColorChosen', { playerId, color: chosenColor });
      }
      if (card.value === 'wildDrawFour') {
        const nextPlayerId = this.getNextPlayerId(playerId);
        this.addCardsToPlayer(nextPlayerId, 4);
      }
    }

    // Win check
    if (player.hand.length === 0) {
      state.winnerId = playerId;
      this.broadcast('gameEnd', { winnerId: playerId, winnerName: player.name });
      this.disconnect();
      return;
    }

    this.nextTurn();
    this.broadcast('cardPlayed', { playerId, card, remainingCards: player.hand.length });
  }

  private handleDrawCard(playerId: string) {
    const state = this.state as GameState;
    const player = state.players.get(playerId);
    if (!player || !player.isTurn) return;

    if (state.deck.length === 0) this.reshuffleDiscard();
    const newCardData = state.deck.pop();
    if (newCardData) {
      const newCard = new Card();
      newCard.id = newCardData.id;
      newCard.color = newCardData.color;
      newCard.value = newCardData.value;
      player.hand.push(newCard);
      this.broadcast('cardDrawn', { playerId, card: newCard });
    }

    this.nextTurn();
  }

  private isValidPlay(card: Card, topCard: Card): boolean {
    if (card.color === null) return true;
    if (card.color === topCard.color) return true;
    if (card.value === topCard.value) return true;
    return false;
  }

  private addCardsToPlayer(playerId: string, count: number) {
    const state = this.state as GameState;
    const player = state.players.get(playerId);
    if (player) {
      for (let i = 0; i < count; i++) {
        if (state.deck.length === 0) this.reshuffleDiscard();
        const cardData = state.deck.pop();
        if (cardData) {
          const card = new Card();
          card.id = cardData.id;
          card.color = cardData.color;
          card.value = cardData.value;
          player.hand.push(card);
        }
      }
      this.broadcast('playerDrewPenalty', { playerId, count });
    }
  }

  private nextTurn() {
    const state = this.state as GameState;
    const players = Array.from(state.players.keys());
    if (players.length === 0) return;
    let currentIdx = players.indexOf(state.currentTurn);
    let nextIdx = currentIdx + state.direction;
    if (nextIdx < 0) nextIdx = players.length - 1;
    if (nextIdx >= players.length) nextIdx = 0;

    const currentPlayer = state.players.get(state.currentTurn);
    if (currentPlayer) currentPlayer.isTurn = false;

    state.currentTurn = players[nextIdx];
    const nextPlayer = state.players.get(state.currentTurn);
    if (nextPlayer) nextPlayer.isTurn = true;

    this.broadcast('turnChanged', { playerId: state.currentTurn });
  }

  private getNextPlayerId(currentId: string): string {
    const state = this.state as GameState;
    const players = Array.from(state.players.keys());
    const idx = players.indexOf(currentId);
    let next = idx + state.direction;
    if (next < 0) next = players.length - 1;
    if (next >= players.length) next = 0;
    return players[next];
  }

  private reshuffleDiscard() {
    const state = this.state as GameState;
    // Remove the top card from discard pile
    const top = state.discardPile.pop()!;
    // Convert remaining discard pile to plain objects for shuffling
    const cardsToShuffle = state.discardPile.map(c => ({
      id: c.id,
      color: c.color,
      value: c.value
    })) as { id: string; color: Color | null; value: Value }[];
    const shuffledDeck = shuffle(cardsToShuffle);
    // Create new deck ArraySchema with shuffled cards
    const newDeck = new ArraySchema<Card>();
    for (const cardData of shuffledDeck) {
      const card = new Card();
      card.id = cardData.id;
      card.color = cardData.color;
      card.value = cardData.value;
      newDeck.push(card);
    }
    state.deck = newDeck;
    // Reset discard pile with the saved top card
    const newDiscard = new ArraySchema<Card>();
    newDiscard.push(top);
    state.discardPile = newDiscard;
  }
}