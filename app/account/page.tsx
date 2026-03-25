import Link from "next/link";
import AccountLogoutButton from "@/components/AccountLogoutButton";
import { getAccountFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) redirect("/account/auth?next=/account");

    const session = await getAccountFromSessionToken(token);
    if (!session) redirect("/account/auth?next=/account");

    const account = session.account;

    // Fetch real data for the dashboard
    const [redemptions, sessionCount] = await Promise.all([
        prisma.keyRedemption.findMany({
            where: { accountId: account.id },
            include: { key: { select: { keyType: true, createdAt: true } } },
            orderBy: { redeemedAt: "desc" },
        }),
        prisma.userSession.count({ where: { accountId: account.id } }),
    ]);

    const hasGame = redemptions.some((r) => r.key.keyType === "GAME");
    const hasPlaytest = redemptions.some((r) => r.key.keyType === "PLAYTEST");
    const createdDate = new Date(account.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric"
    });

    const securityChecklist = [
        { label: "Email verified", done: account.emailVerified },
        { label: "Password set", done: true },
        { label: "2FA setup", done: false },
        { label: "Recovery method", done: false },
    ];

    const profileActions = [
        { label: "Usage Guidelines", href: "/account/usage-guidelines" },
        { label: "Contact Support", href: "/support/contact" },
        { label: "Feedback Hub", href: "/support/feedback" },
    ];

    const accountModules = [
        {
            title: "Redeem",
            description: "Apply a game key to unlock your copy of Cubed.",
            href: "/redeem",
            available: true,
        },
        {
            title: "Download",
            description: "Download Cubed once you have a valid game key redeemed.",
            href: "/support/download",
            available: hasGame,
        },
        {
            title: "Playtest",
            description: "Access the playtest build if you have a playtest key.",
            href: "/playtest",
            available: hasPlaytest,
        },
        {
            title: "Support",
            description: "Get help with account access and policy questions.",
            href: "/support/contact",
            available: true,
        },
    ];

    return (
        <div className="grid gap-6">
            {/* Header */}
            <section className="container-soft p-6 md:p-10">
                <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Account</h1>
                        <p className="mt-2 text-zinc-300">
                            Manage your profile, redeem keys, and access your downloads.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {profileActions.map((action) => (
                                <Link key={action.href} href={action.href} className="btn-ghost">
                                    {action.label}
                                </Link>
                            ))}
                            <AccountLogoutButton />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm md:min-w-64">
                        <div className="text-zinc-400 text-xs uppercase tracking-wide">Signed in as</div>
                        <div className="mt-1 text-base font-semibold">{account.username}</div>
                        <div className="mt-1 text-xs text-zinc-400">{account.email}</div>
                        <div className="mt-2 text-xs text-zinc-400">Member since {createdDate}</div>
                        {account.role === "ADMIN" && (
                            <div className="mt-2 inline-block rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300">
                                Admin
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Email verification warning */}
            {!account.emailVerified && (
                <section className="container-soft border border-amber-500/30 bg-amber-500/5 p-5">
                    <p className="text-sm text-amber-300">
                        <strong>Your email address is not verified.</strong>{" "}
                        Some features may be restricted. Check your inbox for a verification email.
                    </p>
                </section>
            )}

            {/* Quick stats */}
            <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[
                    { label: "Games owned", value: redemptions.filter(r => r.key.keyType === "GAME").length },
                    { label: "Keys redeemed", value: redemptions.length },
                    { label: "Active sessions", value: sessionCount },
                    { label: "Email verified", value: account.emailVerified ? "Yes" : "No" },
                ].map((stat) => (
                    <article key={stat.label} className="container-soft p-5">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{stat.label}</div>
                        <div className="mt-2 text-lg font-semibold">{stat.value}</div>
                    </article>
                ))}
            </section>

            {/* Modules */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {accountModules.map((module) => (
                    <article
                        key={module.title}
                        className={`container-soft p-5 ${!module.available ? "opacity-50" : ""}`}
                    >
                        <h2 className="text-sm font-semibold">{module.title}</h2>
                        <p className="mt-2 text-sm text-zinc-300">{module.description}</p>
                        {module.available ? (
                            <Link
                                href={module.href}
                                className="mt-4 inline-flex text-sm text-zinc-100 underline-offset-4 hover:underline"
                            >
                                Open
                            </Link>
                        ) : (
                            <span className="mt-4 inline-flex text-sm text-zinc-500">
                                Locked
                            </span>
                        )}
                    </article>
                ))}
            </section>

            {/* Profile + quick actions */}
            <section className="grid gap-4 lg:grid-cols-3">
                <article className="container-soft p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                            { label: "Username", value: account.username },
                            { label: "Email", value: account.email },
                            { label: "Email verified", value: account.emailVerified ? "Yes" : "No" },
                            { label: "Username reserved for Cubed", value: account.reserveCubedUsername ? "Yes" : "No" },
                        ].map(({ label, value }) => (
                            <div key={label} className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                                {label}: <span className="text-zinc-100">{value}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Quick actions</h2>
                    <div className="mt-4 grid gap-2 text-sm">
                        <Link href="/redeem" className="btn-ghost">Redeem a key</Link>
                        {hasGame && (
                            <Link href="/support/download" className="btn-ghost">Download Cubed</Link>
                        )}
                        <Link href="/support/feedback" className="btn-ghost">Submit feedback</Link>
                        <Link href="/support/contact" className="btn-ghost">Contact support</Link>
                    </div>
                </article>
            </section>

            {/* Security + redemptions */}
            <section className="grid gap-4 lg:grid-cols-2">
                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Security checklist</h2>
                    <ul className="mt-4 space-y-2 text-sm">
                        {securityChecklist.map((item) => (
                            <li
                                key={item.label}
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-zinc-300"
                            >
                                <span>{item.label}</span>
                                <span className={item.done ? "text-emerald-300" : "text-amber-300"}>
                                    {item.done ? "Done" : "Pending"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Redeemed keys</h2>
                    {redemptions.length === 0 ? (
                        <p className="mt-4 text-sm text-zinc-400">
                            No keys redeemed yet.{" "}
                            <Link href="/redeem" className="text-zinc-100 underline-offset-4 hover:underline">
                                Redeem one now
                            </Link>
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2 text-sm">
                            {redemptions.map((r) => (
                                <li
                                    key={r.id}
                                    className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-zinc-300"
                                >
                                    <span>{r.key.keyType}</span>
                                    <span className="text-xs text-zinc-500">
                                        {new Date(r.redeemedAt).toLocaleDateString("en-GB")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </article>
            </section>
        </div>
    );
}
