const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRoomCode(length = 6): string {
    return Array.from(
        { length },
        () => CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('');
}

export function generateUniqueRoomCode(
    isAvailable: (code: string) => boolean,
    length = 6,
    maxAttempts = 20,
): string {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const code = generateRoomCode(length);

        if (isAvailable(code)) {
            return code;
        }
    }

    throw new Error("Failed to generate a unique room code.");
}