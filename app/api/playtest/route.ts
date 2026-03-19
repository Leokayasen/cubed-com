import { buildPlaytestDiscordMessage, validatePlaytestSubmission } from "@/lib/playtest";
import { Prisma } from "@prisma/client";
import { sendDiscordMessage } from "@/lib/server/discord";
import { prisma } from "@/lib/server/prisma";
import { getRequestMeta, rateLimitByKey } from "@/lib/server/request";
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

function mapApiError(error: unknown) {
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
    const webhookUrl = process.env.DISCORD_PLAYTEST_WEBHOOK_URL;

    const meta = getRequestMeta(request);
    const rateKey = `playtest:${meta.ip ?? "unknown"}`;
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

    try {
        const parsed = validatePlaytestSubmission(payload);
        if (!parsed.ok) {
            if (parsed.error === "Spam detected.") {
                await prisma.playtestSubmission.create({
                    data: {
                        name: "spam",
                        email: "spam@local.invalid",
                        discord: "",
                        platform: "unknown",
                        notes: "honeypot tripped",
                        status: "SPAM_REJECTED",
                        sourceIp: meta.ip,
                        userAgent: meta.userAgent,
                        idempotencyKey: meta.idempotencyKey,
                    },
                });
                return NextResponse.json({ ok: true }, { status: 200 });
            }

            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const submission = await prisma.playtestSubmission.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                discord: parsed.data.discord,
                platform: parsed.data.platform,
                notes: parsed.data.notes,
                sourceIp: meta.ip,
                userAgent: meta.userAgent,
                idempotencyKey: meta.idempotencyKey,
            },
        });

        if (!webhookUrl) {
            await prisma.playtestSubmission.update({
                where: { id: submission.id },
                data: {
                    status: "NOTIFY_FAILED",
                    notifyError: "DISCORD_PLAYTEST_WEBHOOK_URL not configured",
                },
            });
            return NextResponse.json({ ok: true, id: submission.id, queued: true });
        }

        const webhookOk = await sendDiscordMessage(
            webhookUrl,
            buildPlaytestDiscordMessage(parsed.data)
        );

        if (!webhookOk) {
            await prisma.playtestSubmission.update({
                where: { id: submission.id },
                data: {
                    status: "NOTIFY_FAILED",
                    notifyError: "Discord webhook call failed",
                },
            });

            return NextResponse.json(
                { error: "Unable to submit application right now." },
                { status: 502 }
            );
        }

        await prisma.playtestSubmission.update({
            where: { id: submission.id },
            data: {
                status: "NOTIFIED",
                notifyError: null,
            },
        });

        return NextResponse.json({ ok: true, id: submission.id });
    } catch (error) {
        console.error("Playtest submission failed", error);
        const mapped = mapApiError(error);
        return NextResponse.json(mapped.body, { status: mapped.status });
    }
}

