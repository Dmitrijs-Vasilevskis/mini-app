export function getErrorMessage(err: unknown): string {
    if (err instanceof Error && err.message) {
        return err.message;
    }

    if (typeof err === "string" && err.trim()) {
        return err;
    }

    return "Failed to connect to the room. Please try again.";
}
