import { useEffect } from "react";
import { useTelegramUser } from "../../hooks/useTelegramUser";
import { TelegramContext } from "./TelegramContext";

interface TelegramContextInterface {
  user: ReturnType<typeof useTelegramUser>["user"];
  ready: ReturnType<typeof useTelegramUser>["ready"];
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useTelegramUser();

  const contextValue: TelegramContextInterface = {
    user,
    ready,
  };

  useEffect(() => {
    console.log(">> TelegramProvider user:", user);
    console.log(">> TelegramProvider ready:", ready);
  }, [user, ready]);


  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}
