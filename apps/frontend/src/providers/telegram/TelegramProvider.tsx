import {
  useTelegramUser,
  type TelegramUser,
} from "../../hooks/useTelegramUser";
import { TelegramContext } from "./TelegramContext";

interface TelegramContextInterface {
  user: TelegramUser | null;
  ready: boolean;
  playerId: string;
  telegramId: string | null;
  setUsername: (username: string) => void;
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { user, ready, playerId, telegramId, setUsername } = useTelegramUser();

  if (!ready) {
    return <div>Loading...</div>; // or null
  }

  const contextValue: TelegramContextInterface = {
    user,
    ready,
    playerId,
    telegramId,
    setUsername,
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}
