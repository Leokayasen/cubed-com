import Link from "next/link";

const devTips = [
    "Keep bug reports reproducible with exact steps and expected behavior.",
    "Prefer small, testable changes over broad feature rewrites.",
    "Use the support feedback board to validate demand before building.",
    "Track player pain points and tie fixes to measurable outcomes.",
];

export default function SupportDevsPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Tips for Developers</h1>
                <p className="mt-2 text-zinc-300">
                    Practical notes for contributors and collaborators working on Cubed-adjacent
                    tooling and workflows.
                </p>
            </div>

            <section className="container-soft p-6 md:p-10">
                <h2 className="text-lg font-semibold">Development guidance</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {devTips.map((tip) => (
                        <li key={tip}>{tip}</li>
                    ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/devlog" className="btn-ghost">
                        Read Devlog
                    </Link>
                    <a className="btn-ghost" href="https://docs.bitwave-studios.com">
                        Open Docs
                    </a>
                </div>
            </section>
        </div>
    );
}

