"use client";

import { PLAYTEST_PLATFORMS } from "@/lib/playtest";
import { FormEvent, useState } from "react";

type FormState = {
    name: string;
    email: string;
    discord: string;
    platform: string;
    notes: string;
    website: string;
};

const initialState: FormState = {
    name: "",
    email: "",
    discord: "",
    platform: PLAYTEST_PLATFORMS[0],
    notes: "",
    website: "",
};

export default function PlaytestForm() {
    const [form, setForm] = useState<FormState>(initialState);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState<string>("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setStatus("loading");
        setMessage("");

        try {
            const response = await fetch("/api/playtest", {
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
            setMessage("Application sent. Keep an eye on your email or Discord for updates.");
            setForm(initialState);
        } catch {
            setStatus("error");
            setMessage("Submission failed. Please try again.");
        }
    }

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Name</span>
                    <input
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        name="name"
                        value={form.name}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, name: event.target.value }))
                        }
                        minLength={2}
                        maxLength={80}
                        required
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Email</span>
                    <input
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, email: event.target.value }))
                        }
                        maxLength={120}
                        required
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Discord (optional)</span>
                    <input
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        name="discord"
                        value={form.discord}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, discord: event.target.value }))
                        }
                        maxLength={80}
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Preferred Platform</span>
                    <select
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        name="platform"
                        value={form.platform}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, platform: event.target.value }))
                        }
                    >
                        {PLAYTEST_PLATFORMS.map((platform) => (
                            <option key={platform} value={platform}>
                                {platform}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label className="grid gap-2 text-sm">
                <span className="text-zinc-300">Anything else we should know? (optional)</span>
                <textarea
                    className="min-h-24 rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    name="notes"
                    value={form.notes}
                    onChange={(event) =>
                        setForm((previous) => ({ ...previous, notes: event.target.value }))
                    }
                    maxLength={600}
                />
            </label>

            {/* Hidden honeypot input to filter basic bot submissions. */}
            <input
                className="hidden"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(event) =>
                    setForm((previous) => ({ ...previous, website: event.target.value }))
                }
            />

            <div className="flex items-center gap-3">
                <button className="btn-primary" type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Submitting..." : "Apply for Playtest"}
                </button>
                <span className="text-xs text-zinc-500">Applications are sent to the team Discord.</span>
            </div>

            {message ? (
                <p className={status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}

