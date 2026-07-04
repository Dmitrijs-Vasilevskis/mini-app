import type { NextFunction, Request, Response } from "express";
import { HTTP_RATE_LIMIT_WINDOW_MS } from "../game/constants";

type RateLimitOptions = {
    windowMs?: number;
    max: number;
    keyFn?: (req: Request) => string;
};

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const hitCounts = new Map<string, RateLimitEntry>();

function getClientKey(req: Request): string {
    return req.ip || req.socket.remoteAddress || "unknown";
}

function pruneExpiredEntries(now: number) {
    for (const [key, entry] of hitCounts) {
        if (now >= entry.resetAt) {
            hitCounts.delete(key);
        }
    }
}

export function rateLimit({
    windowMs = HTTP_RATE_LIMIT_WINDOW_MS,
    max,
    keyFn = getClientKey,
}: RateLimitOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        const now = Date.now();

        if (hitCounts.size > 10_000) {
            pruneExpiredEntries(now);
        }

        const key = keyFn(req);
        let entry = hitCounts.get(key);

        if (!entry || now >= entry.resetAt) {
            entry = {
                count: 0,
                resetAt: now + windowMs,
            };
            hitCounts.set(key, entry);
        }

        entry.count++;

        if (entry.count > max) {
            res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
            return res.status(429).send("Too many requests");
        }

        return next();
    };
}
