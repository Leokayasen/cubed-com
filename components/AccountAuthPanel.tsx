"use client";

import AccountLoginForm from "@/components/AccountLoginForm";
import AccountRegistrationForm from "@/components/AccountRegistrationForm";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type SessionAccount = {
    id: string;
    email: string;
    username: string;
    reserveCubedUsername: boolean;
    createdAt: string;
};

export default function AccountAuthPanel() {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<SessionAccount | null>(null);
    const [logoutMessage, setLogoutMessage] = useState("");

    const refreshSession = useCallback(async () => {
        try {
            const response = await fetch("/api/account/me", { cache: "no-store" });
            const data = (await response.json()) as {
                ok?: boolean;
                authenticated?: boolean;
                account?: SessionAccount;
            };

            if (!response.ok || !data.authenticated || !data.account) {
                setAccount(null);
                return;
            }

            setAccount(data.account);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshSession();
    }, [refreshSession]);

    async function logout() {
        setLogoutMessage("");

        const response = await fetch("/api/account/logout", {
            method: "POST",
        });

        if (!response.ok) {
            setLogoutMessage("Could not log out right now.");
            return;
        }

        setAccount(null);
        setLogoutMessage("You have been logged out.");
    }

    if (loading) {
        return <p className="text-sm text-zinc-400">Loading account session...</p>;
    }

    if (account) {
        return (
            <div className="grid gap-4">
                <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-4 text-sm text-zinc-300">
                    <div>Signed in as <span className="text-zinc-100">{account.username}</span></div>
                    <div className="mt-1 text-xs text-zinc-400">{account.email}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                        Cubed username reservation: {account.reserveCubedUsername ? "Enabled" : "Disabled"}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link className="btn-primary" href="/account">
                        Open profile dashboard
                    </Link>
                    <button className="btn-ghost" type="button" onClick={() => void refreshSession()}>
                        Refresh session
                    </button>
                    <button className="btn-ghost" type="button" onClick={logout}>
                        Log out
                    </button>
                </div>

                {logoutMessage ? <p className="text-sm text-emerald-300">{logoutMessage}</p> : null}
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                    <h3 className="text-sm font-semibold">Create account</h3>
                    <div className="mt-3">
                        <AccountRegistrationForm onSuccessAction={() => void refreshSession()} />
                    </div>
                </section>

                <section className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                    <h3 className="text-sm font-semibold">Log in</h3>
                    <div className="mt-3">
                        <AccountLoginForm onSuccessAction={() => void refreshSession()} />
                    </div>
                </section>
            </div>

            {logoutMessage ? <p className="text-sm text-emerald-300">{logoutMessage}</p> : null}
        </div>
    );
}

