import { Clone, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group } from "three";

export type PlayerAnimation =
  | "Idle"
  | "Death"
  | "Hit"
  | "No"
  | "Wave"
  | "Yes";

  type Props = {
    animation?: PlayerAnimation;
    animationKey?: number;
  };

export function PlayerModel({ animation = "Idle" }: Props) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF("/models/player/astronaut.glb");
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    console.log("Available animations:", names);

    const action = actions[animation];

    if (!action) {
      console.warn(`Animation "${animation}" not found`);
      return;
    }

    action.reset().fadeIn(0.2).play();

    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, animation]);

  return (
    <group ref={groupRef}>
      <Clone object={scene} />
    </group>
  );
}

useGLTF.preload("/models/player/astronaut.glb");
