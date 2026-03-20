import { validateUsername } from "@/lib/account";
import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") ?? "";

    const validated = validateUsername(username);
    if (!validated.ok) {
        return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const existing = await prisma.accountProfile.findUnique({
        where: {
            usernameNormalized: validated.normalized,
        },
        select: { id: true },
    });

    const existingAccount = await prisma.userAccount.findUnique({
        where: {
            usernameNormalized: validated.normalized,
        },
        select: { id: true },
    });

    return NextResponse.json({
        ok: true,
        available: !existing && !existingAccount,
        normalized: validated.normalized,
    });
}

