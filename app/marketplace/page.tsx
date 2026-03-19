import ComingSoonCard from "@/components/ComingSoonCard";

const listings = [
    {
        title: "Cosmetic Packs",
        description: "Skins, emotes, and visual items.",
    },
    {
        title: "Creator Items",
        description: "Community-made content and featured collections.",
    },
    {
        title: "Featured",
        description: "Rotating highlights, bundles, and seasonal drops.",
    },
];

export default function MarketplacePage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Marketplace</h1>
                <p className="mt-2 text-zinc-300">
                    Marketplace browsing and purchases are coming later. These cards are visual
                    placeholders for future categories.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {listings.map((listing) => (
                    <ComingSoonCard
                        key={listing.title}
                        title={listing.title}
                        description={listing.description}
                    />
                ))}
            </div>
        </div>
    );
}

