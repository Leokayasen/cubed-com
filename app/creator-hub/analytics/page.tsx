const metrics = [
    { label: "Views", value: "12.4K" },
    { label: "Downloads", value: "3.1K" },
    { label: "Favorites", value: "842" },
    { label: "Retention", value: "38%" },
];

export default function CreatorHubAnalyticsPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Analytics</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Analytics placeholder dashboard for creator performance and engagement metrics.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                {metrics.map((metric) => (
                    <article key={metric.label} className="container-soft p-5">
                        <div className="text-xs uppercase tracking-wide text-zinc-400">{metric.label}</div>
                        <div className="mt-2 text-lg font-semibold">{metric.value}</div>
                    </article>
                ))}
            </section>
        </div>
    );
}

