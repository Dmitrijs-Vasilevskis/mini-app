import { createContext, useContext, useEffect, useState } from "react";
import { useTelegramUser } from "../../hooks/useTelegramUser";
import { colyseusService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { GameEvents } from "../../game/GameEvents";

interface GameContextInterface {
  joining: boolean;
  roomCode: string;
  isLandscape: boolean;
  username: string;
  setRoomCode: (values: string) => void;
  setUsername: (username: string) => void;
  createRoom: () => Promise<void>;
  joinRoom: () => Promise<void>;
  leaveRoom: () => Promise<void>;
}

export const GameContext = createContext<GameContextInterface | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  // const { user, playerId, telegramId, setUsername } = useTelegramUser();
  const { initData, username, setUsername } = useTelegramUser();

  const [roomCode, setRoomCode] = useState<string>("");
  const [joining, setJoining] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  const createRoom = async () => {
    if (joining) return;

    // if (!playerId) {
    //   console.error("Player identity not ready");
    //   return;
    // }

    setJoining(true);

    try {
      const room = await colyseusService.createRoom(initData);

      room.onStateChange.once(() => {
        GameEvents.initialize(room);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const joinRoom = async () => {
    if (joining) return;

    if (!roomCode.trim()) {
      console.error("Room Code is required");
      return;
    }

    setJoining(true);

    try {
      const room = await colyseusService.joinRoomByCode(roomCode, initData);

      room.onStateChange.once(() => {
        GameEvents.initialize(room);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const leaveRoom = async () => {
    try {
      await colyseusService.leave();

      useGameStore.getState().reset();
    } catch (error) {
      console.error("Failed to leave room", error);
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: landscape)");

    setIsLandscape(mediaQuery.matches);

    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsLandscape(e.matches);
    };

    mediaQuery.addEventListener("change", handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener("change", handleOrientationChange);
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        joining,
        roomCode,
        isLandscape,
        username,
        setRoomCode,
        setUsername,
        createRoom,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
};
