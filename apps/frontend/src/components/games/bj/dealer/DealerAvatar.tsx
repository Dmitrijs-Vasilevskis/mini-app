import { type ThreeElements } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { AvatarId } from "@uno/shared";
import { usePlayerAnimationStore } from "../../../../store/playerAnimationStore";
import { PlayerModel } from "../../../player/PlayerModel";
import { useRef } from "react";
import type { Group } from "three";

type Props = ThreeElements["group"] & {
  avatarId?: AvatarId;
  showName?: boolean;
  name?: string;
};

export function DealerAvatar({
  avatarId = "astronaut",
  showName = true,
  name = "Dealer",
  ...props
}: Props) {
  const animationQueue = usePlayerAnimationStore(
    (state) => state.animationQueues["dealer"]
  );
  const textRef = useRef<Group>(null);

  return (
    <group {...props}>
      <PlayerModel avatarId={avatarId} animationQueue={animationQueue} />

      {showName && (
        <group ref={textRef} position={[0, 2.1, 0]}>
          <Text
            ref={textRef}
            position={[0, 2.1, 0]}
            fontSize={0.28}
            color={"white"}
            anchorX="center"
          >
            {name}
          </Text>
        </group>
      )}
    </group>
  );
}
