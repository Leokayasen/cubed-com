import { prisma } from "@/lib/server/prisma";
import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE_NAME = "cubed_session";
const SESSION_TTL_DAYS = 30;

function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
    return randomBytes(32).toString("hex");
}

export function getSessionExpiryDate(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_TTL_DAYS);
    return expiresAt;
}

export async function createSession(params: {
    accountId: string;
    sourceIp: string | null;
    userAgent: string | null;
}): Promise<{ token: string; expiresAt: Date }> {
    const token = createSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = getSessionExpiryDate();

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
                    reserveCubedUsername: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!session) return null;

    if (session.expiresAt.getTime() < Date.now()) {
        await prisma.userSession.delete({ where: { id: session.id } });
        return null;
    }

    return {
        sessionId: session.id,
        account: session.account,
        expiresAt: session.expiresAt,
    };
}


export function getSessionTokenFromCookieHeader(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    const entry = cookieHeader
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));

    if (!entry) return null;
    return entry.split("=").slice(1).join("=") || null;
}

