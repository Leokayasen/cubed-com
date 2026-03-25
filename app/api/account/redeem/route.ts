// POST /api/account/redeem
// Body: { code: string }
// Requires: authenticated + verified account
import { getAccountFromSessionToken, getSessionTokenFromCookieHeader } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

function hashKeyCode(code: string): string {
    return createHash("sha256").update(code.toUpperCase().trim()).digest("hex");
}

export async function POST(request: Request) {
    const meta = getRequestMeta(request);

    // Auth check first
    const token = getSessionTokenFromCookieHeader(request.headers.get("cookie"));
    if (!token) {
        return NextResponse.json({ error: "You must be signed in to redeem a key." }, { status: 401 });
    }

    const session = await getAccountFromSessionToken(token);
    if (!session) {
        return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    }

    if (!session.account.emailVerified) {
        return NextResponse.json(
            { error: "Please verify your email address before redeeming a key." },
            { status: 403 }
        );
    }

    const rl = await rateLimit(session.account.id, "redeem", RateLimits.redeem);
    if (!rl.allowed) {
        return NextResponse.json(
            { error: "Too many redemption attempts. Please wait a moment." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
        );
    }

    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const rawCode = typeof (payload as any)?.code === "string" ? (payload as any).code.trim() : "";
    if (!rawCode || rawCode.length < 4 || rawCode.length > 64) {
        return NextResponse.json({ error: "Please enter a valid key code." }, { status: 400 });
    }

    const codeHash = hashKeyCode(rawCode);

    try {
        const result = await prisma.$transaction(async (tx) => {
            const key = await tx.gameKey.findUnique({
                where: { codeHash },
                include: { redemption: true },
            });

            if (!key) {
                throw Object.assign(new Error("KEY_NOT_FOUND"), { status: 404 });
            }

            if (key.redemption) {
                // Don't reveal who redeemed it
                throw Object.assign(new Error("KEY_ALREADY_REDEEMED"), { status: 409 });
            }

            // Check if this account already has a redemption of this type
            const existingRedemption = await tx.keyRedemption.findFirst({
                where: {
                    accountId: session.account.id,
                    key: { keyType: key.keyType },
                },
            });

            if (existingRedemption) {
                throw Object.assign(new Error("ALREADY_OWNS"), { status: 409 });
            }

            const redemption = await tx.keyRedemption.create({
                data: {
                    accountId: session.account.id,
                    keyId: key.id,
                },
            });

            return { redemption, keyType: key.keyType };
        });

        return NextResponse.json({
            ok: true,
            keyType: result.keyType,
            redeemedAt: result.redemption.redeemedAt,
        });
    } catch (error: any) {
        if (error?.message === "KEY_NOT_FOUND") {
            return NextResponse.json({ error: "That key code is invalid." }, { status: 404 });
        }
        if (error?.message === "KEY_ALREADY_REDEEMED") {
            return NextResponse.json({ error: "That key has already been redeemed." }, { status: 409 });
        }
        if (error?.message === "ALREADY_OWNS") {
            return NextResponse.json(
                { error: "You have already redeemed a key of this type." },
                { status: 409 }
            );
        }

        console.error("Key redemption failed", error);
        return NextResponse.json({ error: "Redemption failed. Please try again." }, { status: 500 });
    }
}
