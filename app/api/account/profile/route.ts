import {
    normalizeUsername,
    validateAccountProfileReservation,
} from "@/lib/account";
import { prisma } from "@/lib/server/prisma";
import { getRequestMeta, rateLimitByKey } from "@/lib/server/request";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function mapApiError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return {
            status: 409,
            body: { error: "That username is already reserved." },
        };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
        return {
            status: 503,
            body: { error: "Database tables are not ready yet. Please try again shortly." },
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
    const rateKey = `account-profile:${meta.ip ?? "unknown"}`;
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

    const parsed = validateAccountProfileReservation(payload);
    if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(parsed.data.username);

    try {
        const existingByEmail = await prisma.accountProfile.findUnique({
            where: { email: parsed.data.email },
        });

        if (existingByEmail) {
            if (existingByEmail.usernameNormalized === normalizedUsername) {
                return NextResponse.json({
                    ok: true,
                    existing: true,
                    profile: {
                        id: existingByEmail.id,
                        username: existingByEmail.username,
                        email: existingByEmail.email,
                        createdAt: existingByEmail.createdAt,
                    },
                });
            }

            return NextResponse.json(
                {
                    error:
                        "This email already has a reserved username. Contact support to change ownership.",
                },
                { status: 409 }
            );
        }

        const existingByUsername = await prisma.accountProfile.findUnique({
            where: { usernameNormalized: normalizedUsername },
            select: { id: true },
        });

        if (existingByUsername) {
            return NextResponse.json({ error: "That username is already reserved." }, { status: 409 });
        }

        const profile = await prisma.accountProfile.create({
            data: {
                username: parsed.data.username,
                usernameNormalized: normalizedUsername,
                email: parsed.data.email,
                sourceIp: meta.ip,
                userAgent: meta.userAgent,
            },
        });

        return NextResponse.json({
            ok: true,
            profile: {
                id: profile.id,
                username: profile.username,
                email: profile.email,
                createdAt: profile.createdAt,
            },
        });
    } catch (error) {
        console.error("Account profile reservation failed", error);
        const mapped = mapApiError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}

