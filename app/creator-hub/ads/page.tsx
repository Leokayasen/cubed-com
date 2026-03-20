const campaigns = [
    { name: "Spring Build Pack", budget: "$120", state: "Draft" },
    { name: "Starter Worlds", budget: "$80", state: "Scheduled" },
    { name: "Creator Spotlight", budget: "$200", state: "Review" },
];

export default function CreatorHubAdsPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Ads</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Ads workspace placeholder for campaign planning and promotion controls.
                </p>
            </section>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Campaign queue</h2>
                <div className="mt-4 grid gap-3">
                    {campaigns.map((campaign) => (
                        <article key={campaign.name} className="rounded-xl border border-white/10 bg-zinc-950/40 p-4 text-sm">
                            <div className="font-semibold text-zinc-100">{campaign.name}</div>
                            <div className="mt-1 text-zinc-300">Budget: {campaign.budget}</div>
                            <div className="mt-1 text-xs text-zinc-400">State: {campaign.state}</div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

