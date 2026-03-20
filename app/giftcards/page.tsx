import ComingSoonCard from "@/components/ComingSoonCard";
import PlaceholderStatusPanel from "@/components/PlaceholderStatusPanel";
import Link from "next/link";

const giftcardOptions = [
    {
        title: "$10 Starter",
        description: "Great for small cosmetics and profile upgrades.",
    },
    {
        title: "$25 Popular",
        description: "A balanced pick for bundles and creator items.",
    },
    {
        title: "$50 Plus",
        description: "Ideal for seasonal packs and larger collections.",
    },
    {
        title: "$100 Premium",
        description: "Best for gifting to active players and creators.",
    },
];

const giftSteps = [
    "Choose denomination and delivery method.",
    "Receive a secure redemption code instantly.",
    "Recipient redeems in account wallet and sees balance immediately.",
];

const supportNotes = [
    "Codes are account-bound after redemption.",
    "Gift card purchases are final unless required by law.",
    "Fraud checks may delay suspicious purchases.",
];

export default function GiftcardsPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                        <h1 className="text-3xl font-semibold">Giftcards</h1>
                        <p className="mt-2 max-w-2xl text-zinc-300">
                            Gift cards are in final prep. This preview shows planned denominations,
                            redemption flow, and support expectations.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link className="btn-primary" href="/playtest">
                                Get launch updates
                            </Link>
                            <Link className="btn-ghost" href="/support/contact">
                                Gift card support
                            </Link>
                        </div>
                    </div>

                    <PlaceholderStatusPanel
                        label="Availability"
                        value="Coming soon"
                        detail="Checkout and code delivery are not enabled yet."
                    />
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {giftcardOptions.map((amount) => (
                    <ComingSoonCard
                        key={amount.title}
                        title={amount.title}
                        description={amount.description}
                    />
                ))}
            </div>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">How gifting works</h2>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
                        {giftSteps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </article>

                <article className="container-soft p-6">
                    <h2 className="text-lg font-semibold">Support and policy notes</h2>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                        {supportNotes.map((note) => (
                            <li key={note}>{note}</li>
                        ))}
                    </ul>
                </article>
            </section>
        </div>
    );
}
