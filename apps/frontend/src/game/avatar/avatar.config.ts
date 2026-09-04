import type { AvatarAnimation, AvatarId } from "@uno/shared";

export type AvatarConfig = {
  id: AvatarId;
  modelPath: string;
  scale: number;

  animations: Partial<Record<AvatarAnimation, string>>;
};

export const AVATARS: Record<AvatarId, AvatarConfig> = {
  astronaut: {
    id: "astronaut",
    modelPath: "/models/player/astronaut-1.glb",
    scale: 1,

    animations: {
      Idle: "Idle",
      Hit: "Hit",
      Death: "Death",
      No: "No",
      Wave: "Wave",
      Yes: "Yes",
    },
  },

  big_arm: {
    id: "big_arm",
    modelPath: "/models/player/big-arm.glb",
    scale: 1.8,

    animations: {
      Idle: "Idle",
      Hit: "Hit",
      Death: "Death",
      No: "No",
      Wave: "Wave",
      Yes: "Yes",
    },
  },
};