interface Props {
  joining: boolean;
  onCreate: () => void;
}

export function CreateLobby({ joining, onCreate }: Props) {
  return (
    <button
      disabled={joining}
      onClick={onCreate}
      className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 font-bold tracking-wide shadow-lg shadow-green-900/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {joining ? (
        <span className="text-sm font-medium animate-pulse">
          Setting up lobby...
        </span>
      ) : (
        <>
          <span className="text-lg">🎮</span>
          <span>CREATE NEW GAME</span>
        </>
      )}
    </button>
  );
}
