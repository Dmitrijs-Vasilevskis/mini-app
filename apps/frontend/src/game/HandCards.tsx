import { AnimatePresence, motion } from "framer-motion";
import { Card } from "../components/card/Card";
import type { CardDTO } from "../types/game";
import { useAnimationStore } from "../store/animationStore";
import { colyseusService } from "../services/colyseus";

type Props = {
  cards: CardDTO[];
  isPlayable: (card: CardDTO) => boolean;
  onWildCard: (card: CardDTO) => void;
  selectedCardId: string | null;
  setSelectedCardId: React.Dispatch<React.SetStateAction<string | null>>;
};

export function HandCards({
  cards,
  isPlayable,
  onWildCard,
  selectedCardId,
  setSelectedCardId,
}: Props) {
  const addFlyingCard = useAnimationStore((s) => s.addFlyingCard);

  const handlePlayCard = (card: CardDTO) => {
    if (!isPlayable(card)) return;

    if (selectedCardId !== card.id) {
      setSelectedCardId(card.id);
      return;
    }

    const isWild = card.value === "wild" || card.value === "wildDrawFour";

    if (isWild) {
      onWildCard(card);
      return;
    }

    addFlyingCard({
      id: crypto.randomUUID(),
      card,
      from: {
        x: window.innerWidth / 2,
        y: window.innerHeight - 180,
      },
      to: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 + 80,
      },
    });

    colyseusService.playCard(card.id);
    setSelectedCardId(null);
  };

  const center = (cards.length - 1) / 2;
  const spacing = Math.max(22, 70 - cards.length * 2.2);
  const cardScale = Math.max(0.72, 1 - cards.length * 0.018);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-80 z-20 pointer-events-none overflow-visible">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => {
          const playable = isPlayable(card);

          const selected = selectedCardId === card.id;
          const offset = index - center;
          const x = offset * spacing;
          const rotate = offset * 5;
          const curve = Math.abs(offset) * 6;

          return (
            <motion.div
              key={card.id}
              initial={{
                opacity: 0,
                y: 200,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                x,
                y: selected ? curve - 90 : curve,
                rotate: selected ? 0 : rotate,
                scale: selected ? cardScale * 1.2 : cardScale,
              }}
              exit={{
                opacity: 0,
                y: -200,
                scale: 0.5,
                rotate: rotate * 2,
              }}
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 28,
                mass: 0.4,
              }}
              whileHover={{
                y: selected ? curve - 90 : curve - 35,
                zIndex: 999,
              }}
              className={`absolute left-1/2 bottom-0 -translate-x-1/2 origin-bottom pointer-events-auto transition-all
                ${
                  selected
                    ? `drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]`
                    : playable
                      ? `drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]`
                      : `opacity-40 grayscale`
                }
              `}
              style={{
                zIndex: selected ? 999 : index,
              }}
            >
              <Card card={card} onClick={() => handlePlayCard(card)} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
