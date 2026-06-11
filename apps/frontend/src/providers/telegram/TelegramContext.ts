import { createContext, useContext } from "react";
import type { TelegramUser } from "../../hooks/useTelegramUser";

interface TelegramContextInterface {
    user: TelegramUser | null;
    ready: boolean;
    playerId: string;
    telegramId: string | null;
    setUsername: (username: string) => void;
}

export const TelegramContext = createContext<TelegramContextInterface | null>(null);

export const useTelegramContext = () => {
    const context = useContext(TelegramContext);
    if (!context) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
}