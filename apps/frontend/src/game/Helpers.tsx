import type { CardValue } from "../types/game";

export interface ButtonPosition {
  left: string;
  bottom: string;
}

export const generateRandomButtonPosition = (): ButtonPosition => {
  const left = 10 + Math.random() * 70;
  const bottom = 5 + Math.random() * 45;

  return {
    left: `${left}%`,
    bottom: `${bottom}%`,
  };
};

export function getCardLabel(value: CardValue): string {
  switch (value) {
    case "skip":
      return "Skip";
    case "reverse":
      return "Reverse";
    case "drawTwo":
      return "+2";
    case "wild":
      return "Wild";
    case "wildDrawFour":
      return "+4";
    default:
      return value;
  }
}
