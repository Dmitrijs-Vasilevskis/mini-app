import { useCallback, useEffect, useRef, useState } from "react";

export interface TelegramUser {
  id: string;
  username: string;
  first_name: string;
  last_name?: string;
}

export interface UseTelegramUserInterface{
  user: TelegramUser | null;
  playerId: string;
  telegramId: string | null;
  ready: boolean;
  setUsername: (username: string) => void;
}

const STORAGE_KEY = "uno_player_id";
const USERNAME_STORAGE_KEY = "uno_player_name"

function getOrCreateWebPlayerId(): string {
  let id = localStorage.getItem(STORAGE_KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }

  return id;
}

export function useTelegramUser(): UseTelegramUserInterface {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [ready, setReady] = useState(false);

  const initialized = useRef(false);

  const [playerId, setPlayerId] = useState("");
  const [telegramId, setTelegramId] = useState<string>("");

  const updateUsername = useCallback((username: string) => {
    localStorage.setItem(USERNAME_STORAGE_KEY, username);

    setUser((prev) =>
      prev
        ? {
          ...prev,
          username,
          first_name: username,
        }
        : prev
    );
  }, []);

  const handleInit = useCallback((tgUser?: TelegramUser) => {
    if (tgUser) {
      const id = String(tgUser.id);

      setUser(tgUser);
      setTelegramId(id);
      setPlayerId(id);
    } else {
      const webId = getOrCreateWebPlayerId();

      setUser({
        id: webId.slice(0, 8),
        first_name: '',
        username: ''
      })

      setTelegramId('');
      setPlayerId(webId);
    }
    setReady(true);
  }, []);

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

      const realUser = tg.initDataUnsafe?.user;
      if (realUser) {
        handleInit(realUser);
      } else {
        console.warn("No telegram user was found")
        handleInit(undefined)
      }
    } else {
      console.log('⚠️ Running outside Telegram – using web identity');
      handleInit(undefined)
    }
  }, [handleInit]);

  return {
    user,
    playerId,
    telegramId,
    ready,
    setUsername: updateUsername
  };
}