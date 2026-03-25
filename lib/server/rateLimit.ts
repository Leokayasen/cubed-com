// ---------------------------------------------------------------------------
// Rate limiting via Upstash Redis
//
// Setup:
//   npm install @upstash/ratelimit @upstash/redis
//   Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env
//   Get these from: https://console.upstash.com
//
// Falls back to a no-op (always allows) if env vars are missing,
// so development works without Redis configured.
// ---------------------------------------------------------------------------

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazily initialised so missing env vars don't crash the import.
let _redis: Redis | null = null;
let _limiters: Map<string, Ratelimit> = new Map();

function getRedis(): Redis | null {
    if (_redis) return _redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        if (process.env.NODE_ENV === "production") {
            console.error("Upstash Redis env vars are not set — rate limiting is disabled!");
        }
        return null;
    }

    _redis = new Redis({ url, token });
    return _redis;
}

type RateLimitConfig = {
    requests: number;
    windowSeconds: number;
};

function getLimiter(key: string, config: RateLimitConfig): Ratelimit | null {
    const redis = getRedis();
    if (!redis) return null;

    const cacheKey = `${key}:${config.requests}:${config.windowSeconds}`;
    if (!_limiters.has(cacheKey)) {
        _limiters.set(
            cacheKey,
            new Ratelimit({
                redis,
                limiter: Ratelimit.slidingWindow(config.requests, `${config.windowSeconds}s`),
                prefix: `rl:${key}`,
            })
        );
    }

    return _limiters.get(cacheKey)!;
}

export type RateLimitResult =
    | { allowed: true }
    | { allowed: false; retryAfterSeconds: number };

/**
 * Rate limit by a string identifier (e.g. IP address or account ID).
 *
 * @param identifier  Unique key for the actor (IP, accountId, etc.)
 * @param limiterName Logical name for the limiter (e.g. "register", "login")
 * @param config      Max requests and window size
 */
export async function rateLimit(
    identifier: string,
    limiterName: string,
    config: RateLimitConfig
): Promise<RateLimitResult> {
    const limiter = getLimiter(limiterName, config);

    // No Redis configured — allow all (dev fallback)
    if (!limiter) return { allowed: true };

    const result = await limiter.limit(identifier);

    if (result.success) return { allowed: true };

    const retryAfterSeconds = Math.ceil((result.reset - Date.now()) / 1000);
    return { allowed: false, retryAfterSeconds };
}

// ---------------------------------------------------------------------------
// Pre-configured limiters for each endpoint
// ---------------------------------------------------------------------------

export const RateLimits = {
    register: { requests: 5, windowSeconds: 60 },
    login: { requests: 8, windowSeconds: 60 },
    profileReserve: { requests: 5, windowSeconds: 60 },
    verifyEmail: { requests: 5, windowSeconds: 60 },
    resendVerification: { requests: 3, windowSeconds: 300 },
    passwordReset: { requests: 3, windowSeconds: 300 },
    redeem: { requests: 10, windowSeconds: 60 },
    adminKeyGen: { requests: 50, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitConfig>;
