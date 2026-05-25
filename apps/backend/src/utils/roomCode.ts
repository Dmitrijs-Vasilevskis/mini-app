const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRoomCode(length: number = 6): string {
    let code = '';

    for (let i = 0; i < length; i++) {
        code += CHARS[Math.random() * CHARS.length];
    }

    return code;
}