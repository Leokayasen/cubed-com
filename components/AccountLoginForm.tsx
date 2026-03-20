"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type FormState = {
    email: string;
    password: string;
};

const initialFormState: FormState = {
    email: "",
    password: "",
};

type AccountLoginFormProps = {
    onSuccessAction?: () => void;
};

export default function AccountLoginForm({ onSuccessAction }: AccountLoginFormProps) {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function login(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const response = await fetch("/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = (await response.json()) as {
                ok?: boolean;
                error?: string;
                account?: { username: string };
            };

            if (!response.ok || !data.ok) {
                setStatus("error");
                setMessage(data.error ?? "Could not log in right now.");
                return;
            }

            setStatus("success");
            setMessage(`Welcome back, ${data.account?.username}.`);
            setForm(initialFormState);
            onSuccessAction?.();
        } catch {
            setStatus("error");
            setMessage("Could not log in right now.");
        }
    }

    return (
        <form onSubmit={login} className="grid gap-4">
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

            <button className="btn-primary" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Logging in..." : "Log in"}
            </button>

            {message ? (
                <p className={status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}

