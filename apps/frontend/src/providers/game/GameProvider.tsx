import { createContext, useContext, useEffect, useState } from "react";
import {
  useTelegramUser,
  type TelegramUser,
} from "../../hooks/useTelegramUser";
import { colyseusService } from "../../services/colyseus";
import { useGameStore } from "../../store/gameStore";
import { GameEvents } from "../../game/GameEvents";

interface GameContextInterface {
  user: TelegramUser | null;
  telegramId: string;
  playerId: string;
  joining: boolean;
  roomCode: string;
  isLandscape: boolean;
  setRoomCode: (values: string) => void;
  setUsername: (username: string) => void;
  createRoom: () => Promise<void>;
  joinRoom: () => Promise<void>;
  leaveRoom: () => Promise<void>;
}

export const GameContext = createContext<GameContextInterface | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user, playerId, telegramId, setUsername } = useTelegramUser();

  const [roomCode, setRoomCode] = useState<string>("");
  const [joining, setJoining] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  const displayName = user?.username || user?.first_name || "Player";

  const createRoom = async () => {
    if (joining) return;

    if (!playerId) {
      console.error("Player identity not ready");
      return;
    }

    setJoining(true);

    try {
      const room = await colyseusService.createRoom(
        displayName,
        playerId,
        telegramId
      );

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

    if (!playerId) {
      console.error("Player identity not ready");
      return;
    }

    if (!roomCode.trim()) {
      console.error("Room Code is required");
      return;
    }

    setJoining(true);

    try {
      const room = await colyseusService.joinRoomByCode(
        roomCode,
        displayName,
        playerId,
        telegramId
      );

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
        user,
        telegramId,
        playerId,
        joining,
        roomCode,
        isLandscape,
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
