import Link from "next/link";

const mediaAssets = [
    "Logo pack (light and dark variants)",
    "Key art and screenshots",
    "Game summary and feature sheet",
    "Studio and project boilerplate copy",
];

const usageRules = [
    "Do not alter the Cubed logo proportions or core colors.",
    "Keep factual project details consistent with official summary.",
    "Link back to official website or social channels where possible.",
];

export default function PressKitPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Press Kit</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Placeholder press resources for creators, journalists, and partners. Asset
                    downloads and official media packs are being prepared.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button className="btn-primary" type="button" disabled>
                        Download media pack (coming soon)
                    </button>
                    <Link href="/support/contact" className="btn-ghost">
                        Request press support
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Planned kit contents</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                        {mediaAssets.map((asset) => (
                            <li key={asset}>{asset}</li>
                        ))}
                    </ul>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Usage guidance</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                        {usageRules.map((rule) => (
                            <li key={rule}>{rule}</li>
                        ))}
                    </ul>
                </article>
            </section>
        </div>
    );
}

