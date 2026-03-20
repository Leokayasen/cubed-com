import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export type AccountProfileReservation = {
    username: string;
    email: string;
};

export type AccountRegistration = {
    username: string;
    email: string;
    password: string;
    reserveCubedUsername: boolean;
};

export type AccountLogin = {
    email: string;
    password: string;
};

export type AccountProfileValidationResult =
    | { ok: true; data: AccountProfileReservation }
    | { ok: false; error: string };

export type AccountRegistrationValidationResult =
    | { ok: true; data: AccountRegistration }
    | { ok: false; error: string };

export type AccountLoginValidationResult =
    | { ok: true; data: AccountLogin }
    | { ok: false; error: string };

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const EMAIL_MAX_LENGTH = 120;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LEN = 64;

const RESERVED_USERNAMES = new Set([
    "admin",
    "administrator",
    "api",
    "cubed",
    "moderator",
    "root",
    "support",
    "system",
]);

function normalizeString(value: unknown): string {
    if (typeof value !== "string") return "";
    return value.trim();
}

function normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
}

export function normalizeUsername(value: string): string {
    return value.trim().toLowerCase();
}

export function validateUsername(usernameInput: string): { ok: true; normalized: string } | { ok: false; error: string } {
    const username = normalizeString(usernameInput);
    const normalized = normalizeUsername(username);

    if (normalized.length < USERNAME_MIN_LENGTH || normalized.length > USERNAME_MAX_LENGTH) {
        return {
            ok: false,
            error: "Username must be between 3 and 20 characters.",
        };
    }

    if (!USERNAME_PATTERN.test(normalized)) {
        return {
            ok: false,
            error: "Username can only include letters, numbers, and underscores.",
        };
    }

    if (normalized.startsWith("_") || normalized.endsWith("_")) {
        return {
            ok: false,
            error: "Username cannot start or end with an underscore.",
        };
    }

    if (RESERVED_USERNAMES.has(normalized)) {
        return {
            ok: false,
            error: "That username is reserved.",
        };
    }

    return { ok: true, normalized };
}

export function validateAccountProfileReservation(
    payload: unknown
): AccountProfileValidationResult {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const username = normalizeString(body.username);
    const email = normalizeString(body.email).toLowerCase();

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.ok) {
        return { ok: false, error: usernameValidation.error };
    }

    if (email.length === 0 || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    return {
        ok: true,
        data: {
            username,
            email,
        },
    };
}

function validatePasswordPolicy(passwordInput: string): { ok: true } | { ok: false; error: string } {
    const password = passwordInput;

    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
        return {
            ok: false,
            error: "Password must be between 8 and 72 characters.",
        };
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return {
            ok: false,
            error: "Password must include uppercase, lowercase, and a number.",
        };
    }

    return { ok: true };
}

export function validateAccountRegistration(
    payload: unknown
): AccountRegistrationValidationResult {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const username = normalizeString(body.username);
    const email = normalizeEmail(normalizeString(body.email));
    const password = typeof body.password === "string" ? body.password : "";
    const reserveCubedUsername = Boolean(body.reserveCubedUsername);

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.ok) {
        return { ok: false, error: usernameValidation.error };
    }

    if (email.length === 0 || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    const passwordValidation = validatePasswordPolicy(password);
    if (!passwordValidation.ok) {
        return { ok: false, error: passwordValidation.error };
    }

    return {
        ok: true,
        data: {
            username,
            email,
            password,
            reserveCubedUsername,
        },
    };
}

export function validateAccountLogin(payload: unknown): AccountLoginValidationResult {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const email = normalizeEmail(normalizeString(body.email));
    const password = typeof body.password === "string" ? body.password : "";

    if (email.length === 0 || email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    if (password.length < 1 || password.length > PASSWORD_MAX_LENGTH) {
        return { ok: false, error: "Invalid email or password." };
    }

    return {
        ok: true,
        data: {
            email,
            password,
        },
    };
}

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = scryptSync(password, salt, SCRYPT_KEY_LEN, {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
    }) as Buffer;

    return [
        "scrypt",
        String(SCRYPT_N),
        String(SCRYPT_R),
        String(SCRYPT_P),
        salt.toString("hex"),
        derived.toString("hex"),
    ].join("$");
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
    const [algo, nRaw, rRaw, pRaw, saltHex, hashHex] = encodedHash.split("$");
    if (algo !== "scrypt") return false;
    if (!nRaw || !rRaw || !pRaw || !saltHex || !hashHex) return false;

    const n = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);

    if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, expected.length, {
        N: n,
        r,
        p,
    }) as Buffer;

    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
}

export function normalizeEmailForStorage(email: string): string {
    return normalizeEmail(email);
}

