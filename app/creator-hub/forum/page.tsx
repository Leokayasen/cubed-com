const forumTopics = [
    "Creator announcements",
    "Asset feedback threads",
    "Collaboration requests",
    "Technical troubleshooting",
];

export default function CreatorHubForumPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Forum</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Community forum placeholder for creator discussions and support topics.
                </p>
            </section>

            <section className="container-soft p-6">
                <h2 className="text-lg font-semibold">Popular topics</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                    {forumTopics.map((topic) => (
                        <li key={topic}>{topic}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

