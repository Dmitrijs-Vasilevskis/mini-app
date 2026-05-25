import type {
    GameStateDTO,
    PlayerDTO,
    CardDTO,
  } from '../types/game';
  
  export function transformGameState(
    state: any
  ): GameStateDTO {
    const players: PlayerDTO[] = [];
  
    state.players.forEach((player: any) => {
      const hand: CardDTO[] = player.hand.map((card: any) => ({
        id: card.id,
        color: card.color,
        value: card.value,
      }));
  
      players.push({
        id: player.id,
        name: player.name,
        hand,
        isTurn: player.isTurn,
        telegramId: player.telegramId,
      });
    });
  
    const discardPile: CardDTO[] =
      state.discardPile.map((card: any) => ({
        id: card.id,
        color: card.color,
        value: card.value,
      }));
  
    return {
      players,
      discardPile,
      currentTurn: state.currentTurn,
      direction: state.direction,
      winnerId: state.winnerId,
    };
  }