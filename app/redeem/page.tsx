import ComingSoonCard from "@/components/ComingSoonCard";

export default function RedeemPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Redeem</h1>
                <p className="mt-2 text-zinc-300">
                    Enter a code to unlock rewards. Redemption is not wired yet, so this is a
                    non-functional placeholder.
                </p>
            </div>

            <div className="md:max-w-xl">
                <ComingSoonCard
                    title="Redeem Codes"
                    description="Code redemption is coming soon."
                    items={[
                        "Code input and validation",
                        "Eligibility and expiry checks",
                        "Automatic reward delivery",
                    ]}
                    footer="No backend connected yet."
                />
            </div>
        </div>
    );
}

