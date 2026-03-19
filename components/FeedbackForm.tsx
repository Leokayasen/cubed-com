"use client";

import { FEEDBACK_CATEGORIES, type FeedbackCategory } from "@/lib/feedback";
import type { FormEvent } from "react";
import { useState } from "react";

type FeedbackFormState = {
    title: string;
    category: FeedbackCategory;
    details: string;
    email: string;
    website: string;
};

const initialState: FeedbackFormState = {
    title: "",
    category: FEEDBACK_CATEGORIES[0],
    details: "",
    email: "",
    website: "",
};

export default function FeedbackForm() {
    const [form, setForm] = useState<FeedbackFormState>(initialState);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function submitFeedback(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = (await response.json()) as { ok?: boolean; error?: string };

            if (!response.ok || !data.ok) {
                setStatus("error");
                setMessage(data.error ?? "Submission failed. Please try again.");
                return;
            }

            setStatus("success");
            setMessage("Thanks! Your feedback was sent to the team.");
            setForm(initialState);
        } catch {
            setStatus("error");
            setMessage("Submission failed. Please try again.");
        }
    }

    return (
        <form onSubmit={submitFeedback} className="grid gap-4">
            <label className="grid gap-2 text-sm">
                <span className="text-zinc-300">Title</span>
                <input
                    className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    maxLength={80}
                    required
                />
            </label>

            <label className="grid gap-2 text-sm">
                <span className="text-zinc-300">Category</span>
                <select
                    className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    value={form.category}
                    onChange={(event) =>
                        setForm((prev) => ({
                            ...prev,
                            category: event.target.value as FeedbackCategory,
                        }))
                    }
                >
                    {FEEDBACK_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </label>

            <label className="grid gap-2 text-sm">
                <span className="text-zinc-300">Details</span>
                <textarea
                    className="min-h-28 rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    value={form.details}
                    onChange={(event) =>
                        setForm((prev) => ({ ...prev, details: event.target.value }))
                    }
                    maxLength={500}
                    minLength={10}
                    required
                />
            </label>

            <label className="grid gap-2 text-sm">
                <span className="text-zinc-300">Email (optional)</span>
                <input
                    className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    maxLength={120}
                />
            </label>

            {/* Hidden honeypot input to filter basic bot submissions. */}
            <input
                className="hidden"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            />

            <div className="flex items-center gap-3">
                <button className="btn-primary" type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Submitting..." : "Submit Suggestion"}
                </button>
                <span className="text-xs text-zinc-500">Submissions are sent to the team queue.</span>
            </div>

            {message ? (
                <p className={status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}

