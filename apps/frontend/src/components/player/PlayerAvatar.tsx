import { Text } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { PlayerModel } from "./PlayerModel";
import { LostConnectionIcon } from "../uno/connection/LostConnectionIcon";

type Props = ThreeElements["group"] & {
  name: string;
  active?: boolean;
  isConnected?: boolean;
  showName?: boolean;
  showTurnIndicator?: boolean;
  modelScale?: number;
};

export function PlayerAvatar({
  name,
  active = false,
  isConnected = true,
  showName = true,
  showTurnIndicator = true,
  modelScale = 1,
  ...props
}: Props) {
  const animatedGroupRef = useRef<Group>(null);
  const textRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = animatedGroupRef.current;

    if (!group) {
      return;
    }

    if (!active) {
      group.position.y = 0;

      if (textRef.current) {
        textRef.current.scale.setScalar(1);
      }

      return;
    }

    const t = clock.getElapsedTime();

    group.position.y = Math.sin(t * 3) * 0.08;

    if (textRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.08;
      textRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group {...props}>
      {active && showTurnIndicator && (
        <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.82, 32]} />

          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={3}
          />
        </mesh>
      )}

      <group ref={animatedGroupRef}>
        <group scale={modelScale}>
          <PlayerModel />
        </group>
      </group>
      {showName && (
        <group ref={textRef} position={[0, 2.1, 0]}>
          <Text
            ref={textRef}
            position={[0, 2.1, 0]}
            fontSize={active ? 0.28 : 0.2}
            color={active ? "#facc15" : "white"}
            anchorX="center"
          >
            {name}
          </Text>
        </group>
      )}

      {!isConnected && (
        <group position={[0, 2.35, 0]}>
          <LostConnectionIcon color="#ef4444" position={[0, 0.22, 0]} />
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="#ef4444"
            anchorX="center"
            fontWeight="bold"
          >
            DISCONNECTED
          </Text>
        </group>
      )}
    </group>
  );
}
