import Link from "next/link";
import Image from "next/image";
import NavLink from "@/components/NavLink";
import AccountHeaderButton from "@/components/AccountHeaderButton";

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <Image
                            src="/logo.png"
                            alt="Cubed logo"
                            fill
                            className="object-contain p-1"
                            priority
                        />
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold">Cubed</div>
                        <div className="text-xs text-zinc-400">
                            Voxel visuals • Online worlds
                        </div>
                    </div>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    <NavLink href="/discover" label="Discover" />
                    <NavLink href="/media" label="Media" />
                    <NavLink href="/devlog" label="Devlog" />
                    <NavLink href="/community" label="Community" />
                    <NavLink href="/playtest" label="Playtest" />
                    <NavLink href="https://docs.bitwave-studios.com" label="Docs" />
                </nav>

                <div className="flex items-center gap-2">
                    <AccountHeaderButton />
                    <Link className="btn-ghost text-sm" href="/playtest">
                        Get updates
                    </Link>
                </div>
            </div>

            {/* mobile nav */}
            <div className="mx-auto w-full max-w-6xl px-4 pb-3 md:hidden">
                <div className="flex flex-wrap gap-2">
                    <NavLink href="/discover" label="Discover" />
                    <NavLink href="/media" label="Media" />
                    <NavLink href="/devlog" label="Devlog" />
                    <NavLink href="/community" label="Community" />
                    <NavLink href="/playtest" label="Playtest" />
                </div>
            </div>
        </header>
    );
}
