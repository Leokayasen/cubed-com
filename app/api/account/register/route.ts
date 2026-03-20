import {
    hashPassword,
    normalizeEmailForStorage,
    normalizeUsername,
    validateAccountRegistration,
    verifyPassword,
} from "@/lib/account";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { getRequestMeta, rateLimitByKey } from "@/lib/server/request";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function mapApiError(error: unknown) {
    if (error instanceof Error && error.message === "RESERVATION_CONFLICT") {
        return {
            status: 409,
            body: { error: "That username is already reserved for Cubed." },
        };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return {
            status: 409,
            body: { error: "That email or username is already in use." },
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
    const rateKey = `account-register:${meta.ip ?? "unknown"}`;
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

    const parsed = validateAccountRegistration(payload);
    if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const usernameNormalized = normalizeUsername(parsed.data.username);
    const emailNormalized = normalizeEmailForStorage(parsed.data.email);

    try {
        const passwordHash = await hashPassword(parsed.data.password);

        const [existingByEmail, existingByUsername] = await Promise.all([
            prisma.userAccount.findUnique({
                where: { emailNormalized },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    passwordHash: true,
                    reserveCubedUsername: true,
                    createdAt: true,
                },
            }),
            prisma.userAccount.findUnique({
                where: { usernameNormalized },
                select: { id: true, email: true },
            }),
        ]);

        if (existingByEmail) {
            const samePassword = await verifyPassword(parsed.data.password, existingByEmail.passwordHash);

            if (!samePassword) {
                return NextResponse.json(
                    { error: "An account already exists for this email. Try logging in." },
                    { status: 409 }
                );
            }

            const session = await createSession({
                accountId: existingByEmail.id,
                sourceIp: meta.ip,
                userAgent: meta.userAgent,
            });

            const response = NextResponse.json({
                ok: true,
                existing: true,
                account: {
                    id: existingByEmail.id,
                    username: existingByEmail.username,
                    email: existingByEmail.email,
                    reserveCubedUsername: existingByEmail.reserveCubedUsername,
                    createdAt: existingByEmail.createdAt,
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
        }

        if (existingByUsername) {
            return NextResponse.json(
                { error: "That username is already in use. Try another one." },
                { status: 409 }
            );
        }

        if (parsed.data.reserveCubedUsername) {
            const existingReservation = await prisma.accountProfile.findUnique({
                where: { usernameNormalized },
                select: { id: true, email: true },
            });

            if (
                existingReservation &&
                normalizeEmailForStorage(existingReservation.email) !== emailNormalized
            ) {
                return NextResponse.json(
                    { error: "That username is already reserved for Cubed." },
                    { status: 409 }
                );
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            const account = await tx.userAccount.create({
                data: {
                    email: parsed.data.email,
                    emailNormalized,
                    username: parsed.data.username,
                    usernameNormalized,
                    passwordHash,
                    reserveCubedUsername: parsed.data.reserveCubedUsername,
                },
            });

            if (parsed.data.reserveCubedUsername) {
                const existingReservation = await tx.accountProfile.findUnique({
                    where: { usernameNormalized },
                    select: { id: true, email: true },
                });

                if (existingReservation && existingReservation.email !== parsed.data.email) {
                    if (normalizeEmailForStorage(existingReservation.email) !== emailNormalized) {
                    throw new Error("RESERVATION_CONFLICT");
                    }
                }

                if (!existingReservation) {
                    await tx.accountProfile.create({
                        data: {
                            username: parsed.data.username,
                            usernameNormalized,
                            email: parsed.data.email,
                            accountId: account.id,
                            sourceIp: meta.ip,
                            userAgent: meta.userAgent,
                        },
                    });
                } else {
                    await tx.accountProfile.update({
                        where: { id: existingReservation.id },
                        data: { accountId: account.id },
                    });
                }
            }

            return account;
        });

        try {
            const session = await createSession({
                accountId: result.id,
                sourceIp: meta.ip,
                userAgent: meta.userAgent,
            });

            const response = NextResponse.json({
                ok: true,
                account: {
                    id: result.id,
                    username: result.username,
                    email: result.email,
                    reserveCubedUsername: result.reserveCubedUsername,
                    createdAt: result.createdAt,
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
        } catch (sessionError) {
            // Account creation succeeded; avoid presenting a false negative.
            console.error("Session creation failed after account registration", sessionError);
            return NextResponse.json({
                ok: true,
                requiresLogin: true,
                account: {
                    id: result.id,
                    username: result.username,
                    email: result.email,
                    reserveCubedUsername: result.reserveCubedUsername,
                    createdAt: result.createdAt,
                },
            });
        }
    } catch (error) {
        console.error("Account registration failed", error);
        const mapped = mapApiError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}

