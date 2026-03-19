const links = [
    { name: "Discord", href: "#", note: "Announcements, community chats, etc" },
    { name: "YouTube", href: "#", note: "Dev videos, trailers" },
    { name: "Bluesky", href: "#", note: "Announcements" },
];

export default function CommunityPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Community</h1>
                <p className="mt-2 text-zinc-300">
                    Places to follow and hang out. Links are placeholders for now.
                </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                {links.map((l) => (
                    <a key={l.name} href={l.href} className="container-soft p-6 hover:bg-white/10">
                        <div className="text-sm font-semibold">{l.name}</div>
                        <div className="mt-2 text-sm text-zinc-300">{l.note}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
