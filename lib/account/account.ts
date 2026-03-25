import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

export type AccountProfileReservation = {
    username: string;
    emailNormalized: string;
};

export type AccountRegistration = {
    username: string;
    email: string;
    emailNormalized: string;
    password: string;
    reserveCubedUsername: boolean;
};

export type AccountLogin = {
    email: string;
    emailNormalized: string;
    password: string;
};

export type AccountKeyRedemption = {
    code: string;
};

type Ok<T> = { ok: true; data: T };
type Err = { ok: false; error: string };
type Result<T> = Ok<T> | Err;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KEY_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const EMAIL_MAX = 120;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72;

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

export function normalizeKey(value: string): string {
    return value.trim().toLowerCase();
}

export function validateUsername(input: string): { ok: true; normalized: string } | { ok: false; error: string } {
    const normalized = normalizeUsername(input);

    if (normalized.length < USERNAME_MIN || normalized.length > USERNAME_MAX) {
        return { ok: false, error: `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`, };
    }

    if (!USERNAME_PATTERN.test(normalized)) {
        return { ok: false, error: "Username can only include letters, numbers, and underscores.", };
    }

    if (normalized.startsWith("_") || normalized.endsWith("_")) {
        return { ok: false, error: "Username cannot start or end with an underscore.", };
    }

    if (RESERVED_USERNAMES.has(normalized)) {
        return { ok: false, error: "That username is reserved.", };
    }

    return { ok: true, normalized };
}

export function validateAccountProfileReservation(payload: unknown): Result<AccountProfileReservation> {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const username = normalizeString(body.username);
    const emailNormalized = normalizeEmail(normalizeString(body.email));

    const usernameResult = validateUsername(username);
    if (!usernameResult.ok) return { ok: false, error: usernameResult.error };

    if (!emailNormalized || emailNormalized.length > EMAIL_MAX || !EMAIL_PATTERN.test(emailNormalized)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    return { ok: true, data: { username: usernameResult.normalized, emailNormalized } };
}

export function validateAccountRegistration(payload: unknown): Result<AccountRegistration> {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const username = normalizeString(body.username);
    const email = normalizeString(body.email);
    const emailNormalized = normalizeEmail(email);
    const password = typeof body.password === "string" ? body.password : "";
    const reserveCubedUsername = Boolean(body.reserveCubedUsername);

    const usernameResult = validateUsername(username);
    if (!usernameResult.ok) return { ok: false, error: usernameResult.error };

    if (!emailNormalized || emailNormalized.length > EMAIL_MAX || !EMAIL_PATTERN.test(emailNormalized)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) return { ok: false, error: passwordResult.error };

    return {
        ok: true,
        data: {
            username: usernameResult.normalized,
            email,
            emailNormalized,
            password,
            reserveCubedUsername,
        },
    };
}

export function validateAccountLogin(payload: unknown): Result<AccountLogin> {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const email = normalizeString(body.email);
    const emailNormalized = normalizeEmail(email);
    const password = typeof body.password === "string" ? body.password : "";

    if (!emailNormalized || emailNormalized.length > EMAIL_MAX || !EMAIL_PATTERN.test(emailNormalized)) {
        return { ok: false, error: "Please enter a valid email address." };
    }

    if (password.length < 1 || password.length > PASSWORD_MAX) {
        return { ok: false, error: "Invalid email or password" };
    }

    return { ok: true, data: { email, emailNormalized, password } };
}

export function validateKeyRedemption(payload: unknown): Result<AccountKeyRedemption> {
    if (!payload || typeof payload !== "object") {
        return { ok: false, error: "Invalid request body." };
    }

    const body = payload as Record<string, unknown>;
    const code = normalizeKey(normalizeString(body.code));

    if (!KEY_PATTERN.test(code)) {
        return { ok: false, error: "Invalid key format. Keys look like XXX-XXX-XXX-XXX." };
    }

    return { ok: true, data: { code } };
}

function validatePassword(password: string): { ok: true } | { ok: false; error: string } {
    if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
        return { ok: false, error: `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.` };
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return { ok: false, error: "Password must include uppercase, lowercase, and a number." };
    }

    return { ok: true };
}

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const derived = scryptSync(password, salt, SCRYPT_KEY_LEN, {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
    }) as Buffer;

    return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("hex"), derived.toString("hex")].join("$");
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
    const parts = encodedHash.split("$");
    if (parts.length !== 6) return false;
    const [algo, nRaw, rRaw, pRaw, saltHex, hashHex] = parts;

    if (algo !== "scrypt") return false;

    const n = Number(nRaw);
    const r = Number(rRaw);
    const p = Number(pRaw);
    if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, expected.length, { N: n, r, p }) as Buffer;

    if (actual.length !== expected.length) return false;
    return timingSafeEqual(actual, expected);
}

export function hashToken(value: string): string {
    return createHash("sha256").update(value).digest("hex");
}

export function generateToken(bytes = 32): string {
    return randomBytes(bytes).toString("hex");
}

export function generateGameKeyCode(): string {
    const segment = () => randomBytes(2).toString("hex").toUpperCase().slice(0,4);
    return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

