import { useCallback, useEffect, useRef, useState } from "react";

export interface TelegramUser {
  id: string;
  username: string;
  first_name: string;
  last_name?: string;
}

// export interface UseTelegramUserInterface {
//   user: TelegramUser | null;
//   playerId: string;
//   telegramId: string;
//   ready: boolean;
//   setUsername: (username: string) => void;
// }

export interface UseTelegramUserInterface {
  initData: string; // The vital string token we send to Colyseus
  username: string;
  setUsername: (username: string) => void;
  ready: boolean;
  error: boolean;
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
  const [initData, setInitData] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [ready, setReady] = useState(false);

  const [user, setUser] = useState<TelegramUser | null>(null);

  const [playerId, setPlayerId] = useState<string>("");
  const [telegramId, setTelegramId] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const initialized = useRef<boolean>(false);

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
    if (tg && tg.initData) {
      tg.ready();
      tg.expand();

      // const tgUser = tg.initDataUnsafe?.user;
      // if (tgUser) {

      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      }

      setInitData(tg.initData);
      setUsername(tg.initDataUnsafe?.user?.username || tg.initDataUnsafe?.user?.first_name || "Player");
      setReady(true);
      // handleInit(tgUser);
    } else {
      console.warn("No telegram user was found")
      handleInit(undefined)
    }
    // }
    // else {
    //   console.log('⚠️ Running outside Telegram – using web identity');
    //   handleInit(undefined)
    // }
  }, []);

  // return {
  //   user,
  //   playerId,
  //   telegramId,
  //   ready,
  //   setUsername: updateUsername
  // };

  return { initData, username, setUsername, ready, error };
}