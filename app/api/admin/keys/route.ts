// POST /api/admin/keys/generate
// Body: { count: number; keyType?: "GAME" | "PLAYTEST" | "DLC"; note?: string }
// Requires: ADMIN role
//
// Also supports:
// GET /api/admin/keys — list all keys with redemption status
import { getAccountFromSessionToken, getSessionTokenFromCookieHeader } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { rateLimit, RateLimits } from "@/lib/server/ratelimit";
import { getRequestMeta } from "@/lib/server/request";
import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

const KEY_TYPES = ["GAME", "PLAYTEST", "DLC"] as const;
type KeyType = typeof KEY_TYPES[number];

function generateKeyCode(): string {
    // Format: XXXX-XXXX-XXXX-XXXX (uppercase alphanumeric, no ambiguous chars)
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0,O,1,I
    const segment = () =>
        Array.from({ length: 4 }, () => chars[randomBytes(1)[0] % chars.length]).join("");
    return [segment(), segment(), segment(), segment()].join("-");
}

function hashKeyCode(code: string): string {
    return createHash("sha256").update(code.toUpperCase().trim()).digest("hex");
}

async function requireAdmin(request: Request) {
    const token = getSessionTokenFromCookieHeader(request.headers.get("cookie"));
    if (!token) return null;

    const session = await getAccountFromSessionToken(token);
    if (!session || session.account.role !== "ADMIN") return null;

    return session;
}

export async function POST(request: Request) {
    const meta = getRequestMeta(request);

    const session = await requireAdmin(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const rl = await rateLimit(session.account.id, "adminKeyGen", RateLimits.adminKeyGen);
    if (!rl.allowed) {
        return NextResponse.json(
            { error: "Rate limit exceeded." },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
        );
    }

    let payload: unknown;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const body = payload as Record<string, unknown>;
    const count = typeof body.count === "number" ? Math.floor(body.count) : 1;
    const keyType: KeyType = KEY_TYPES.includes(body.keyType as any) ? (body.keyType as KeyType) : "GAME";
    const note = typeof body.note === "string" ? body.note.slice(0, 200) : null;

    if (count < 1 || count > 500) {
        return NextResponse.json({ error: "Count must be between 1 and 500." }, { status: 400 });
    }

    // Generate codes, ensuring no hash collisions with existing keys
    const codes: string[] = [];
    const hashes: string[] = [];

    while (codes.length < count) {
        const code = generateKeyCode();
        const hash = hashKeyCode(code);

        const exists = await prisma.gameKey.findUnique({
            where: { codeHash: hash },
            select: { id: true },
        });

        if (!exists) {
            codes.push(code);
            hashes.push(hash);
        }
    }

    await prisma.gameKey.createMany({
        data: hashes.map((codeHash) => ({ codeHash, keyType, note })),
    });

    // Return raw codes — these are shown once only. Admin must save them.
    return NextResponse.json({
        ok: true,
        count: codes.length,
        keyType,
        note,
        // Raw codes returned here — never stored, show once
        codes,
    });
}

export async function GET(request: Request) {
    const session = await requireAdmin(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "50")));
    const keyType = searchParams.get("type") ?? undefined;

    const [keys, total] = await Promise.all([
        prisma.gameKey.findMany({
            where: keyType ? { keyType } : undefined,
            include: {
                redemption: {
                    select: {
                        redeemedAt: true,
                        account: { select: { id: true, username: true, email: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.gameKey.count({ where: keyType ? { keyType } : undefined }),
    ]);

    return NextResponse.json({
        ok: true,
        total,
        page,
        limit,
        keys: keys.map((k) => ({
            id: k.id,
            keyType: k.keyType,
            note: k.note,
            createdAt: k.createdAt,
            redeemed: !!k.redemption,
            redeemedAt: k.redemption?.redeemedAt ?? null,
            redeemedBy: k.redemption?.account ?? null,
            // codeHash is intentionally NOT returned — codes are write-once
        })),
    });
}
