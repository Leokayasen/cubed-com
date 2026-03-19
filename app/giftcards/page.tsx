import ComingSoonCard from "@/components/ComingSoonCard";

const giftcardOptions = [
    "$10",
    "$25",
    "$50",
    "$100",
];

export default function GiftcardsPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Giftcards</h1>
                <p className="mt-2 text-zinc-300">
                    Gift card purchasing is not live yet. This placeholder previews common
                    denominations.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {giftcardOptions.map((amount) => (
                    <ComingSoonCard
                        key={amount}
                        title={amount}
                        description="Gift card denomination placeholder."
                    />
                ))}
            </div>

            <div className="text-xs text-zinc-500">Checkout flow not implemented.</div>
        </div>
    );
}
