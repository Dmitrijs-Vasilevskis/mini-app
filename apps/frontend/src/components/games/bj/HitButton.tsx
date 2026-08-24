interface Props {
    isAvailable: boolean;
    onClick: () => void;
  }
  
  export function HitButton({ onClick, isAvailable }: Props) {
    return (
      <div className="fixed sm:bot-1/2 sm:right-6 sm:translate-x-0 sm:-translate-y-1/2 bottom-1/4 translate-y-1/4 right-4 z-50">
        <button
          onClick={onClick}
          disabled={!isAvailable}
          className={`
          group relative overflow-hidden
          rounded-2xl px-6 py-4
          font-bold text-white
          backdrop-blur-md
          border border-white/10
          shadow-2xl
          transition-all duration-150
          active:scale-95
          ${
            isAvailable
              ? `
                bg-yellow-500/90 hover:bg-yellow-400
                hover:scale-105
                hover:shadow-yellow-500/30
              `
              : `
                bg-gray-700/70
                opacity-50
                cursor-not-allowed
              `
          }
        `}
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg">Hit</span>
            </div>
          </div>
  
          {isAvailable && (
            <div
              className="
              absolute inset-0
              bg-white/10
              opacity-0
              group-hover:opacity-100
              transition-opacity
            "
            />
          )}
        </button>
      </div>
    );
  }
  