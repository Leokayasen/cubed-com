import {
    hashPassword,
    validateAccountProfileReservation,
    validateAccountRegistration,
    verifyPassword,
} from "@/lib/account";
import { validateFeedbackSubmission } from "@/lib/feedback";
import { rateLimitByKey } from "@/lib/server/request";
import { validatePlaytestSubmission } from "@/lib/playtest";

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

function runValidationChecks() {
    const playtest = validatePlaytestSubmission({
        name: "Kaiya",
        email: "kaiya@example.com",
        discord: "kaiya#1234",
        platform: "PC",
        notes: "Happy to test evenings",
        website: "",
    });
    assert(playtest.ok, "Expected playtest validation to pass");

    const feedback = validateFeedbackSubmission({
        title: "Add keyboard remapping",
        category: "Quality of Life",
        details: "Would help accessibility and controller parity for custom setups.",
        email: "",
        website: "",
    });
    assert(feedback.ok, "Expected feedback validation to pass");

    const account = validateAccountProfileReservation({
        username: "Player_Kaiya",
        email: "kaiya@example.com",
    });
    assert(account.ok, "Expected account profile validation to pass");

    const registration = validateAccountRegistration({
        username: "Player_Kaiya",
        email: "kaiya@example.com",
        password: "SecurePass123",
        reserveCubedUsername: true,
    });
    assert(registration.ok, "Expected account registration validation to pass");
}

function runRateLimitCheck() {
    const key = `smoke:${Date.now()}`;
    const first = rateLimitByKey(key, 2, 60_000);
    const second = rateLimitByKey(key, 2, 60_000);
    const third = rateLimitByKey(key, 2, 60_000);

    assert(first.allowed, "First request should be allowed");
    assert(second.allowed, "Second request should be allowed");
    assert(!third.allowed, "Third request should be blocked");
}

async function runPasswordCheck() {
    const hash = await hashPassword("SecurePass123");
    const valid = await verifyPassword("SecurePass123", hash);
    const invalid = await verifyPassword("WrongPass123", hash);

    assert(valid, "Expected password verification to pass");
    assert(!invalid, "Expected invalid password verification to fail");
}

async function run() {
    runValidationChecks();
    runRateLimitCheck();
    await runPasswordCheck();
    console.log("Backend smoke checks passed.");
}

void run();

