import { HitButton } from "../../../components/games/bj/HitButton";
import { StandButton } from "../../../components/games/bj/StandButton";

interface Props {
  onHit: () => void;
  onStand: () => void;
  isPlayerTurn: boolean;
  canHit: boolean;
}

export function ActionButtons({ onHit, onStand, isPlayerTurn, canHit }: Props) {
  return (
    <div className="bottom-6 left-1/2 -translate-x-1/2 gap-4 contents z-50">
      <div
        className="
      landscape:fixed
      left-6
      top-1/2
      -translate-y-1/2
      z-50
    "
      >
        <StandButton onClick={onStand} isAvailable={isPlayerTurn} />
      </div>
      <div
        className="
          fixed
          right-6
          top-1/2
          -translate-y-1/2
          z-50
        "
      >
        <HitButton onClick={onHit} isAvailable={canHit} />
      </div>
    </div>
  );
}
