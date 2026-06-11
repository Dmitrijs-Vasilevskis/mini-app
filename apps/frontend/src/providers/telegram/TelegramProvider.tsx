import { createContext, useContext } from "react";
import {
  useTelegramUser,
  type TelegramUser,
} from "../../hooks/useTelegramUser";

interface TelegramContextInterface {
  user: TelegramUser | null;
  ready: boolean;
  playerId: string;
  telegramId: string | null;
  setUsername: (username: string) => void;
}

export const TelegramContext = createContext<TelegramContextInterface | null>(null);

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { user, ready, playerId, telegramId, setUsername } = useTelegramUser();

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <TelegramContext.Provider
      value={{
        user,
        ready,
        playerId,
        telegramId,
        setUsername,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegramContext = () => {
    const context = useContext(TelegramContext);
    if (!context) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
}
