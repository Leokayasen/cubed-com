// POST /api/account/login
import { normalizeEmail, validateAccountLogin, verifyPassword } from "@/lib/account";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

function mapDbError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
        return { status: 503, body: { error: "Database is not ready. Please try again shortly." } };
    }
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return { status: 503, body: { error: "Database connection failed. Please try again shortly." } };
    }
    return { status: 500, body: { error: "Unexpected server error." } };
}

export async function POST(request: Request) {
    const meta = getRequestMeta(request);

    const rl = await rateLimit(meta.ip ?? "unknown", "login", RateLimits.login);
    if (!rl.allowed) {
        return NextResponse.json(
            { error: "Too many login attempts. Please wait a moment and try again." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
        );
    }

    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const parsed = validateAccountLogin(payload);
    if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    try {
        const emailNormalized = normalizeEmail(parsed.data.email);
        const account = await prisma.userAccount.findUnique({ where: { emailNormalized } });

        // Always run verifyPassword even if account is null to prevent timing attacks.
        const dummyHash = "scrypt$16384$8$1$deadbeefdeadbeef$deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";
        const validPassword = account
            ? await verifyPassword(parsed.data.password, account.passwordHash)
            : await verifyPassword(parsed.data.password, dummyHash).then(() => false);

        if (!account || !validPassword) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        // Gate on email verification
        if (!account.emailVerified) {
            return NextResponse.json(
                {
                    error: "Please verify your email address before signing in.",
                    requiresVerification: true,
                    // Include account ID so the client can offer a resend button
                    accountId: account.id,
                },
                { status: 403 }
            );
        }

        const session = await createSession({
            accountId: account.id,
            sourceIp: meta.ip,
            userAgent: meta.userAgent,
        });

        const response = NextResponse.json({
            ok: true,
            account: {
                id: account.id,
                username: account.username,
                email: account.email,
                role: account.role,
                reserveCubedUsername: account.reserveCubedUsername,
            },
        });

        response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: session.token,
            httpOnly: true,
            secure: true, // __Host- prefix requires secure
            sameSite: "lax",
            path: "/",
            expires: session.expiresAt,
        });

        return response;
    } catch (error) {
        console.error("Login failed", error);
        const mapped = mapDbError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}
