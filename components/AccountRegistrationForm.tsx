"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";

type FormState = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    reserveCubedUsername: boolean;
};

const initialFormState: FormState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    reserveCubedUsername: true,
};

type AccountRegistrationFormProps = {
    onSuccessAction?: () => void;
};

export default function AccountRegistrationForm({ onSuccessAction }: AccountRegistrationFormProps) {
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

    async function registerAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        if (form.password !== form.confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match.");
            return;
        }

        setStatus("submitting");

        try {
            const response = await fetch("/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    reserveCubedUsername: form.reserveCubedUsername,
                }),
            });

            const data = (await response.json()) as {
                ok?: boolean;
                requiresLogin?: boolean;
                error?: string;
                account?: { username: string; reserveCubedUsername: boolean };
            };

            if (!response.ok || !data.ok) {
                setStatus("error");
                setMessage(data.error ?? "Could not create account right now.");
                return;
            }

            setStatus("success");
            if (data.requiresLogin) {
                setMessage("Account created successfully. Please log in to start your session.");
            } else {
                setMessage(
                    data.account?.reserveCubedUsername
                        ? `Account created. ${data.account.username} is reserved for Cubed.`
                        : `Account created successfully for ${data.account?.username}.`
                );
            }
            setForm(initialFormState);
            onSuccessAction?.();
        } catch {
            setStatus("error");
            setMessage("Could not create account right now.");
        }
    }

    return (
        <form onSubmit={registerAccount} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Password</span>
                    <input
                        type="password"
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        value={form.password}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, password: event.target.value }))
                        }
                        minLength={8}
                        maxLength={72}
                        required
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    <span className="text-zinc-300">Confirm password</span>
                    <input
                        type="password"
                        className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                        value={form.confirmPassword}
                        onChange={(event) =>
                            setForm((previous) => ({ ...previous, confirmPassword: event.target.value }))
                        }
                        minLength={8}
                        maxLength={72}
                        required
                    />
                </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                    type="checkbox"
                    checked={form.reserveCubedUsername}
                    onChange={(event) =>
                        setForm((previous) => ({
                            ...previous,
                            reserveCubedUsername: event.target.checked,
                        }))
                    }
                />
                Reserve this username for Cubed in-game identity
            </label>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    className="btn-ghost"
                    type="button"
                    onClick={checkAvailability}
                    disabled={status === "checking" || status === "submitting"}
                >
                    {status === "checking" ? "Checking..." : "Check username"}
                </button>
                <button className="btn-primary" type="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Creating..." : "Create account"}
                </button>
            </div>

            {message ? (
                <p className={status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}

