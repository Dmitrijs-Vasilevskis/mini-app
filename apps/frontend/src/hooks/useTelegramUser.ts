import { useEffect, useRef, useState } from "react";
import type { WebAppInitData } from "../types/TelegramWebApp";


export interface UseTelegramUserInterface {
  initData: string;
  username: string;
  setUsername: (username: string) => void;
  ready: boolean;
  error: boolean;
}

export function useTelegramUser(): UseTelegramUserInterface {
  const [initData, setInitData] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [ready, setReady] = useState(false);

  const [error, setError] = useState<boolean>(false);
  const initialized = useRef<boolean>(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      tg.ready();
      tg.expand();

      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      }

      console.error(">> tg.initDataUnsafe", tg.initDataUnsafe);

      const initDataUnsafe = tg.initDataUnsafe as WebAppInitData;

      setInitData(tg.initData);
      setUsername(initDataUnsafe.user?.username || initDataUnsafe.user?.first_name || "Player");
      setReady(true);
    } else {
      console.warn("No telegram user was found");
      setError(true);
    }
  }, []);

  return { initData, username, setUsername, ready, error };
}