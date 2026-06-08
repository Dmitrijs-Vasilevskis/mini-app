const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRoomCode(length = 6): string {
    return Array.from(
        { length },
        () => CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('');
}