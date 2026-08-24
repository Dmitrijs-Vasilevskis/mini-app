import { BjCard } from "@uno/shared";

export class BlackjackDealerRuntime {
    hand: BjCard[] = [];
    handValue: number = 0;

    clear() {
        this.hand.length = 0;
        this.handValue = 0;
    }
  }