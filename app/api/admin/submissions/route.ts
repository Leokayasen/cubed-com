import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function isAuthorized(request: Request): boolean {
    const adminToken = process.env.ADMIN_API_TOKEN;
    if (!adminToken) return false;

    const token = request.headers.get("x-admin-token");
    return token === adminToken;
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limitRaw = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
    const limit = Number.isFinite(limitRaw)
        ? Math.min(Math.max(Math.floor(limitRaw), 1), MAX_LIMIT)
        : DEFAULT_LIMIT;

    if (type === "playtest") {
        const submissions = await prisma.playtestSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json({ type: "playtest", submissions });
    }

    if (type === "feedback") {
        const submissions = await prisma.feedbackSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json({ type: "feedback", submissions });
    }

    if (type === "profiles") {
        const submissions = await prisma.accountProfile.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json({ type: "profiles", submissions });
    }

    if (type === "accounts") {
        const submissions = await prisma.userAccount.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                email: true,
                username: true,
                reserveCubedUsername: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ type: "accounts", submissions });
    }

    const [playtest, feedback, profiles, accounts] = await Promise.all([
        prisma.playtestSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        }),
        prisma.feedbackSubmission.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        }),
        prisma.accountProfile.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        }),
        prisma.userAccount.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                id: true,
                email: true,
                username: true,
                reserveCubedUsername: true,
                createdAt: true,
            },
        }),
    ]);

    return NextResponse.json({ playtest, feedback, profiles, accounts });
}

