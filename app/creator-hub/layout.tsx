import NavLink from "@/components/NavLink";
import { getAccountFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function CreatorHubLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        redirect("/account/auth?next=/creator-hub");
    }

    const session = await getAccountFromSessionToken(token);
    if (!session) {
        redirect("/account/auth?next=/creator-hub");
    }

    return (
        <div className="grid gap-6">
            <section className="container-soft p-4">
                <div className="flex flex-wrap gap-2">
                    <NavLink href="/creator-hub" label="Home" />
                    <NavLink href="/creator-hub/creations" label="Creations" />
                    <NavLink href="/creator-hub/learn" label="Learn" />
                    <NavLink href="/creator-hub/store" label="Store" />
                    <NavLink href="/creator-hub/forum" label="Forum" />
                    <NavLink href="/creator-hub/analytics" label="Analytics" />
                    <NavLink href="/creator-hub/ads" label="Ads" />
                </div>
            </section>

            {children}
        </div>
    );
}

