import { normalizeEmailForStorage, validateAccountLogin, verifyPassword } from "@/lib/account";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { getRequestMeta, rateLimitByKey } from "@/lib/server/request";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;

function mapApiError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
        return {
            status: 503,
            body: { error: "Database tables are not ready yet. Please try again shortly." },
        };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
            status: 503,
            body: { error: "Login service is temporarily unavailable. Please try again shortly." },
        };
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        return {
            status: 503,
            body: { error: "Database connection failed. Please try again shortly." },
        };
    }

    return {
        status: 500,
        body: { error: "Unexpected server error." },
    };
}

export async function POST(request: Request) {
    const meta = getRequestMeta(request);
    const rateKey = `account-login:${meta.ip ?? "unknown"}`;
    const rateResult = rateLimitByKey(rateKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

    if (!rateResult.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a minute and try again." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)),
                },
            }
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
        const emailNormalized = normalizeEmailForStorage(parsed.data.email);
        const account = await prisma.userAccount.findUnique({
            where: { emailNormalized },
        });

        if (!account) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const validPassword = await verifyPassword(parsed.data.password, account.passwordHash);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
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
                reserveCubedUsername: account.reserveCubedUsername,
            },
        });

        response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: session.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: session.expiresAt,
        });

        return response;
    } catch (error) {
        console.error("Account login failed", error);
        const mapped = mapApiError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}

