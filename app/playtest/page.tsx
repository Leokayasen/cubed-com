import Link from "next/link";

export default function PlaytestPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Playtest</h1>
                <p className="mt-2 text-zinc-300">
                    No backend yet — this page is a static placeholder. When you’re ready, we can
                    wire this to an email provider or a simple serverless endpoint on Vercel.
                </p>
            </div>

            <div className="container-soft p-6 md:p-10">
                <div className="grid gap-4 md:grid-cols-2 md:items-center">
                    <div>
                        <div className="text-sm font-semibold">Get notified</div>
                        <p className="mt-2 text-sm text-zinc-300">
                            For now, add your links (Discord, mailing list, etc.). Later: real signup.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <a className="btn-ghost" href="#">
                                Discord (placeholder)
                            </a>
                            <Link className="btn-ghost" href="/community">
                                Community links
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="text-xs font-semibold text-zinc-300">Future signup form</div>
                        <div className="mt-3 grid gap-2">
                            <div className="h-10 rounded-xl border border-white/10 bg-zinc-950/40" />
                            <div className="h-10 rounded-xl border border-white/10 bg-zinc-950/40" />
                        </div>
                        <div className="mt-3 text-xs text-zinc-500">
                            (Non-functional placeholder)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
