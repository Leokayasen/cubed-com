export const FEEDBACK_CATEGORIES = ["Gameplay", "Quality of Life", "UI", "Performance"] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export type FeedbackSuggestion = {
    id: string;
    title: string;
    description: string;
    category: FeedbackCategory;
    status: "Planned" | "Under Review" | "Considering";
    votes: number;
};

export type FeedbackSubmission = {
    title: string;
    category: FeedbackCategory;
    details: string;
    email: string;
    website: string;
};

export type FeedbackValidationResult =
    | { ok: true; data: FeedbackSubmission }
    | { ok: false; error: string };

const TITLE_MAX_LENGTH = 80;
const DETAILS_MAX_LENGTH = 500;
const EMAIL_MAX_LENGTH = 120;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: unknown): string {
    if (typeof value !== "string") return "";
    return value.trim();
}

export function validateFeedbackSubmission(payload: unknown): FeedbackValidationResult {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const title = normalizeString(body.title);
    const category = normalizeString(body.category);
    const details = normalizeString(body.details);
    const email = normalizeString(body.email).toLowerCase();
    const website = normalizeString(body.website);

    if (title.length < 4 || title.length > TITLE_MAX_LENGTH) {
        return { ok: false, error: "Title must be between 4 and 80 characters." };
    }

    if (!FEEDBACK_CATEGORIES.includes(category as FeedbackCategory)) {
        return { ok: false, error: "Please select a valid category." };
    }

    if (details.length < 10 || details.length > DETAILS_MAX_LENGTH) {
        return { ok: false, error: "Details must be between 10 and 500 characters." };
    }

    if (email.length > EMAIL_MAX_LENGTH || (email.length > 0 && !EMAIL_PATTERN.test(email))) {
        return { ok: false, error: "Please enter a valid email address or leave it blank." };
    }

    if (website.length > 0) {
        return { ok: false, error: "Spam detected." };
    }

    return {
        ok: true,
        data: {
            title,
            category: category as FeedbackCategory,
            details,
            email,
            website,
        },
    };
}

export function buildFeedbackDiscordMessage(data: FeedbackSubmission): string {
    return [
        "**New Feedback Submission**",
        `**Title:** ${data.title}`,
        `**Category:** ${data.category}`,
        `**Details:** ${data.details}`,
        `**Email:** ${data.email || "(not provided)"}`,
    ].join("\n");
}

export const feedbackSuggestions: FeedbackSuggestion[] = [
    {
        id: "vote-kick-preview",
        title: "In-game vote kick preview",
        description: "Show vote-kick context and a short reason before players cast a vote.",
        category: "UI",
        status: "Under Review",
        votes: 61,
    },
    {
        id: "controller-remap",
        title: "Controller remapping",
        description: "Allow full remapping for movement, building, and quick-select actions.",
        category: "Quality of Life",
        status: "Planned",
        votes: 114,
    },
    {
        id: "faster-world-join",
        title: "Faster world join time",
        description: "Reduce loading delay when joining friends and persistent worlds.",
        category: "Performance",
        status: "Considering",
        votes: 89,
    },
    {
        id: "creative-copy-tool",
        title: "Creative copy/paste tool",
        description: "Add a simple region copy tool for quick prototyping in creative mode.",
        category: "Gameplay",
        status: "Under Review",
        votes: 73,
    },
    {
        id: "inventory-search",
        title: "Inventory search bar",
        description: "Add type-to-filter search in inventory and crafting menus.",
        category: "Quality of Life",
        status: "Planned",
        votes: 97,
    },
    {
        id: "biome-visibility",
        title: "Biome visibility in map",
        description: "Show discovered biome overlays and waypoints in the world map.",
        category: "UI",
        status: "Considering",
        votes: 52,
    },
];

