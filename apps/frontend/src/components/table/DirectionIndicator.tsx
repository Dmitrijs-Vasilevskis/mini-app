import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { DirectionArrow } from "./DirectionArrow";

interface DirectionIndicatorProps {
  direction: 1 | -1;
}

export function DirectionIndicator({ direction }: DirectionIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null);

  const count = 5;
  const radius = 3.3;

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.5 * direction;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const tangentX = direction * Math.sin(angle);
        const tangentZ = direction * Math.cos(angle);

        const rotationY = Math.atan2(tangentZ, tangentX);

        return (
          <DirectionArrow
            key={i}
            position={[x, 0.35, z]}
            rotation={[0, rotationY, 0]}
          />
        );
      })}
    </group>
  );
}
