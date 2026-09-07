export class SeatManager {
    private readonly seats: Array<string | null>;

    constructor(private readonly seatCount: number) {
        if (!Number.isInteger(seatCount) || seatCount < 0) {
            throw new Error("seatCount must be a non-negative integer");
        }

        this.seats = Array.from({ length: seatCount }, () => null);
    }

    reserve(playerId: string): number | null {
        const existingSeat = this.getSeat(playerId);

        if (existingSeat !== null) {
            return existingSeat;
        }

        const availableSeat = this.seats.findIndex((id) => id === null);

        if (availableSeat === -1) {
            return null;
        }

        this.seats[availableSeat] = playerId;

        return availableSeat;
    }

    release(playerId: string): void {
        const seat = this.getSeat(playerId);

        if (seat === null) {
            return;
        }

        this.seats[seat] = null;
    }

    clear(): void {
        this.seats.fill(null);
    }

    getSeat(playerId: string): number | null {
        const seat = this.seats.findIndex((id) => id === playerId);

        return seat === -1 ? null : seat;
    }

    isOccupied(seatIndex: number): boolean {
        return this.seats[seatIndex] !== null;
    }

    getAvailableSeats(): number[] {
        return this.seats
            .map((playerId, index) => (playerId === null ? index : -1))
            .filter((index) => index !== -1);
    }

    replacePlayerId(oldPlayerId: string, newPlayerId: string): void {
        const seatIndex = this.getSeat(oldPlayerId);

        if (seatIndex === null) {
            return;
        }

        const existingSeat = this.getSeat(newPlayerId);

        if (existingSeat !== null && existingSeat !== seatIndex) {
            throw new Error(
                `Cannot replace player ${oldPlayerId} with ${newPlayerId}: ` +
                `player already occupies seat ${existingSeat}`
            );
        }

        this.seats[seatIndex] = newPlayerId;
    }

    getPlayerAtSeat(seatIndex: number): string | null {
        return this.seats[seatIndex] ?? null;
    }
}