import Link from "next/link";
import { getAllDevlogPosts } from "@/lib/devlog";

export default async function DevlogIndexPage() {
    const devlogPosts = await getAllDevlogPosts();

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Devlog</h1>
                <p className="mt-2 text-zinc-300">
                    Updates, prototypes, and design notes.
                </p>
            </div>

            <div className="grid gap-3">
                {devlogPosts.map((p) => (
                    <Link key={p.slug} href={`/devlog/${p.slug}`} className="container-soft p-6 hover:bg-white/10">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-semibold">{p.title}</div>
                                <p className="mt-2 text-sm text-zinc-300">{p.summary}</p>
                            </div>
                            <div className="shrink-0 text-xs text-zinc-500">{p.date}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
