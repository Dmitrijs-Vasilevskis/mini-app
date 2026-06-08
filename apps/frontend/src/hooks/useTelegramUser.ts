import { useCallback, useEffect, useRef, useState } from "react";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
}

export function useTelegramUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  const handleSetUser = useCallback((newUser: User) => {
    setUser((prev) => {
      if (prev) {
        console.warn('⚠️ Telegram user already set, ignoring', newUser);
        return prev;
      }
      return newUser;
    });
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
        handleSetUser(realUser);
      } else {
        handleSetUser({
          id: Math.floor(Math.random() * 1000000),
          username: 'Anonymous',
          first_name: 'Telegram',
          last_name: 'User',
        });
      }
    } else {
      console.log('⚠️ Running outside Telegram – using mock user');
      handleSetUser({
        id: Math.floor(Math.random() * 1000000),
        username: 'LocalTester',
        first_name: 'Local',
        last_name: 'Tester',
      });
    }
  }, [handleSetUser]);

  return { user, ready };
}