import Link from "next/link";

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="container-soft p-4">
            <div className="text-2xl font-semibold">{value}</div>
            <div className="mt-1 text-xs text-zinc-400">{label}</div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="grid gap-8">
            <section className="container-soft overflow-hidden">
                <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-10">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            Upcoming voxel game • Dark mode default
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                            Cubed — cozy voxel worlds you can share.
                        </h1>
                        <p className="mt-4 text-zinc-300">
                            Minecraft-visual building, Roblox-style networking. Join friends, host worlds,
                            and shape biomes together. (All placeholder for now.)
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link href="/playtest" className="btn-ghost">
                                Join the playtest list
                            </Link>
                            <Link href="/discover" className="btn-ghost">
                                Discover Cubed
                            </Link>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <Stat label="Mode" value="Online" />
                            <Stat label="Style" value="Voxel" />
                            <Stat label="Vibe" value="Cozy" />
                        </div>
                    </div>

                    <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-fuchsia-500/10 p-6">
                        <div className="text-sm font-semibold">Screenshot placeholder</div>
                        <p className="mt-2 text-sm text-zinc-300">
                            Drop your real screenshots into <code className="text-zinc-100">/public</code>{" "}
                            later. For now this is a styled placeholder block.
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="h-28 rounded-xl border border-white/10 bg-white/5" />
                            <div className="h-28 rounded-xl border border-white/10 bg-white/5" />
                            <div className="h-28 rounded-xl border border-white/10 bg-white/5" />
                            <div className="h-28 rounded-xl border border-white/10 bg-white/5" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        title: "Build fast",
                        body: "Snap blocks, paint materials, and craft cozy structures. (Placeholder)",
                    },
                    {
                        title: "Play together",
                        body: "Shared worlds with friends — social by design. (Placeholder)",
                    },
                    {
                        title: "Explore biomes",
                        body: "Moody forests, warm caves, and soft night skies. (Placeholder)",
                    },
                ].map((c) => (
                    <div key={c.title} className="container-soft p-6">
                        <div className="text-sm font-semibold">{c.title}</div>
                        <p className="mt-2 text-sm text-zinc-300">{c.body}</p>
                    </div>
                ))}
            </section>

            <section className="container-soft p-6 md:p-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="text-sm font-semibold">Devlog</div>
                        <p className="mt-1 text-sm text-zinc-300">
                            Follow progress as Cubed takes shape.
                        </p>
                    </div>
                    <Link href="/devlog" className="btn-ghost">
                        Read updates
                    </Link>
                </div>
            </section>
        </div>
    );
}
