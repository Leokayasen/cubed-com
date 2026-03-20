const storeCards = [
    { title: "Listings", detail: "Draft and publish creator listings." },
    { title: "Bundles", detail: "Group items into discounted bundles." },
    { title: "Pricing", detail: "Set and test regional pricing strategies." },
];

export default function CreatorHubStorePage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Store</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Store management placeholder for creator listings, pricing, and offers.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {storeCards.map((card) => (
                    <article key={card.title} className="container-soft p-5">
                        <h2 className="text-sm font-semibold">{card.title}</h2>
                        <p className="mt-2 text-sm text-zinc-300">{card.detail}</p>
                    </article>
                ))}
            </section>
        </div>
    );
}

