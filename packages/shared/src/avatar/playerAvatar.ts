export type AvatarAnimation = "Idle" | "Death" | "Hit" | "No" | "Wave" | "Yes";

export const AVATAR_IDS = [
    "astronaut",
    "big_arm",
  ] as const;
  
  export type AvatarId =
    (typeof AVATAR_IDS)[number];