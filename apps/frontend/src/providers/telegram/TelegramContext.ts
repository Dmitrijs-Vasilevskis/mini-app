import { createContext, useContext } from "react";
import type { TelegramUser } from "../../hooks/useTelegramUser";

interface TelegramContextInterface {
    user: TelegramUser;
    ready: boolean;
    playerId: string;
    telegramId: string;
    setUsername: (username: string) => void;
}

export const TelegramContext = createContext<TelegramContextInterface>(null);

export const useTelegramContext = () => {
    const context = useContext(TelegramContext);
    if (!context) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
}