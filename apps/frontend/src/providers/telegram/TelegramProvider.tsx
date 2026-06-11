import {
  useTelegramUser,
  type TelegramUser,
} from "../../hooks/useTelegramUser";
import { TelegramContext } from "./TelegramContext";

interface TelegramContextInterface {
  user: TelegramUser;
  ready: boolean;
  playerId: string;
  telegramId: string;
  setUsername: (username: string) => void;
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { user, ready, playerId, telegramId, setUsername } = useTelegramUser();

  const contextValue: TelegramContextInterface = {
    user,
    ready,
    playerId,
    telegramId,
    setUsername
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}
