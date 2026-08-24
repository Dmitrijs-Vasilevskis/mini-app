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