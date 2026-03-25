import { prisma } from "@/lib/server/prisma";
import { createHash, randomBytes } from "node:crypto";

// __Host- prefix enforces: HTTPS only, no Domain attribute, Path must be /
// This is strictly more secure than a plain cookie name.
export const SESSION_COOKIE_NAME = "__Host-cubed_session";

const SESSION_TTL_DAYS = 30;
const VERIFY_TOKEN_TTL_HOURS = 24;
const PASSWORD_RESET_TOKEN_TTL_HOURS = 1;

function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
    return randomBytes(32).toString("hex");
}

function hoursFromNow(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function daysFromNow(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function createSession(params: {
    accountId: string;
    sourceIp: string | null;
    userAgent: string | null;
}): Promise<{ token: string; expiresAt: Date }> {
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = daysFromNow(SESSION_TTL_DAYS);

    await prisma.userSession.create({
        data: {
            accountId: params.accountId,
            tokenHash,
            expiresAt,
            sourceIp: params.sourceIp,
            userAgent: params.userAgent,
        },
    });

    return { token, expiresAt };
}

export async function deleteSessionByToken(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    await prisma.userSession.deleteMany({ where: { tokenHash } });
}

export async function deleteAllSessionsForAccount(accountId: string): Promise<void> {
    await prisma.userSession.deleteMany({ where: { accountId } });
}

export async function getAccountFromSessionToken(token: string) {
    const tokenHash = hashToken(token);

    const session = await prisma.userSession.findUnique({
        where: { tokenHash },
        include: {
            account: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                    role: true,
                    emailVerified: true,
                    reserveCubedUsername: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!session) return null;

    if (session.expiresAt.getTime() < Date.now()) {
        await prisma.userSession.delete({ where: { id: session.id } }).catch(() => {});
        return null;
    }

    return {
        sessionId: session.id,
        account: session.account,
        expiresAt: session.expiresAt,
    };
}

// Slide expiry forward if session is more than halfway through its TTL.
// Call this in middleware or the /api/auth/me route.
export async function refreshSessionIfNeeded(
    sessionId: string,
    currentExpiry: Date
): Promise<Date | null> {
    const halfTtlMs = (SESSION_TTL_DAYS * 24 * 60 * 60 * 1000) / 2;
    const remainingMs = currentExpiry.getTime() - Date.now();

    if (remainingMs > halfTtlMs) return null; // not yet time to refresh

    const newExpiry = daysFromNow(SESSION_TTL_DAYS);
    await prisma.userSession.update({
        where: { id: sessionId },
        data: { expiresAt: newExpiry },
    });

    return newExpiry;
}

export async function createEmailVerificationToken(accountId: string): Promise<string> {
    const token = generateToken();
    const tokenHash = hashToken(token);

    await prisma.userAccount.update({
        where: { id: accountId },
        data: {
            emailVerifyToken: tokenHash,
            emailVerifyExpiry: hoursFromNow(VERIFY_TOKEN_TTL_HOURS),
        },
    });

    return token; // raw token — send this in the email
}

export async function verifyEmailToken(token: string): Promise<
    | { ok: true; accountId: string }
    | { ok: false; reason: "not_found" | "expired" | "already_verified" }
> {
    const tokenHash = hashToken(token);

    const account = await prisma.userAccount.findFirst({
        where: { emailVerifyToken: tokenHash },
        select: { id: true, emailVerified: true, emailVerifyExpiry: true },
    });

    if (!account) return { ok: false, reason: "not_found" };
    if (account.emailVerified) return { ok: false, reason: "already_verified" };
    if (!account.emailVerifyExpiry || account.emailVerifyExpiry < new Date()) {
        return { ok: false, reason: "expired" };
    }

    await prisma.userAccount.update({
        where: { id: account.id },
        data: {
            emailVerified: true,
            emailVerifyToken: null,
            emailVerifyExpiry: null,
        },
    });

    return { ok: true, accountId: account.id };
}

export async function createPasswordResetToken(accountId: string): Promise<string> {
    const token = generateToken();
    const tokenHash = hashToken(token);

    await prisma.userAccount.update({
        where: { id: accountId },
        data: {
            passwordResetToken: tokenHash,
            passwordResetExpiry: hoursFromNow(PASSWORD_RESET_TOKEN_TTL_HOURS),
        },
    });

    return token;
}

export async function verifyPasswordResetToken(token: string): Promise<
    | { ok: true; accountId: string }
    | { ok: false; reason: "not_found" | "expired" }
> {
    const tokenHash = hashToken(token);

    const account = await prisma.userAccount.findFirst({
        where: { passwordResetToken: tokenHash },
        select: { id: true, passwordResetExpiry: true },
    });

    if (!account) return { ok: false, reason: "not_found" };
    if (!account.passwordResetExpiry || account.passwordResetExpiry < new Date()) {
        return { ok: false, reason: "expired" };
    }

    return { ok: true, accountId: account.id };
}

export async function clearPasswordResetToken(accountId: string): Promise<void> {
    await prisma.userAccount.update({
        where: { id: accountId },
        data: { passwordResetToken: null, passwordResetExpiry: null },
    });
}

export function getSessionTokenFromCookieHeader(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    const entry = cookieHeader
        .split(";")
        .map((p) => p.trim())
        .find((p) => p.startsWith(`${SESSION_COOKIE_NAME}=`));

    if (!entry) return null;
    return entry.split("=").slice(1).join("=") || null;
}

export function getSessionExpiryDate(): Date {
    return daysFromNow(SESSION_TTL_DAYS);
}
