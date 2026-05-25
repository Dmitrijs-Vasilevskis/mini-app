import { Text } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

import { useFrame } from "@react-three/fiber";

import { useRef } from "react";

import type { Group } from "three";

type Props = ThreeElements["group"] & {
  name: string;
  active?: boolean;
};

export function AvatarPlayer({ name, active, ...props }: Props) {
  const groupRef = useRef<Group>(null);
  const textRef = useRef(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    if (!active) {
      groupRef.current.position.y = 0;
      return;
    }

    const t = clock.getElapsedTime();

    if (textRef.current && active) {
      const s = 1 + Math.sin(t * 3) * 0.08;
      textRef.current.scale.set(s, s, s);
    }

    groupRef.current.position.y = Math.sin(t * 3) * 0.08;
  });

  return (
    <group {...props}>
      {/* TURN RING */}
      {active && (
        <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.82, 32]} />

          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={3}
          />
        </mesh>
      )}

      {/* PULSING PLAYER */}
      <group ref={groupRef}>
        {/* BODY */}
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.35, 0.8, 8, 16]} />

          <meshStandardMaterial color="#2563eb" />
        </mesh>

        {/* HEAD */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.32, 32, 32]} />

          <meshStandardMaterial color="#f5d0a9" />
        </mesh>

        {/* FACE */}
        <mesh position={[0, 1.5, 0.29]}>
          <circleGeometry args={[0.18, 32]} />

          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* NAME */}
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
    </group>
  );
}
