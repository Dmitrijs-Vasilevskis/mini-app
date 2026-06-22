const BACKEND_URL = import.meta.env.VITE_COLYSEUS_SERVER_URL || "http://localhost:2567";

export function getProxiedAvatarUrl(photoUrl: string): string | null {
    if (!photoUrl) return null;

    return `${BACKEND_URL}/proxy-avatar?url=${encodeURIComponent(photoUrl)}`;
}