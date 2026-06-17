import type { CardDTO } from "../../types/game";
import { Skip } from "./icons/Skip";
import "./style.css";
import { Reverse } from "./icons/Reverse";
import { DrawTwo } from "./icons/DrawTwo";
import { Wild } from "./icons/Wild";
import { WildDrawFour } from "./icons/WildDrawFour";
import type { JSX } from "react";

interface Props {
  card: CardDTO;
  onClick?: () => void;
}

const CARD_COLORS = {
  red: "#e53935",
  yellow: "#fdd835",
  green: "#43a047",
  blue: "#1e88e5",
  wild: "#212121",
};

export function Card({ card }: Props) {
  return (
    <button
      className="uno-card"
      role="article"
      style={{
        ["--uno-primary" as string]:
          CARD_COLORS[card.color ?? "wild"] || CARD_COLORS.wild,
      }}
    >
      <div className="card-watermark">
        <CardFace value={card.value} size="watermark" />
      </div>

      <div className="corner corner-tl">
        <CardFace value={card.value} size="corner" />
      </div>

      <div className="corner corner-br">
        <CardFace value={card.value} size="corner" />
      </div>

      <div className="card-hero">
        <div className="uno-oval">
          <CardFace value={card.value} size="center" />
        </div>
      </div>
    </button>
  );
}

type FaceSize = "corner" | "center" | "watermark";

type CardSymbol = {
  icon: () => JSX.Element;
  label?: string;
};

const CARD_SYMBOLS: Record<string, CardSymbol> = {
  skip: {
    icon: Skip,
  },
  reverse: {
    icon: Reverse,
  },
  drawTwo: {
    icon: DrawTwo,
    label: "+2",
  },
  wild: {
    icon: Wild,
  },
  wildDrawFour: {
    icon: WildDrawFour,
    label: "+4",
  },
};

function CardFace({ value, size }: { value: string; size: FaceSize }) {
  const isSpecialCard = value in CARD_SYMBOLS;
  const specialCard = isSpecialCard
    ? CARD_SYMBOLS[value as keyof typeof CARD_SYMBOLS]
    : undefined;

  const className = `card-face card-face-${size}`;

  if (size === "corner" && specialCard?.label) {
    return <span className={className}>{specialCard.label}</span>;
  }

  if (specialCard) {
    const Icon = specialCard.icon;
    return (
      <span className={className}>
        <Icon />
      </span>
    );
  }

  return <span className={className}>{value}</span>;
}
