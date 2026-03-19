import Link from "next/link";

const tips = [
    "Use /feedback to suggest quality-of-life improvements.",
    "Check Devlog posts for feature progress and patch notes.",
    "Join community channels for event and playtest announcements.",
    "Include platform, version, and clear repro steps when reporting issues.",
];

export default function SupportPlayersPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Tips for Players</h1>
                <p className="mt-2 text-zinc-300">
                    Quick guidance for getting help and sharing useful feedback while Cubed is in
                    active development.
                </p>
            </div>

            <section className="container-soft p-6 md:p-10">
                <h2 className="text-lg font-semibold">Best ways to help us improve</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                    ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/support/feedback" className="btn-primary">
                        Open Feedback Hub
                    </Link>
                    <Link href="/playtest" className="btn-ghost">
                        Apply for Playtest
                    </Link>
                </div>
            </section>
        </div>
    );
}

