interface Props {
  isAvailable: boolean;
  onClick: () => void;
}

export function StandButton({ onClick, isAvailable }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`group relative overflow-hidden w-28 landscape:w-auto rounded-2xl px-6 py-4 font-bold text-white
        backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-150 active:scale-95
        ${
          isAvailable
            ? `bg-amber-500/90 hover:bg-amber-400 hover:scale-105 hover:shadow-amber-500/30`
            : `bg-gray-700/70 opacity-50 cursor-not-allowed`
        }
      `}
    >
      <div className="flex justify-center gap-3">
        <div className="flex flex-col items-start leading-none">
          <span className="text-lg">Stand</span>
        </div>
      </div>

      {isAvailable && (
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
