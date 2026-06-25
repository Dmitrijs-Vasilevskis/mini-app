import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const EMOTE_MAP: Record<string, string> = {
  laugh: "😂",
  angry: "😡",
  wow: "😮",
  cry: "😢",
  flex: "💪",
  gg: "🤝",
  heart: "❤️",
  fire: "🔥",
  mindblown: "🤯",
};

interface Props {
  emote: string;
  timestamp: number;
}

export function FloatingEmote3D({ emote, timestamp }: Props) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = (Date.now() - timestamp) / 1000;

    if (elapsed > 2.0) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.position.y = 2.6 + elapsed * 0.4;

    if (elapsed < 0.2) {
      const scaleProgress = elapsed / 0.2;
      groupRef.current.scale.setScalar(scaleProgress * 1.3);
    } else {
      const settle = Math.max(1.0, 1.3 - (elapsed - 0.2) * 0.5);
      groupRef.current.scale.setScalar(settle);
    }

    groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 8) * 0.1;
    groupRef.current.rotation.y = Math.cos(clock.getElapsedTime() * 4) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Text fontSize={0.35} anchorX="center" anchorY="middle">
        {EMOTE_MAP[emote] || "💬"}
      </Text>
    </group>
  );
}
