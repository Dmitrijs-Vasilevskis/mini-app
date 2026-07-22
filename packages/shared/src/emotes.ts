export interface Emote {
    id: string;
    char: string;
}

export const EMOTES = [
    { id: "laugh", char: "😂" },
    { id: "angry", char: "😡" },
    { id: "wow", char: "😮" },
    { id: "cry", char: "😢" },
    { id: "flex", char: "💪" },
    { id: "gg", char: "🤝" },
    { id: "heart", char: "❤️" },
    { id: "fire", char: "🔥" },
    { id: "mindblown", char: "🤯" },
] as const;

export type EmoteId = typeof EMOTES[number]["id"];

export const EMOTE_IDS = new Set<EmoteId>(
    EMOTES.map((e) => e.id)
);

export function isValidEmote(id: string): id is EmoteId {
    return EMOTE_IDS.has(id as EmoteId);
}