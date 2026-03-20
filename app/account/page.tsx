import Link from "next/link";
import AccountLogoutButton from "@/components/AccountLogoutButton";
import { getAccountFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const quickStats = [
    { label: "Profile completion", value: "68%" },
    { label: "Security score", value: "Good" },
    { label: "Region", value: "US-East" },
    { label: "Wallet status", value: "Ready" },
];

const recentActivity = [
    "Redeem attempt for code CUBED2026 (pending verification)",
    "Joined playtest waitlist",
    "Updated notification preferences",
];

const securityChecklist = [
    { label: "Email verified", done: true },
    { label: "2FA setup", done: false },
    { label: "Recovery method", done: false },
    { label: "Recent login review", done: true },
];

const accountModules = [
    {
        title: "Profile",
        description: "Identity, avatar, bio, and public player card settings.",
        href: "/account",
    },
    {
        title: "Redeem",
        description: "Apply promo and gift codes to your account wallet.",
        href: "/redeem",
    },
    {
        title: "Purchases",
        description: "Track future transactions, receipts, and ownership history.",
        href: "/marketplace",
    },
    {
        title: "Support",
        description: "Get help with account access and policy questions.",
        href: "/support/contact",
    },
];

const profileActions = [
    { label: "Usage Guidelines", href: "/account/usage-guidelines" },
    { label: "Contact Support", href: "/support/contact" },
    { label: "Feedback Hub", href: "/support/feedback" },
];

export default async function AccountPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        redirect("/account/auth?next=/account");
    }

    const session = await getAccountFromSessionToken(token);
    if (!session) {
        redirect("/account/auth?next=/account");
    }

    const account = session.account;
    const createdDate = new Date(account.createdAt).toLocaleDateString();

    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Account Profile</h1>
                        <p className="mt-2 text-zinc-300">
                            Signed-in profile dashboard for account identity, security status, and
                            account actions.
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
                        <div className="text-zinc-300">Signed in as</div>
                        <div className="mt-1 text-base font-semibold">{account.username}</div>
                        <div className="mt-2 text-xs text-zinc-400">{account.email}</div>
                        <div className="mt-2 text-xs text-zinc-400">Member since {createdDate}</div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                {quickStats.map((stat) => (
                    <article key={stat.label} className="container-soft p-5">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{stat.label}</div>
                        <div className="mt-2 text-lg font-semibold">{stat.value}</div>
                    </article>
                ))}
            </section>

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {accountModules.map((module) => (
                    <article key={module.title} className="container-soft p-5">
                        <h2 className="text-sm font-semibold">{module.title}</h2>
                        <p className="mt-2 text-sm text-zinc-300">{module.description}</p>
                        <Link href={module.href} className="mt-4 inline-flex text-sm text-zinc-100 underline-offset-4 hover:underline">
                            Open
                        </Link>
                    </article>
                ))}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <article className="container-soft p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold">Profile overview</h2>
                    <p className="mt-2 text-sm text-zinc-300">
                        This profile is attached to your current account session and reserved for
                        Cubed identity.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Username: <span className="text-zinc-100">{account.username}</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Preferred platform: <span className="text-zinc-100">PC</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Email: <span className="text-zinc-100">{account.email}</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Reserved for Cubed: <span className="text-zinc-100">{account.reserveCubedUsername ? "Yes" : "No"}</span>
                        </div>
                    </div>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Quick actions</h2>
                    <div className="mt-4 grid gap-2 text-sm">
                        <Link href="/redeem" className="btn-ghost">
                            Redeem a code
                        </Link>
                        <Link href="/marketplace" className="btn-ghost">
                            Open marketplace
                        </Link>
                        <Link href="/giftcards" className="btn-ghost">
                            View giftcards
                        </Link>
                        <Link href="/support/feedback" className="btn-ghost">
                            Submit feedback
                        </Link>
                    </div>
                </article>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Security checklist</h2>
                    <ul className="mt-4 space-y-2 text-sm">
                        {securityChecklist.map((item) => (
                            <li key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-zinc-300">
                                <span>{item.label}</span>
                                <span className={item.done ? "text-emerald-300" : "text-amber-300"}>
                                    {item.done ? "Done" : "Pending"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Upcoming account features</h2>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                        <li>Session management with device sign-out</li>
                        <li>Purchase history and invoice exports</li>
                        <li>Parental controls and family safety defaults</li>
                        <li>Linked social profile visibility controls</li>
                    </ul>
                </article>
            </section>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Recent activity</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {recentActivity.map((activity) => (
                        <li key={activity}>{activity}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
