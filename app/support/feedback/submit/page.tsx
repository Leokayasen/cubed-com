import Link from "next/link";
import FeedbackForm from "@/components/FeedbackForm";

export default function FeedbackSubmitPage() {
    return (
        <div className="grid gap-6">
            <div>
                <Link href="/support/feedback" className="text-sm text-zinc-400 hover:text-white">
                    {"<- Back to feedback"}
                </Link>
                <h1 className="mt-3 text-3xl font-semibold">Submit Feedback</h1>
                <p className="mt-2 text-zinc-300">
                    Share an idea, quality-of-life request, or bug-adjacent suggestion for Cubed.
                </p>
            </div>

            <section className="container-soft p-6 md:p-10">
                <FeedbackForm />
            </section>
        </div>
    );
}


