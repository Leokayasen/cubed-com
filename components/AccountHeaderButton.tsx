"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountHeaderButton() {
    const [label, setLabel] = useState("Login / Create Account");
    const [href, setHref] = useState("/account/auth");

    useEffect(() => {
        async function load() {
            try {
                const response = await fetch("/api/account/me", { cache: "no-store" });
                const data = (await response.json()) as {
                    authenticated?: boolean;
                    account?: { username: string };
                };

                if (response.ok && data.authenticated && data.account) {
                    setLabel(`My Account (${data.account.username})`);
                    setHref("/account");
                }
            } catch {
                // Keep default label when API is unavailable.
            }
        }

        void load();
    }, []);

    return (
        <Link className="btn-ghost text-sm" href={href}>
            {label}
        </Link>
    );
}

