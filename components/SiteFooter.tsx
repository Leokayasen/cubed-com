import Link from "next/link";

export default function SiteFooter() {
    return (
        <footer className="border-t border-white/10 bg-zinc-950">
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                <div className="grid gap-6 md:grid-cols-4">
                    <div>
                        <div className="text-m font-semibold">Cubed</div>
                        <p className="mt-2 text-sm text-zinc-400">
                            Voxel sandbox for everyone.
                        </p>
                        <div className="mt-2 flex gap-2 text-zinc-100">
                            <Link href="/account/usage-guidelines">Usage Guidelines</Link>
                            <Link href="/">Manage Consent</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Account</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/account">Profile</Link>
                            <Link href="/redeem">Redeem</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Shop</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/shop/marketplace">Marketplace</Link>
                            <Link href="/shop/giftcards">Giftcards</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Legal</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/legal/terms">Terms</Link>
                            <Link href="/legal/privacy">Privacy</Link>
                            <Link href="/legal/eula">EULA</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">- - -</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/secret">‎ </Link>
                            <Link href="/sitemap">Site Map</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Support</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/support">Support Center</Link>
                            <Link href="/support/players">Tips for Players</Link>
                            <Link href="/support/devs">Tips for Developers</Link>
                            <Link href="/support/feedback">Feedback</Link>
                            <Link href="/support/download">Download</Link>
                            <Link href="/support/contact">Contact Us</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Resources</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/press-kit">Press Kit</Link>
                        </div>
                    </div>

                    <div className="text-sm">
                        <div className="font-semibold">Explore</div>
                        <div className="mt-2 grid gap-1 text-zinc-300">
                            <Link href="/creator-hub">Creator Hub</Link>
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
