// POST /api/account/reserve
// Reserves a Cubed in-game username before full registration.
import { normalizeEmail, normalizeUsername, validateAccountProfileReservation } from "@/lib/account";
import { prisma } from "@/lib/server/prisma";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

function mapDbError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return { status: 409, body: { error: "That username is already reserved." } };
    }
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

    const rl = await rateLimit(meta.ip ?? "unknown", "profileReserve", RateLimits.profileReserve);
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

    const parsed = validateAccountProfileReservation(payload);
    if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    // Always use normalised email for storage and lookups
    const emailNormalized = normalizeEmail(parsed.data.email);
    const usernameNormalized = normalizeUsername(parsed.data.username);

    try {
        const existingByEmail = await prisma.accountProfile.findUnique({
            where: { emailNormalized },
        });

        if (existingByEmail) {
            // Same email, same username — idempotent
            if (existingByEmail.usernameNormalized === usernameNormalized) {
                return NextResponse.json({
                    ok: true,
                    existing: true,
                    profile: {
                        id: existingByEmail.id,
                        username: existingByEmail.username,
                        email: existingByEmail.emailNormalized,
                        createdAt: existingByEmail.createdAt,
                    },
                });
            }

            return NextResponse.json(
                { error: "This email already has a reserved username. Contact support to change it." },
                { status: 409 }
            );
        }

        const existingByUsername = await prisma.accountProfile.findUnique({
            where: { usernameNormalized },
            select: { id: true },
        });

        if (existingByUsername) {
            return NextResponse.json({ error: "That username is already reserved." }, { status: 409 });
        }

        const profile = await prisma.accountProfile.create({
            data: {
                username: parsed.data.username,
                usernameNormalized,
                emailNormalized,
                sourceIp: meta.ip,
                userAgent: meta.userAgent,
            },
        });

        return NextResponse.json({
            ok: true,
            profile: {
                id: profile.id,
                username: profile.username,
                email: profile.emailNormalized,
                createdAt: profile.createdAt,
            },
        });
    } catch (error) {
        console.error("Profile reservation failed", error);
        const mapped = mapDbError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}
