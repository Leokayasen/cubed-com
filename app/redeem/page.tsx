import ComingSoonCard from "@/components/ComingSoonCard";
import PlaceholderStatusPanel from "@/components/PlaceholderStatusPanel";
import Link from "next/link";

const redemptionSteps = [
    "Enter a valid code exactly as provided.",
    "System verifies expiration, ownership, and eligibility.",
    "Rewards are added instantly to your account inventory.",
];

const recentRedemptions = [
    { code: "CUBED2026", status: "Pending", reward: "Starter Bundle" },
    { code: "SPRINGDROP", status: "Resolved", reward: "Garden Theme Pack" },
    { code: "PLAYTESTBONUS", status: "Resolved", reward: "Founders Badge" },
];

export default function RedeemPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Redeem Codes</h1>
                        <p className="mt-2 max-w-2xl text-zinc-300">
                            Redeem hub for promo and reward codes. Submission and reward
                            delivery are currently placeholders.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link href="/account" className="btn-primary">
                                Open account
                            </Link>
                            <Link href="/support/contact" className="btn-ghost">
                                Need help?
                            </Link>
                        </div>
                    </div>

                    <PlaceholderStatusPanel
                        label="Status"
                        value="Preview mode"
                        detail="Code input UI is ready; backend validation is coming next."
                    />
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <article className="container-soft p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold">Redeem a code</h2>
                    <p className="mt-2 text-sm text-zinc-300">
                        Enter your code below to claim rewards when redemption goes live.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <input
                            className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-300 outline-none"
                            placeholder="Enter code (e.g. CUBED2026)"
                            disabled
                        />
                        <button className="btn-primary" type="button" disabled>
                            Redeem
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">UI placeholder: form is disabled.</div>
                </article>

                <ComingSoonCard
                    title="What this page will support"
                    description="Code redemption system and reward delivery pipeline."
                    items={[
                        "One-time and reusable code policies",
                        "Eligibility and expiry checks",
                        "Automatic inventory and wallet updates",
                    ]}
                    footer="No backend connected yet."
                />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">How redemption works</h2>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
                        {redemptionSteps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Recent code activity</h2>
                    <div className="mt-3 grid gap-2">
                        {recentRedemptions.map((entry) => (
                            <div
                                key={entry.code}
                                className="rounded-xl border border-white/10 bg-zinc-950/40 p-3 text-sm"
                            >
                                <div className="font-semibold text-zinc-100">{entry.code}</div>
                                <div className="mt-1 text-zinc-300">Reward: {entry.reward}</div>
                                <div className="mt-1 text-xs text-zinc-400">Status: {entry.status}</div>
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </div>
    );
}

