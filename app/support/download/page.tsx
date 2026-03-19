import Link from "next/link";

export default function SupportDownloadPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Download</h1>
                <p className="mt-2 text-zinc-300">
                    Public builds are not available yet. When downloads open, this page will include
                    platform installers and release notes.
                </p>
            </div>

            <section className="container-soft p-6 md:p-10">
                <h2 className="text-lg font-semibold">Current status</h2>
                <p className="mt-3 text-sm text-zinc-300">
                    Cubed is currently in private testing. Join the playtest list to be notified
                    when early access spots are available.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/playtest" className="btn-primary">
                        Join Playtest List
                    </Link>
                    <Link href="/devlog" className="btn-ghost">
                        Follow Development
                    </Link>
                </div>
            </section>
        </div>
    );
}

