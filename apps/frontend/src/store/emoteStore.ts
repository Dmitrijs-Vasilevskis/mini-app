import { create } from "zustand";

interface ActiveEmote {
    emoteId: string;
    timestamp: number;
}

interface EmoteStore {
    activeEmotes: Record<string, ActiveEmote>;
    triggerEmote: (playerId: string, emoteId: string) => void;
    clearEmote: (playerId: string, timestamp: number) => void;
}

export const useEmoteStore = create<EmoteStore>((set) => ({
    activeEmotes: {},
    triggerEmote: (playerId, emoteId) => {

        set((state) => ({
            activeEmotes: {
                ...state.activeEmotes,
                [playerId]: {
                    emoteId,
                    timestamp: Date.now()
                }
            }
        }));

        setTimeout(() => {
            set((state) => {
                const curr = state.activeEmotes[playerId];

                if (curr) {
                    const updatedEmotes = { ...state.activeEmotes };
                    delete updatedEmotes[playerId];
                    return { activeEmotes: updatedEmotes }
                }

                return state;
            });
        }, 3000);
    },
    clearEmote: (playerId, timestamp) => {
        set((state) => {
            const current = state.activeEmotes[playerId];
            if (current && current.timestamp === timestamp) {
                const updatedEmotes = { ...state.activeEmotes };
                delete updatedEmotes[playerId];
                return { activeEmotes: updatedEmotes };
            }
            return state;
        });
    },
}));