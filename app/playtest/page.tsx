import Link from "next/link";
import PlaytestForm from "@/components/PlaytestForm";

export default function PlaytestPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Playtest</h1>
                <p className="mt-2 text-zinc-300">
                    Apply for upcoming Cubed playtests. Submissions are sent to the team Discord
                    channel for review.
                </p>
            </div>

            <div className="container-soft p-6 md:p-10">
                <div className="grid gap-4 md:grid-cols-2 md:items-center">
                    <div>
                        <div className="text-sm font-semibold">Get notified</div>
                        <p className="mt-2 text-sm text-zinc-300">
                            Join our Discord to get the latest updates on playtests and releases.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <a className="btn-ghost" href="#">
                                Discord Invite
                            </a>
                            <Link className="btn-ghost" href="/community">
                                Community links
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-3 text-xs font-semibold text-zinc-300">Playtest application</div>
                        <PlaytestForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
