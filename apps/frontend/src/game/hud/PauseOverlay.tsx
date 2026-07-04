import { useEffect, useState, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import { WifiOffIcon } from "../../components/ui/icons/WifiOff";
import { CountdownProgressCircle } from "../../components/ui/icons/CountdownProgressCircle";

export function PauseOverlay() {
  const { isPaused, reconnectRemaining, players } = useGameStore();
  const [displayTime, setDisplayTime] = useState<number>(0);

  const animationRef = useRef<number | null>(null);
  const lastUpdatedRef = useRef<number>(Date.now());
  const remainingMsRef = useRef<number>(0);

  useEffect(() => {
    remainingMsRef.current = reconnectRemaining || 0;
    lastUpdatedRef.current = Date.now();

    if (animationRef.current === null && isPaused) {
      setDisplayTime(Math.ceil(remainingMsRef.current / 1000));
    }
  }, [reconnectRemaining, isPaused]);

  useEffect(() => {
    if (!isPaused) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const tick = () => {
      const now = Date.now();
      const delta = now - lastUpdatedRef.current;
      lastUpdatedRef.current = now;

      remainingMsRef.current = Math.max(0, remainingMsRef.current - delta);
      const secondsLeft = Math.ceil(remainingMsRef.current / 1000);
      setDisplayTime(secondsLeft);

      if (remainingMsRef.current > 0) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPaused]);

  if (!isPaused) return null;

  const disconnectedPlayers = players.filter((p) => !p.isConnected);
  const progressPercentage = Math.min(
    100,
    Math.max(0, (displayTime / 30) * 100)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-sm landscape:max-w-2xl flex flex-col landscape:flex-row gap-6 items-center rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl text-center landscape:text-left">
        <div className="flex flex-col items-center shrink-0 w-full landscape:w-1/2">
          <div className="relative mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 animate-pulse">
            <WifiOffIcon className="h-6 w-6" />
          </div>

          <h2 className="mb-1 text-xl font-black tracking-tight text-white uppercase">
            Match Paused
          </h2>
          <p className="mb-4 text-xs text-zinc-400 text-center">
            Waiting for connection recovery before advancing gameplay loops.
          </p>

          <div className="relative mt-2 flex items-center justify-center self-center">
            <CountdownProgressCircle
              percentage={progressPercentage}
              label={`${displayTime}s`}
              size={96}
            />
          </div>
        </div>

        <div className="w-full landscape:w-1/2 flex flex-col h-full self-stretch justify-center">
          <div className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase px-1 mb-1.5 text-left">
            Offline Pool ({disconnectedPlayers.length})
          </div>

          <div className="space-y-2 rounded-xl bg-zinc-900/50 p-3 border border-white/5 text-left max-h-40 landscape:max-h-44 overflow-y-auto">
            {disconnectedPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg bg-zinc-900 p-2 border border-white/5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-bold text-zinc-300">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate text-xs font-semibold text-zinc-200">
                    {player.name}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                  <span className="h-1 w-1 rounded-full bg-red-500 animate-ping" />
                  Offline
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-zinc-900 overflow-hidden">
          <div
            className="bg-red-500 h-full transition-all duration-150 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
