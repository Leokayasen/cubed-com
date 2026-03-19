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

function run() {
    runValidationChecks();
    runRateLimitCheck();
    console.log("Backend smoke checks passed.");
}

run();

