import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { Card } from "../../../card/Card";
import type { CardDTO } from "../../../../types/game";
import { useAnimationStore } from "../../../../store/animationStore";
import { unoService } from "../../../../services/colyseus";

type Props = {
  cards: CardDTO[];
  isPlayable: (card: CardDTO) => boolean;
  onWildCard: (card: CardDTO) => void;
  setSelectedCardId: React.Dispatch<React.SetStateAction<string | null>>;
};

export function LandscapeHandCards({
  cards,
  isPlayable,
  onWildCard,
  setSelectedCardId,
}: Props) {
  const addFlyingCard = useAnimationStore((s) => s.addFlyingCard);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef<boolean>(false);
  const previousCardsLength = useRef<number>(cards.length);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const dragX = useMotionValue(0);

  const CARD_WIDTH = 65;
  const CARD_GAP = -25;
  const CENTER_OFFSET = CARD_WIDTH + CARD_GAP;

  useEffect(() => {
    if (!isInitializedRef.current && cards.length > 0) {
      const middleIndex = Math.floor(cards.length / 2);
      setActiveIndex(middleIndex);

      if (cards[middleIndex]) {
        setSelectedCardId(cards[middleIndex].id);
      }

      isInitializedRef.current = true;
      previousCardsLength.current = cards.length;

      return;
    }

    if (cards.length > previousCardsLength.current) {
      const newestIndex = cards.length - 1;
      setActiveIndex(newestIndex);
      if (cards[newestIndex]) {
        setSelectedCardId(cards[newestIndex].id);
      }
    } else if (activeIndex >= cards.length && cards.length > 0) {
      setActiveIndex(cards.length - 1);
    }
    previousCardsLength.current = cards.length;
  }, [cards, activeIndex, setSelectedCardId]);

  const handlePlayCard = (card: CardDTO, index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setSelectedCardId(card.id);
      return;
    }

    if (!isPlayable(card)) return;

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
        y: window.innerHeight - 130,
      },
      to: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    });

    unoService.playCard(card.id);
    setSelectedCardId(null);
  };

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 20;
    const velocityThreshold = 150;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      setActiveIndex((prev) => Math.min(cards.length - 1, prev + 1));
    }

    const newActiveCard = cards[activeIndex];
    if (newActiveCard) {
      setSelectedCardId(newActiveCard.id);
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-8 left-0 right-0 z-30 h-44 w-full overflow-visible pointer-events-none flex items-center justify-center"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
        className="relative w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const distance = index - activeIndex;
            const isCentered = distance === 0;
            const xPosition = distance * CENTER_OFFSET;

            const scale = isCentered
              ? 1.15
              : Math.max(0.75, 1 - Math.abs(distance) * 0.08);
            const rotate = isCentered ? 0 : distance * 12;
            const yOffset = isCentered ? -24 : Math.abs(distance) * 12;
            const zIndex = 100 - Math.abs(distance);

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.3, y: 100 }}
                animate={{
                  x: xPosition,
                  y: yOffset,
                  scale,
                  rotate,
                  zIndex,
                  opacity: 100,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  y: -150,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.6,
                }}
                className={`absolute w-[110px] h-[155px] origin-bottom select-none
                  ${
                    isCentered
                      ? "drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]"
                      : "drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayCard(card, index);
                }}
              >
                <div className={!isCentered ? "pointer-events-none" : ""}>
                  <Card card={card} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
