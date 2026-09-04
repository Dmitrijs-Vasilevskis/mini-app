import type { AvatarAnimation } from "@uno/shared"
import { create } from "zustand";

export type PlayerAnimationEvent = {
    animation: AvatarAnimation;
    triggerId: string;
}

type PendingAnimation = {
    playerId: string;
    animation: AvatarAnimation;
}

type PlayerAnimationStore = {
    animationQueues: Record<string, PlayerAnimationEvent[]>;
    pendingActions: Record<string, PendingAnimation>;
    triggerServerAnimation: (playerId: string, animation: AvatarAnimation, eventId: string, actionId?: string) => void;
    triggerOptimisticAnimation: (playerId: string, animation: AvatarAnimation, actionId: string) => void;
    resolveAction: (actionId: string) => void;
    clearAnimations: (playerId: string) => void;
}

export const usePlayerAnimationStore = create<PlayerAnimationStore>(
    (set) => ({
        animationQueues: {},
        pendingActions: {},
        triggerServerAnimation: (playerId, animation, eventId, actionId) => set((state) => {
            if (actionId && state.pendingActions[actionId]) {
                const pendingActions = {
                    ...state.pendingActions,
                }

                delete pendingActions[actionId];

                return {
                    pendingActions
                };
            }

            return {
                animationQueues: {
                    ...state.animationQueues,
                    [playerId]: [
                        ...(state.animationQueues[playerId] ?? []),
                        {
                            animation,
                            triggerId: eventId
                        }
                    ],
                }
            }
        }),
        triggerOptimisticAnimation: (playerId, animation, actionId) => set((state) => {
            return {
                pendingActions: {
                    ...state.pendingActions,
                    [actionId]: {
                        playerId,
                        animation
                    }
                },
                animationQueues: {
                    ...state.animationQueues,
                    [playerId]: [
                        ...(state.animationQueues[playerId] ?? []),
                        {
                            animation,
                            triggerId: actionId
                        }
                    ],
                }
            };
        }),
        resolveAction: (actionId) => set((state) => {
            if (!state.pendingActions[actionId]) {
                return state;
            }

            const pendingActions = {
                ...state.pendingActions,
            }

            delete pendingActions[actionId];

            return {
                pendingActions
            };
        }),
        clearAnimations: (playerId) => set((state) => {
            if (!state.animationQueues[playerId]) {
                return state;
            }

            const updatedAnimations = { ...state.animationQueues };

            delete updatedAnimations[playerId];

            return {
                animationQueues: updatedAnimations
            }
        }),
    })
)