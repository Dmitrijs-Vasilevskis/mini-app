import { useState } from "react";
import { useGameContext } from "../../providers/game/GameProvider";
import { colyseusService } from "../../services/colyseus";
import { AnimatePresence, motion } from "framer-motion";
import { EMOTES, type Emote } from "@uno/shared";

const ITEMS_PER_PAGE = 3;
const RADIUS = 75;
const PAGINATION_RADIUS = 140;
const MIN_EMOTE_ANGLE = -Math.PI * 0.33;
const MAX_EMOTE_ANGLE = Math.PI * 0.33;
const BUTTON_ANGLE_OFFSET = Math.PI * 0.09;

function getPositionStyles(angleRad: number, r: number = RADIUS) {
  const x = Math.cos(angleRad) * r;
  const y = Math.sin(angleRad) * r;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}

function triggerHaptic(style: "light" | "medium" | "heavy" = "light") {
  (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
}

function getEmoteAngle(index: number, count: number) {
  if (count <= 1) return 0;

  return (
    MIN_EMOTE_ANGLE +
    (index / (count - 1)) * (MAX_EMOTE_ANGLE - MIN_EMOTE_ANGLE)
  );
}

export function EmoteWheel() {
  const { isLandscape } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(EMOTES.length / ITEMS_PER_PAGE);
  const visibleEmotes = EMOTES.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleSelectEmote = (id: string) => {
    colyseusService.sendEmote(id);
    setIsOpen(false);
    triggerHaptic("light");
  };

  const changePage = (delta: number) => {
    triggerHaptic("medium");
    setCurrentPage((p) => (p + delta + totalPages) % totalPages);
  };

  const triggerContainerClasses = isLandscape
    ? "fixed top-1/2 -translate-y-1/2 z-30"
    : "fixed top-1/4 translate-y-1/4 z-30";

  return (
    <div
      className={`${triggerContainerClasses} relative w-12 h-12 overflow-visible`}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0, x: -20, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -36, scale: 0.85 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-purple-600/30 to-transparent border-l-transparent border-r-purple-400/30 flex items-center justify-center text-xl shadow-lg backdrop-blur-sm z-30"
          >
            💬
          </motion.button>
        ) : (
          <EmoteWheelContent
            visibleEmotes={visibleEmotes}
            onSelectEmote={handleSelectEmote}
            onPageChange={changePage}
            onClose={() => setIsOpen(false)}
            totalPages={totalPages}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const EmoteWheelContent = ({
  visibleEmotes,
  onSelectEmote,
  onPageChange,
  onClose,
  totalPages,
}: {
  visibleEmotes: Emote[];
  onSelectEmote: (id: string) => void;
  onPageChange: (delta: number) => void;
  onClose: () => void;
  totalPages: number;
}) => {
  return (
    <motion.div
      className="absolute left-0 top-1/2 -translate-y-1/2"
      initial={{ x: -140, opacity: 0, scale: 0.96 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -140, opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-0 left-1/2 -translate-y-1/2 w-8 h-8 text-white rounded-full flex items-center justify-center text-sm shadow-md active:scale-90 transition-all z-50 hover:bg-purple-600"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <WheelBackground segments={visibleEmotes.length} />

        {totalPages > 1 && (
          <PaginationButton
            direction="prev"
            onClick={() => onPageChange(-1)}
            angle={MIN_EMOTE_ANGLE - BUTTON_ANGLE_OFFSET}
          />
        )}

        {visibleEmotes.map((emote, index) => {
          return (
            <EmoteButton
              key={`${emote.id}`}
              emote={emote}
              angle={getEmoteAngle(index, visibleEmotes.length)}
              onClick={() => onSelectEmote(emote.id)}
            />
          );
        })}

        {totalPages > 1 && (
          <PaginationButton
            direction="next"
            onClick={() => onPageChange(1)}
            angle={MAX_EMOTE_ANGLE + BUTTON_ANGLE_OFFSET}
          />
        )}
      </div>
    </motion.div>
  );
};

const PaginationButton = ({
  direction,
  angle,
  onClick,
}: {
  direction: "prev" | "next";
  angle: number;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      style={getPositionStyles(angle, PAGINATION_RADIUS)}
      className={`absolute w-8 h-8 bg-slate-800/90 border border-white/10 text-white rounded-full flex items-center justify-center text-xs shadow-md active:scale-90 transition-all z-50 hover:bg-purple-600`}
    >
      {direction === "prev" ? "▲" : "▼"}
    </button>
  );
};

const EmoteButton = ({
  emote,
  angle,
  onClick,
}: {
  emote: Emote;
  angle: number;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={getPositionStyles(angle)}
    className="absolute w-12 h-12 rounded-full flex items-center justify-center text-3xl z-50 hover:scale-125 hover:bg-purple-500/20 active:scale-95 transition-all duration-150 animate-in fade-in zoom-in-75"
  >
    <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      {emote.char}
    </span>
  </button>
);

const WheelBackground = ({ segments }: { segments: number }) => {
  return (
    <div className="absolute left-0 w-[106px] h-[212px] bg-slate-900/90 border border-white/10 rounded-r-full shadow-2xl overflow-hidden pointer-events-none animate-in fade-in zoom-in-75 duration-150 origin-left z-40">
      <div className="absolute top-[32%] bottom-[32%] left-0 w-1/2 bg-slate-900 rounded-r-full border border-white/5 border-l-0 z-40" />
      {Array.from({ length: segments }).map((_, index) => {
        if (index === 0) return null;
        const angleDeg = -90 + (index / segments) * 180;

        return (
          <div
            key={`sep-${index}`}
            style={{ transform: `rotate(${angleDeg}deg)` }}
            className="absolute top-1/2 bottom-0 left-0 w-[212px] h-[1px] bg-white/15 origin-top-left z-30"
          />
        );
      })}
    </div>
  );
};
