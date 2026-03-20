import Link from "next/link";

const creatorModules = [
    {
        title: "Creations",
        description: "Manage creator projects, assets, and world entries.",
        status: "Planned",
    },
    {
        title: "Learn",
        description: "Guides, creator docs, and onboarding learning paths.",
        status: "Preview",
    },
    {
        title: "Store",
        description: "Future storefront tools for creator items and bundles.",
        status: "Planned",
    },
    {
        title: "Forum",
        description: "Community discussion and creator support threads.",
        status: "Planned",
    },
    {
        title: "Analytics",
        description: "View engagement, retention, and content performance.",
        status: "In design",
    },
    {
        title: "Ads",
        description: "Promotions and campaign management for creator content.",
        status: "Coming later",
    },
];

export default async function CreatorHubPage() {
    return (
        <>
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Creator Hub</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Signed-in workspace preview for creator operations across project management,
                    learning, distribution, and growth tooling.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/account" className="btn-primary">
                        Back to account
                    </Link>
                    <Link href="/support/contact" className="btn-ghost">
                        Creator support
                    </Link>
                    <Link href="/creator-hub/creations" className="btn-ghost">
                        Open creations
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {creatorModules.map((module) => (
                    <article key={module.title} className="container-soft p-5">
                        <h2 className="text-sm font-semibold">{module.title}</h2>
                        <p className="mt-2 text-sm text-zinc-300">{module.description}</p>
                        <div className="mt-3 text-xs text-zinc-400">Status: {module.status}</div>
                    </article>
                ))}
            </section>
        </>
    );
}

