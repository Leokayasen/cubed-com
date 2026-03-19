import Link from "next/link";

const quickStats = [
    { label: "Profile completion", value: "68%" },
    { label: "Security score", value: "Good" },
    { label: "Region", value: "US-East" },
    { label: "Plan", value: "Player" },
];

const recentActivity = [
    "Redeem attempt for code CUBED2026 (pending verification)",
    "Joined playtest waitlist",
    "Updated notification preferences",
];

export default function AccountPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Account Profile</h1>
                        <p className="mt-2 text-zinc-300">
                            Manage profile details, security settings, and account activity from one
                            place.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link href="/account/usage-guidelines" className="btn-ghost">
                                Usage Guidelines
                            </Link>
                            <Link href="/support/contact" className="btn-ghost">
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm md:min-w-64">
                        <div className="text-zinc-300">Signed in as</div>
                        <div className="mt-1 text-base font-semibold">Player Account</div>
                        <div className="mt-2 text-xs text-zinc-400">Placeholder profile identity</div>
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

            <section className="grid gap-4 lg:grid-cols-3">
                <article className="container-soft p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold">Profile details</h2>
                    <p className="mt-2 text-sm text-zinc-300">
                        Basic profile editing will appear here first: display name, avatar,
                        preferred platform, and communication settings.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Display name: <span className="text-zinc-100">Player Account</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Preferred platform: <span className="text-zinc-100">PC</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Email status: <span className="text-zinc-100">Verified</span>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm text-zinc-300">
                            Notifications: <span className="text-zinc-100">Enabled</span>
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
