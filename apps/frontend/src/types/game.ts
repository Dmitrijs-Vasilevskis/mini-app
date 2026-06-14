import type { RoomStatus } from "@uno/shared";

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
    score: number;
    isTurn: boolean;
    handCount: number;
    isReady: boolean;
    isConnected: boolean;
    saidUno: boolean;
}

export interface LocalPlayerDTO
    extends PlayerDTO {
    hand: CardDTO[];
}

export interface GameWinner {
    id: string;
    name: string;
}

export interface RoundResults {
    roundWinnerId: string;
    roundWinnerName: string;
    pointsAwarded: number;
    totalScore: number;
    standings: {
        playerId: string;
        playerName: string;
        score: number;
    }[];
}

export type GameDirection  = 1 | -1;

export interface GameStore {
    connected: boolean;
    roomId: string | null;
    roomCode: string | null;
    status: RoomStatus;
    hostId: string;
    currentTurn: string;
    direction: GameDirection;
    activeColor: Color;
    discardTop: CardDTO | null;
    players: PlayerDTO[];
    localPlayer: LocalPlayerDTO | null;
    winner: GameWinner | null;
    roundResults: RoundResults | null;
    isPaused: boolean;
    pausedPlayerId: string | null;
    reconnectRemaining: number | null;
    unoWindowPlayerId: string | null;
    setConnected: (value: boolean) => void;
    setRoomId: (roomId: string) => void;
    setRoomCode: (roomCode: string) => void;
    setCurrentTurn: (playerId: string) => void;
    setDirection: (direction: number) => void;
    setPlayers: (players: PlayerDTO[]) => void;
    setLocalPlayer: (player: LocalPlayerDTO) => void;
    setDiscardTop: (card: CardDTO) => void;
    setActiveColor: (color: Color) => void;
    setHostId: (hostId: string) => void;
    setStatus: (status: RoomStatus) => void;
    setWinner: (winner: GameWinner) => void;
    resetGame: () => void;
    setPaused: (paused: boolean, pausedPlayerId?: string, reconnectRemaining?: number) => void;
    setUnoWindowPlayerId: (playerId: string | null) => void;
    setRoundResults: (results: RoundResults | null) => void;
    reset: () => void;
}
