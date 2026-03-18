import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="border-t border-white/10 bg-zinc-950">
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="grid gap-6 md:grid-cols-3">
                    <div>
                        <div className="text-sm font-semibold">Cubed</div>
                        <p className="mt-2 text-sm text-zinc-400">
                            Minecraft-style voxels, Roblox-style networking — cozy, social worlds.
                        </p>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Pages</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/discover">Discover</Link>
                            <Link href="/media">Media</Link>
                            <Link href="/devlog">Devlog</Link>
                            <Link href="/community">Community</Link>
                            <Link href="/playtest">Playtest</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Legal</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/legal/terms">Terms</Link>
                            <Link href="/legal/privacy">Privacy</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-xs text-zinc-500">
                    © {new Date().getFullYear()} BitWave Studios. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
