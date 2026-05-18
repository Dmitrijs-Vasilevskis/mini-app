import { createContext, useContext } from "react";
import type { useTelegramUser } from "../../hooks/useTelegramUser";

interface TelegramContextInterface {
    user: ReturnType<typeof useTelegramUser>["user"];
    ready: ReturnType<typeof useTelegramUser>["ready"];
  }

export const TelegramContext = createContext<TelegramContextInterface>({
    user: null,
    ready: false,
});

export const useTelegramContext = () => {
    const context = useContext(TelegramContext);
    if (!context) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
}