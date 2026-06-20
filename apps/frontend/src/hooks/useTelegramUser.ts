import { useEffect, useRef, useState } from "react";
import type { WebAppUser } from "../types/TelegramWebApp";

export interface UseTelegramUserInterface {
  initData: string;
  username: string;
  user: WebAppUser;
  setUsername: (username: string) => void;
  ready: boolean;
  error: boolean;
}

export function useTelegramUser(): UseTelegramUserInterface {
  const [initData, setInitData] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [ready, setReady] = useState(false);

  const [error, setError] = useState<boolean>(false);
  const initialized = useRef<boolean>(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      }

      const realUser = tg.initDataUnsafe?.user as WebAppUser;
      const realInitData = tg.initData;

      setInitData(realInitData);
      setUser(realUser || null);
      setUsername(realUser.username || realUser.first_name || "Player");
      setReady(true);
    } else {
      console.warn("No telegram user was found");
      setError(true);
    }
  }, []);

  return { initData, username, user, setUsername, ready, error };
}