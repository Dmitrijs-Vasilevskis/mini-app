import type { AvatarId } from "@uno/shared";
import { AVATARS } from "./avatar.config";
import { useGLTF } from "@react-three/drei";

export function preloadAvatar(avatarId: AvatarId) {
    const avatar = AVATARS[avatarId];

    if (!avatar) {
        return;
    }

    useGLTF.preload(avatar.modelPath);
}

export function preloadAvatars(avatarIds: AvatarId[]) {
    for (const avatarId of new Set(avatarIds)) {
        preloadAvatar(avatarId);
    }
}

export function preloadAllAvatars() {
    Object.values(AVATARS).forEach((avatar) => {
        useGLTF.preload(avatar.modelPath);
    });
}