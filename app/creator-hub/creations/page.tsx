const creationItems = [
    { name: "Skyline Build Pack", type: "World", status: "Draft" },
    { name: "Neon Furniture Set", type: "Asset", status: "Review" },
    { name: "Forest Quest Template", type: "Template", status: "Published" },
];

export default function CreatorHubCreationsPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Creations</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Placeholder area for organizing creator projects, assets, and world entries.
                </p>
            </section>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Recent creations</h2>
                <div className="mt-4 grid gap-3">
                    {creationItems.map((item) => (
                        <article key={item.name} className="rounded-xl border border-white/10 bg-zinc-950/40 p-4 text-sm">
                            <div className="font-semibold text-zinc-100">{item.name}</div>
                            <div className="mt-1 text-zinc-300">Type: {item.type}</div>
                            <div className="mt-1 text-xs text-zinc-400">Status: {item.status}</div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

