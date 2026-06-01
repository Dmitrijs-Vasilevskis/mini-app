import type { CardDTO } from "../../types/game";
import { Skip } from "./icons/Skip";
import "./style.css";
import { Reverse } from "./icons/Reverse";
import { DrawTwo } from "./icons/DrawTwo";
import { Wild } from "./icons/Wild";

interface Props {
  card: CardDTO;
  onClick: () => void;
}

const CARD_COLORS = {
  red: "#e53935",
  yellow: "#fdd835",
  green: "#43a047",
  blue: "#1e88e5",
  wild: "#212121",
};

const CARD_SYMBOLS = {
  skip: Skip,
  reverse: Reverse,
  drawTwo: DrawTwo,
  wild: Wild,
  wildDrawFour: Wild,
};

export function Card({ card, onClick }: Props) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="uno-card"
      role="article"
      style={{
        ["--uno-primary" as string]:
          CARD_COLORS[card.color ?? 'wild'] || CARD_COLORS.wild,
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

function CardFace({ value, size }: { value: string; size: FaceSize }) {
  const Icon = CARD_SYMBOLS[value as keyof typeof CARD_SYMBOLS];

  const className = `card-face card-face-${size}`;

  if (Icon) {
    return (
      <span className={className}>
        <Icon />
      </span>
    );
  }

  return <span className={className}>{value}</span>;
}
