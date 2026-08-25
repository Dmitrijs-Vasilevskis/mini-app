import type { Suit, Rank } from "@uno/shared";
import type { BjCardDTO, BjDealerCardDTO } from "../../../../store/slices/bjSlice";

interface Props {
  card: BjCardDTO | BjDealerCardDTO;
  onClick?: () => void;
  className?: string;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const RANK_LABELS: Record<Rank, string> = {
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  "jack": "J",
  "queen": "Q",
  "king": "K",
  "ace": "A",
};

export function ClassicCard({ card, onClick, className = "" }: Props) {
  const { suit, rank, isFaceDown } = card;

  // Face-down back side
  if (isFaceDown) {
    return (
      <button
        onClick={onClick}
        disabled={!onClick}
        className={`relative w-24 h-36 rounded-xl bg-linear-to-br from-indigo-700 via-purple-800 to-indigo-950 border-2 border-white/20 p-2 shadow-xl select-none flex items-center justify-center overflow-hidden ${
          onClick ? "cursor-pointer active:scale-95 transition-transform" : ""
        } ${className}`}
      >
        {/* Pattern Backing */}
        <div className="w-full h-full rounded-lg border border-white/10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[8px_8px] opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-xs flex items-center justify-center text-lg">
            🎴
          </div>
        </div>
      </button>
    );
  }

  const isRed = suit === "hearts" || suit === "diamonds";
  const suitSymbol = suit ? SUIT_SYMBOLS[suit] : "♠";
  const rankLabel = rank ? RANK_LABELS[rank] : rank;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`relative w-24 h-36 bg-white rounded-xl border border-gray-300 p-1.5 shadow-xl select-none flex flex-col justify-between overflow-hidden ${
        isRed ? "text-red-600" : "text-gray-900"
      } ${
        onClick ? "cursor-pointer active:scale-95 transition-transform" : ""
      } ${className}`}
    >
      {/* Top-Left Corner Index */}
      <div className="flex flex-col items-center leading-none self-start">
        <span className="text-sm font-black tracking-tighter">{rankLabel}</span>
        <span className="text-xs">{suitSymbol}</span>
      </div>

      {/* Center Hero Graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {["jack", "queen", "king"].includes(rank) ? (
          <div className="text-3xl font-black opacity-80 uppercase tracking-widest">
            {rankLabel}
          </div>
        ) : (
          <div className="text-4xl leading-none">{suitSymbol}</div>
        )}
      </div>

      {/* Bottom-Right Corner Index (Rotated) */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="text-sm font-black tracking-tighter">{rankLabel}</span>
        <span className="text-xs">{suitSymbol}</span>
      </div>
    </button>
  );
}