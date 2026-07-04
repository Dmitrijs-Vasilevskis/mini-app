import { AVATAR_FETCH_TIMEOUT_MS, MAX_AVATAR_BYTES } from "../game/constants";

const ALLOWED_AVATAR_HOSTS = new Set([
    "t.me",
    "cdn4.cdn-telegram.org",
    "cdn1.cdn-telegram.org",
    "telegram.org"
]);
const ALLOWED_CONTENT_TYPE_PREFIX = "image/";

export function isAllowedAvatarUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);

        if (url.protocol !== "https:") {
            return false;
        }

        if (!ALLOWED_AVATAR_HOSTS.has(url.hostname)) {
            return false;
        }

        if (!url.pathname.startsWith("/i/userpic/")) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export async function fetchAvatar(urlString: string): Promise<{
    buffer: Buffer;
    contentType: string;
}> {
    const response = await fetch(urlString, {
        signal: AbortSignal.timeout(AVATAR_FETCH_TIMEOUT_MS),
        redirect: "follow",
    });

    if (!response.ok) {
        throw new Error(`Upstream returned ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType && !contentType.startsWith(ALLOWED_CONTENT_TYPE_PREFIX)) {
        throw new Error("Upstream response is not an image");
    }

    const contentLength = Number(response.headers.get("content-length"));

    if (contentLength && contentLength > MAX_AVATAR_BYTES) {
        throw new Error("Image too large");
    }

    const arrayBuffer = await response.arrayBuffer();

    if (arrayBuffer.byteLength > MAX_AVATAR_BYTES) {
        throw new Error("Image too large");
    }

    return {
        buffer: Buffer.from(arrayBuffer),
        contentType: contentType || "image/svg+xml",
    };
}
