import { useState } from "react";
import { useGameContext } from "../../providers/game/GameProvider";
import { colyseusService } from "../../services/colyseus";

const ALL_EMOTES = [
  { id: "laugh", char: "😂" },
  { id: "angry", char: "😡" },
  { id: "wow", char: "😮" },
  { id: "cry", char: "😢" },
  { id: "flex", char: "💪" },
  { id: "gg", char: "🤝" },
  { id: "heart", char: "❤️" },
  { id: "fire", char: "🔥" },
  { id: "mindblown", char: "🤯" },
];

const ITEMS_PER_PAGE = 3;

export function EmoteWheel() {
  const { isLandscape } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(ALL_EMOTES.length / ITEMS_PER_PAGE);
  
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleEmotes = ALL_EMOTES.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSelectEmote = (id: string) => {
    colyseusService.sendEmote(id);
    setIsOpen(false);
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred("light");
  };

  const handlePageChange = (direction: "next" | "prev", e: React.MouseEvent) => {
    e.stopPropagation();
    (window as any).Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
    
    if (direction === "next") {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    } else {
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }
  };

  const triggerContainerClasses = isLandscape
    ? "fixed left-6 top-1/2 -translate-y-1/2 z-50"
    : "fixed bottom-1/3 left-6 z-50 translate-y-1/4";

  return (
    <div className={triggerContainerClasses}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-purple-600 border border-purple-400/40 rounded-full flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform backdrop-blur-sm z-30 relative"
      >
        💬
      </button>

      {/* Emote Wheel */}
      {isOpen && (
        <div className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center">
          {/* Click-away panel */}
          <div
            className="fixed inset-0 backdrop-blur-[0.5px] z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Wheel */}
          <div className="absolute left-[-6px] w-[106px] h-[212px] bg-slate-900/90 border border-white/10 rounded-r-full shadow-2xl overflow-hidden pointer-events-none animate-in fade-in zoom-in-75 duration-150 origin-left z-20">
            <div className="absolute top-[32%] bottom-[32%] left-0 w-1/2 bg-slate-950/40 rounded-r-full border border-white/5 border-l-0 z-10" />

            {/* Separator lines */}
            {visibleEmotes.map((_, index) => {
              if (index === 0) return null;
              
              const totalSegments = visibleEmotes.length;
              const angleDeg = -90 + (index / totalSegments) * 180;

              return (
                <div
                  key={`sep-${index}`}
                  style={{ transform: `rotate(${angleDeg}deg)` }}
                  className="absolute top-1/2 bottom-0 left-0 w-[212px] h-[1px] bg-white/15 origin-top-left z-10"
                />
              );
            })}
          </div>

          {/* Navigation arrow */}
          {totalPages > 1 && (
            <button
              onClick={(e) => handlePageChange("prev", e)}
              className="absolute top-[-130px] left-[32px] w-8 h-8 bg-slate-800/90 border border-white/10 text-white rounded-full flex items-center justify-center text-xs shadow-md active:scale-90 transition-all z-30 hover:bg-purple-600"
            >
              ▲
            </button>
          )}

          {visibleEmotes.map((emote, index) => {
            const minAngle = -Math.PI * 0.33;
            const maxAngle = Math.PI * 0.33;
            
            const angle = visibleEmotes.length > 1 
              ? minAngle + (index / (visibleEmotes.length - 1)) * (maxAngle - minAngle)
              : 0;
              
            const radius = 75;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <button
                key={`${emote.id}-${currentPage}`}
                onClick={() => handleSelectEmote(emote.id)}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className="absolute w-12 h-12 rounded-full flex items-center justify-center text-3xl z-30 hover:scale-125 hover:bg-purple-500/20 active:scale-95 transition-all duration-150 animate-in fade-in zoom-in-75"
              >
                <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{emote.char}</span>
              </button>
            );
          })}

          {/* Navigation arrow */}
          {totalPages > 1 && (
            <button
              onClick={(e) => handlePageChange("next", e)}
              className="absolute bottom-[-130px] left-[32px] w-8 h-8 bg-slate-800/90 border border-white/10 text-white rounded-full flex items-center justify-center text-xs shadow-md active:scale-90 transition-all z-30 hover:bg-purple-600"
            >
              ▼
            </button>
          )}
        </div>
      )}
    </div>
  );
}