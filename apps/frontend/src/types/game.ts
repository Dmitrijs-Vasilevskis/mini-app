export type Color =
    | 'red'
    | 'green'
    | 'blue'
    | 'yellow';

export type CardValue =
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'skip'
    | 'reverse'
    | 'drawTwo'
    | 'wild'
    | 'wildDrawFour';

export interface CardDTO {
    id: string;
    color: Color | null;
    value: CardValue;
}

export interface PlayerDTO {
    id: string;
    name: string;
    isTurn: boolean;
    handCount: number;
}

export interface LocalPlayerDTO
    extends PlayerDTO {
    hand: CardDTO[];
}

export interface GameWinner {
    id: string;
    name: string;
}

export interface GameStore {
    connected: boolean;
    roomId: string | null;
    currentTurn: string;
    activeColor: Color;
    discardTop: CardDTO | null;
    players: PlayerDTO[];
    localPlayer: LocalPlayerDTO | null;
    winner: GameWinner | null;
    setConnected: (value: boolean) => void;
    setRoomId: (roomId: string) => void;
    setCurrentTurn: (playerId: string) => void;
    setPlayers: (players: PlayerDTO[]) => void;
    setLocalPlayer: (player: LocalPlayerDTO) => void;
    setDiscardTop: (card: CardDTO) => void;
    setActiveColor: (color: Color) => void;
    setWinner: (winner: GameWinner) => void;
    resetGame: () => void;
}
