const guidelines = [
    "Respect other players and avoid harassment or abusive language.",
    "Do not exploit bugs, cheat tools, or automation for unfair advantage.",
    "Do not upload harmful, illegal, or malicious content.",
    "Report security issues and severe abuse through the contact/support flow.",
];

export default function UsageGuidelinesPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Usage Guidelines</h1>
                <p className="mt-2 text-zinc-300">
                    These baseline guidelines help keep Cubed safe, fair, and fun for everyone.
                </p>
            </div>

            <section className="container-soft p-6 md:p-10">
                <h2 className="text-lg font-semibold">Community standards</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {guidelines.map((guideline) => (
                        <li key={guideline}>{guideline}</li>
                    ))}
                </ul>
                <p className="mt-5 text-sm text-zinc-400">
                    This is a high-level summary and does not replace the full legal terms.
                </p>
            </section>
        </div>
    );
}

