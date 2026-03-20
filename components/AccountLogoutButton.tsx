"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountLogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function logout() {
        setLoading(true);

        try {
            const response = await fetch("/api/account/logout", {
                method: "POST",
            });

            if (!response.ok) {
                setLoading(false);
                return;
            }

            router.push("/account/auth");
            router.refresh();
        } catch {
            setLoading(false);
        }
    }

    return (
        <button className="btn-ghost" type="button" onClick={logout} disabled={loading}>
            {loading ? "Logging out..." : "Log out"}
        </button>
    );
}

