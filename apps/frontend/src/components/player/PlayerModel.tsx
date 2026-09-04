import { useGLTF } from "@react-three/drei";
import type { AvatarId } from "@uno/shared";
import { AVATARS } from "../../game/avatar/avatar.config";
import { AvatarModelInstance } from "../../game/avatar/AvatarModelInstance";
import type { PlayerAnimationEvent } from "../../store/playerAnimationStore";

type Props = {
  avatarId: AvatarId;
  animationQueue?: PlayerAnimationEvent[];
};

export function PlayerModel({
  avatarId,
  animationQueue = [],
}: Props) {
  const avatar = AVATARS[avatarId];
  useGLTF.preload(avatar.modelPath);

  return (
    <group scale={avatar.scale}>
      <AvatarModelInstance
        avatar={avatar}
        animationQueue={animationQueue}
      />
    </group>
  );
}
