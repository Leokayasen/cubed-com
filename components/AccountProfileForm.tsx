"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type FormState = {
    username: string;
    email: string;
};

const initialFormState: FormState = {
    username: "",
    email: "",
};

export default function AccountProfileForm() {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [status, setStatus] = useState<"idle" | "checking" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const normalizedPreview = useMemo(
        () => form.username.trim().toLowerCase(),
        [form.username]
    );

    async function checkAvailability() {
        if (!form.username.trim()) return;

        setStatus("checking");
        setMessage("");

        try {
            const response = await fetch(
                `/api/account/username?username=${encodeURIComponent(form.username)}`
            );
            const data = (await response.json()) as {
                ok?: boolean;
                available?: boolean;
                error?: string;
            };

            if (!response.ok || !data.ok) {
                setStatus("error");
                setMessage(data.error ?? "Could not check username right now.");
                return;
            }

            setStatus("idle");
            setMessage(data.available ? "Username is available." : "Username is already reserved.");
        } catch {
            setStatus("error");
            setMessage("Could not check username right now.");
        }
    }

    async function reserveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const response = await fetch("/api/account/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = (await response.json()) as {
                ok?: boolean;
                existing?: boolean;
                error?: string;
                profile?: { username: string; createdAt: string };
            };

            if (!response.ok || !data.ok) {
                setStatus("error");
                setMessage(data.error ?? "Could not reserve username right now.");
                return;
            }

            setStatus("success");
            setForm(initialFormState);
            setMessage(
                data.existing
                    ? `Username ${data.profile?.username} was already reserved with this email.`
                    : `Username ${data.profile?.username} reserved successfully.`
            );
        } catch {
            setStatus("error");
            setMessage("Could not reserve username right now.");
        }
    }

    return (
        <form onSubmit={reserveProfile} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Username</span>
                    <input
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        value={form.username}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, username: event.target.value }))
                        }
                        minLength={3}
                        maxLength={20}
                        required
                    />
                    <span className="text-xs text-zinc-500">Preview: {normalizedPreview || "(empty)"}</span>
                </label>

                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Email</span>
                    <input
                        type="email"
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        value={form.email}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, email: event.target.value }))
                        }
                        maxLength={120}
                        required
                    />
                </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    className="btn-ghost"
                    type="button"
                    onClick={checkAvailability}
                    disabled={status === "checking" || status === "submitting"}
                >
                    {status === "checking" ? "Checking..." : "Check availability"}
                </button>
                <button className="btn-primary" type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Reserving..." : "Reserve username"}
                </button>
            </div>

            {message ? (
                <p
                    className={
                        status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"
                    }
                >
                    {message}
                </p>
            ) : null}
        </form>
    );
}

