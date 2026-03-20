import ComingSoonCard from "@/components/ComingSoonCard";
import PlaceholderStatusPanel from "@/components/PlaceholderStatusPanel";
import Link from "next/link";

const categoryCards = [
    {
        title: "Cosmetic Packs",
        description: "Skins, emotes, profile flair, and themed visual sets.",
        items: ["Character looks", "Build effects", "Seasonal cosmetics"],
    },
    {
        title: "Creator Items",
        description: "Community-made content and curated collections.",
        items: ["Featured creators", "Creator spotlights", "Verified item labels"],
    },
    {
        title: "Featured",
        description: "Rotating bundles, event drops, and limited offers.",
        items: ["Weekly rotations", "Bundle savings", "Event highlights"],
    },
];

const featuredRows = [
    {
        title: "Starter Collection",
        description: "An easy entry bundle for new players who want a full look set.",
        tag: "Preview bundle",
    },
    {
        title: "Builder Essentials",
        description: "Theme-based build cosmetics and world decoration effects.",
        tag: "Most requested",
    },
    {
        title: "Creator Spotlight",
        description: "Rotating creator items selected from community submissions.",
        tag: "Updated weekly",
    },
];

const confidenceNotes = [
    "Clear pricing and item ownership details",
    "Platform-safe purchases and account-linked inventory",
    "Moderated creator listings with reporting tools",
];

export default function MarketplacePage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Marketplace</h1>
                        <p className="mt-2 max-w-2xl text-zinc-300">
                            A preview of how cosmetic discovery, creator content, and featured
                            bundles will look once purchasing goes live.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link className="btn-primary" href="/playtest">
                                Join early access list
                            </Link>
                            <Link className="btn-ghost" href="/support/feedback">
                                Suggest marketplace features
                            </Link>
                        </div>
                    </div>

                    <PlaceholderStatusPanel
                        label="Status"
                        value="In preview"
                        detail="Browsing UI is being refined before transactions are enabled."
                    />
                </div>
            </section>

            <div className="grid gap-4 md:grid-cols-3">
                {categoryCards.map((listing) => (
                    <ComingSoonCard
                        key={listing.title}
                        title={listing.title}
                        description={listing.description}
                        items={listing.items}
                    />
                ))}
            </div>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Featured shelf preview</h2>
                <div className="mt-4 grid gap-3">
                    {featuredRows.map((row) => (
                        <article key={row.title} className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold">{row.title}</h3>
                                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                                    {row.tag}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-zinc-300">{row.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Buyer confidence goals</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {confidenceNotes.map((note) => (
                        <li key={note}>{note}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

