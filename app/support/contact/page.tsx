import Link from "next/link";

export default function SupportContactPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Contact Us</h1>
                <p className="mt-2 text-zinc-300">
                    Need help with account access, policy questions, or support requests? Reach out
                    and include as much context as possible.
                </p>
            </div>

            <section className="container-soft p-6 md:p-10">
                <h2 className="text-lg font-semibold">Contact channels</h2>
                <div className="mt-4 grid gap-3 text-sm text-zinc-300">
                    <p>Email: <span className="text-zinc-100">support@bitwave-studios.com</span></p>
                    <p>Response target: 3 to 5 business days.</p>
                    <p>
                        For feature ideas, please use the dedicated feedback board so others can
                        discover and vote on your suggestion.
                    </p>
                </div>

                <div className="mt-6">
                    <Link href="/support/feedback" className="btn-primary">
                        Submit Feedback Instead
                    </Link>
                </div>
            </section>
        </div>
    );
}

