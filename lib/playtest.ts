export const PLAYTEST_PLATFORMS = [
    "PC",
    "Mobile",
    "Other",
] as const;

export type PlaytestPlatform = (typeof PLAYTEST_PLATFORMS)[number];

export type PlaytestSubmission = {
    name: string;
    email: string;
    discord: string;
    platform: PlaytestPlatform;
    notes: string;
    // Honeypot field. Real users never see this.
    website: string;
};

export type ValidationResult =
    | { ok: true; data: PlaytestSubmission }
    | { ok: false; error: string };

const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 120;
const DISCORD_MAX_LENGTH = 80;
const NOTES_MAX_LENGTH = 600;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: unknown): string {
    if (typeof value !== "string") return "";
    return value.trim();
}

export function validatePlaytestSubmission(payload: unknown): ValidationResult {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;

    const name = normalizeString(body.name);
    const email = normalizeString(body.email).toLowerCase();
    const discord = normalizeString(body.discord);
    const platform = normalizeString(body.platform);
    const notes = normalizeString(body.notes);
    const website = normalizeString(body.website);

    if (name.length < 2 || name.length > NAME_MAX_LENGTH) {
        return { ok: false, error: "Please enter a valid name." };
    }

    if (email.length === 0 || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    if (discord.length > DISCORD_MAX_LENGTH) {
        return { ok: false, error: "Discord handle is too long." };
    }

    if (!PLAYTEST_PLATFORMS.includes(platform as PlaytestPlatform)) {
        return { ok: false, error: "Please select a supported platform." };
    }

    if (notes.length > NOTES_MAX_LENGTH) {
        return { ok: false, error: "Notes are too long." };
    }

    if (website.length > 0) {
        return { ok: false, error: "Spam detected." };
    }

    return {
        ok: true,
        data: {
            name,
            email,
            discord,
            platform: platform as PlaytestPlatform,
            notes,
            website,
        },
    };
}

export function buildPlaytestDiscordMessage(data: PlaytestSubmission): string {
    return [
        "**New Playtest Application**",
        `**Name:** ${data.name}`,
        `**Email:** ${data.email}`,
        `**Discord:** ${data.discord || "(not provided)"}`,
        `**Platform:** ${data.platform}`,
        `**Notes:** ${data.notes || "(none)"}`,
    ].join("\n");
}

