import Link from "next/link";
import { feedbackSuggestions } from "@/lib/feedback";

export default function FeedbackPage() {
	return (
		<div className="grid gap-6">
			<section className="container-soft p-6 md:p-10">
				<div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
					<div>
						<h1 className="text-3xl font-semibold">Community Feedback</h1>
						<p className="mt-2 text-zinc-300">
							Share ideas with the team and browse suggestions already submitted by
							players. New submissions are routed directly to our internal queue.
						</p>
					</div>

					<Link href="/support/feedback/submit" className="btn-primary">
						Submit Feedback
					</Link>
				</div>
			</section>

			<section>
				<div className="mb-3 text-sm text-zinc-400">
					{feedbackSuggestions.length} current suggestions (curated preview)
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{feedbackSuggestions.map((suggestion) => (
						<article key={suggestion.id} className="container-soft p-6">
							<div className="flex items-start justify-between gap-3">
								<h2 className="text-lg font-semibold leading-tight">
									{suggestion.title}
								</h2>
								<span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300">
									{suggestion.votes} votes
								</span>
							</div>

							<p className="mt-3 text-sm text-zinc-300">{suggestion.description}</p>

							<div className="mt-4 flex flex-wrap gap-2 text-xs">
								<span className="rounded-full border border-white/10 bg-zinc-900/70 px-2 py-1 text-zinc-300">
									{suggestion.category}
								</span>
								<span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-emerald-300">
									{suggestion.status}
								</span>
							</div>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}

