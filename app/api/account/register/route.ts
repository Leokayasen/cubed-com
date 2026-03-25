// POST /api/account/register
import { hashPassword, normalizeEmail, normalizeUsername, validateAccountRegistration } from "@/lib/account";
import { createEmailVerificationToken, createSession, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { sendVerificationEmail } from "@/lib/server/email";
import { prisma } from "@/lib/server/prisma";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

function mapDbError(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return { status: 409, body: { error: "That email or username is already in use." } };
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

    const rl = await rateLimit(meta.ip ?? "unknown", "register", RateLimits.register);
    if (!rl.allowed) {
        return NextResponse.json(
            { error: "Too many requests. Please wait a moment and try again." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
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

    const { username, email, password, reserveCubedUsername } = parsed.data;
    const usernameNormalized = normalizeUsername(username);
    const emailNormalized = normalizeEmail(email);

    try {
        const passwordHash = await hashPassword(password);

        // All conflict checks and writes happen inside a single transaction.
        // The unique constraints on the schema are the true source of correctness —
        // the explicit checks here just provide friendlier error messages.
        const account = await prisma.$transaction(async (tx) => {
            const [byEmail, byUsername] = await Promise.all([
                tx.userAccount.findUnique({ where: { emailNormalized }, select: { id: true } }),
                tx.userAccount.findUnique({ where: { usernameNormalized }, select: { id: true } }),
            ]);

            if (byEmail) {
                throw Object.assign(new Error("EMAIL_IN_USE"), { status: 409 });
            }
            if (byUsername) {
                throw Object.assign(new Error("USERNAME_IN_USE"), { status: 409 });
            }

            if (reserveCubedUsername) {
                const reserved = await tx.accountProfile.findUnique({
                    where: { usernameNormalized },
                    select: { id: true, emailNormalized: true, accountId: true },
                });

                // If reserved by a different email, block.
                if (reserved && reserved.emailNormalized !== emailNormalized) {
                    throw Object.assign(new Error("USERNAME_RESERVED"), { status: 409 });
                }
            }

            const newAccount = await tx.userAccount.create({
                data: {
                    email,
                    emailNormalized,
                    username,
                    usernameNormalized,
                    passwordHash,
                    reserveCubedUsername,
                },
            });

            if (reserveCubedUsername) {
                const existing = await tx.accountProfile.findUnique({
                    where: { usernameNormalized },
                    select: { id: true },
                });

                if (existing) {
                    await tx.accountProfile.update({
                        where: { id: existing.id },
                        data: { accountId: newAccount.id },
                    });
                } else {
                    await tx.accountProfile.create({
                        data: {
                            username,
                            usernameNormalized,
                            emailNormalized,
                            accountId: newAccount.id,
                            sourceIp: meta.ip,
                            userAgent: meta.userAgent,
                        },
                    });
                }
            }

            return newAccount;
        });

        // Generate verification token and send email (outside transaction — non-fatal if it fails)
        let verificationSent = false;
        try {
            const verifyToken = await createEmailVerificationToken(account.id);
            await sendVerificationEmail({ to: email, username, token: verifyToken });
            verificationSent = true;
        } catch (emailError) {
            console.error("Failed to send verification email after registration", emailError);
        }

        // Don't create a session yet — account must be verified first.
        return NextResponse.json(
            {
                ok: true,
                requiresVerification: true,
                verificationSent,
                account: {
                    id: account.id,
                    username: account.username,
                    email: account.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error?.message === "EMAIL_IN_USE") {
            return NextResponse.json(
                { error: "An account already exists for this email. Try logging in." },
                { status: 409 }
            );
        }
        if (error?.message === "USERNAME_IN_USE") {
            return NextResponse.json(
                { error: "That username is already in use. Try another one." },
                { status: 409 }
            );
        }
        if (error?.message === "USERNAME_RESERVED") {
            return NextResponse.json(
                { error: "That username is already reserved. Try another one." },
                { status: 409 }
            );
        }

        console.error("Account registration failed", error);
        const mapped = mapDbError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}
