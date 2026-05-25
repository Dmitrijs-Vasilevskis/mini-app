import type { CardDTO } from "../../types/game";
import "./style.css"

interface Props {
  card: CardDTO;
  onClick: () => void;
}

export function Card({ card, onClick }: Props) {
  return (
    <button onClick={(e) => {
      e.stopPropagation();
      onClick();
    }} className={`uno-card`} role="article">
        <div className="corner corner-tl">{card.value}</div>
        <div className="corner corner-tr">UNO</div>
        <div className="corner corner-bl"></div>
        <div className="corner corner-br">{card.value}</div>

        <div className="card-hero">
            <div className="color-circle">
                <span className="big-number">{card.value}</span>
                <span className="circle-sub"></span>
            </div>
            <div className="card-footer">
                <span className="card-type">{card.value}</span>
                <span className="color-hint text-black">{card.color}</span>
            </div>
        </div>
    </button>
  );
}
