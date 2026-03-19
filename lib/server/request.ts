type RateLimitResult = {
    allowed: boolean;
    remaining: number;
    resetAt: number;
};

type Bucket = {
    count: number;
    resetAt: number;
};

const memoryStore = new Map<string, Bucket>();

export function getRequestMeta(request: Request): {
    ip: string | null;
    userAgent: string | null;
    idempotencyKey: string | null;
} {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");

    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || null;
    return {
        ip,
        userAgent: request.headers.get("user-agent"),
        idempotencyKey: request.headers.get("x-idempotency-key"),
    };
}

export function rateLimitByKey(
    key: string,
    limit: number,
    windowMs: number,
    now = Date.now()
): RateLimitResult {
    const bucket = memoryStore.get(key);

    if (!bucket || now >= bucket.resetAt) {
        const resetAt = now + windowMs;
        memoryStore.set(key, { count: 1, resetAt });
        return { allowed: true, remaining: Math.max(limit - 1, 0), resetAt };
    }

    if (bucket.count >= limit) {
        return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
    }

    bucket.count += 1;
    memoryStore.set(key, bucket);

    return {
        allowed: true,
        remaining: Math.max(limit - bucket.count, 0),
        resetAt: bucket.resetAt,
    };
}

