import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  generateRandomButtonPosition,
  type ButtonPosition,
} from "../../../game/Helpers";

interface ReactionButtonProps {
  visible: boolean;
  text: string;
  onClick: () => void;
  color: "yellow" | "red";
};

const COLOR_CONFIG = {
  yellow: {
    bg: "bg-yellow-500/90 hover:bg-yellow-400",
    glow: "rgba(234,179,8,0.9)",
    glowWeak: "rgba(234,179,8,0.3)",
    rotate: -15,
  },
  red: {
    bg: "bg-red-500/90 hover:bg-red-400",
    glow: "rgba(239,68,68,0.9)",
    glowWeak: "rgba(239,68,68,0.3)",
    rotate: 15,
  },
};

export function ReactionButton({
  visible,
  text,
  onClick,
  color,
}: ReactionButtonProps) {
  const [position, setPosition] = useState<ButtonPosition>({
    left: "50%",
    bottom: "20%",
  });

  const config = COLOR_CONFIG[color];

  useEffect(() => {
    if (visible) {
      setPosition(generateRandomButtonPosition());
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="absolute z-40"
      style={{
        left: position.left,
        bottom: position.bottom,
        transform: "translateX(-50%)",
      }}
    >
      <motion.button
        onClick={onClick}
        initial={{
          scale: 0,
          rotate: config.rotate,
          opacity: 0,
        }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            `0 0 0px ${config.glowWeak}`,
            `0 0 35px ${config.glow}`,
            `0 0 0px ${config.glowWeak}`,
          ],
          rotate: 0,
          opacity: 1,
        }}
        transition={{
          scale: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          boxShadow: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 0.25,
          },
          opacity: {
            duration: 0.25,
          },
        }}
        whileHover={{
          scale: 1.15,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className={`
          group
          relative
          overflow-hidden
          rounded-2xl
          px-6
          py-4
          font-bold
          text-white
          backdrop-blur-md
          border
          border-white/10
          select-none
          ${config.bg}
        `}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative flex items-center gap-3">
          <span className="text-lg">{text}</span>
        </div>
      </motion.button>
    </div>
  );
}
