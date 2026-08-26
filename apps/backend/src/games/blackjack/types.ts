export type BjRoundResultType =
    | "blackjack"
    | "win"
    | "loss"
    | "bust"
    | "push";

export interface BjRoundResult {
    playerId: string;
    result: BjRoundResultType;
    points: number;
}

export type InitialDealTarget =
    | {
        type: "player";
        playerId: string;
    }
    | {
        type: "dealer";
        isFaceDown: boolean;
    };