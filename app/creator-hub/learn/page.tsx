const learningTracks = [
    "Creator onboarding and tool setup",
    "World publishing and moderation standards",
    "Asset optimization and performance tips",
    "Community growth best practices",
];

export default function CreatorHubLearnPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Learn</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Learning hub placeholder for guides, tutorials, and creator documentation.
                </p>
            </section>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Learning tracks</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {learningTracks.map((track) => (
                        <li key={track}>{track}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

