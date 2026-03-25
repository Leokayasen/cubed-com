// POST /api/account/verify-email
// Body: { token: string }
import { verifyEmailToken } from "@/lib/server/auth";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const meta = getRequestMeta(request);

    const rl = await rateLimit(meta.ip ?? "unknown", "verifyEmail", RateLimits.verifyEmail);
    if (!rl.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a moment." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
        );
    }

    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const token = typeof (payload as any)?.token === "string" ? (payload as any).token.trim() : "";
    if (!token) {
        return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
    }

    const result = await verifyEmailToken(token);

    if (!result.ok) {
        const messages: Record<string, string> = {
            not_found: "This verification link is invalid.",
            expired: "This verification link has expired. Please request a new one.",
            already_verified: "This account is already verified. You can sign in.",
        };
        return NextResponse.json(
            { error: messages[result.reason] ?? "Verification failed." },
            { status: 400 }
        );
    }

    return NextResponse.json({ ok: true, accountId: result.accountId });
}
