import { MAX_ROOMS_PER_PROCESS } from "../game/constants";

const activeRoomCodes = new Set<string>();
let activeRoomCount = 0;

export function getActiveRoomCount(): number {
    return activeRoomCount;
}

export function hasRoomCode(code: string): boolean {
    return activeRoomCodes.has(code);
}

export function assertRoomCapacity(): void {
    if (activeRoomCount >= MAX_ROOMS_PER_PROCESS) {
        throw new Error("Server is at room capacity. Please try again later.");
    }
}

export function registerRoom(code: string): void {
    if (activeRoomCodes.has(code)) {
        throw new Error("Room code collision detected.");
    }

    activeRoomCodes.add(code);
    activeRoomCount++;
}

export function unregisterRoom(code: string): void {
    if (!activeRoomCodes.delete(code)) {
        return;
    }

    activeRoomCount = Math.max(0, activeRoomCount - 1);
}
