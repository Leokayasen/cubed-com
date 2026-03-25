// POST /api/account/resend-verification
// Body: { accountId: string }
// Intentionally vague responses to avoid account enumeration.
import { createEmailVerificationToken } from "@/lib/server/auth";
import { sendVerificationEmail } from "@/lib/server/email";
import { prisma } from "@/lib/server/prisma";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { NextResponse } from "next/server";

const OK_RESPONSE = { ok: true, message: "If your account exists and is unverified, a new email has been sent." };

export async function POST(request: Request) {
    const meta = getRequestMeta(request);

    const rl = await rateLimit(meta.ip ?? "unknown", "resendVerification", RateLimits.resendVerification);
    if (!rl.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a few minutes." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
        );
    }

    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const accountId = typeof (payload as any)?.accountId === "string"
        ? (payload as any).accountId.trim()
        : "";

    if (!accountId) {
        // Still return OK to avoid enumeration
        return NextResponse.json(OK_RESPONSE);
    }

    const account = await prisma.userAccount.findUnique({
        where: { id: accountId },
        select: { id: true, email: true, username: true, emailVerified: true },
    });

    // Return OK regardless of whether account exists
    if (!account || account.emailVerified) {
        return NextResponse.json(OK_RESPONSE);
    }

    try {
        const token = await createEmailVerificationToken(account.id);
        await sendVerificationEmail({ to: account.email, username: account.username, token });
    } catch (err) {
        console.error("Failed to resend verification email", err);
        // Still return OK — don't leak whether the account exists
    }

    return NextResponse.json(OK_RESPONSE);
}
