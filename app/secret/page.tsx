import ComingSoonCard from "@/components/ComingSoonCard";

export default function RedeemPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Shhh</h1>
                <p className="mt-2 text-zinc-300">
                    This is a secret area for Early Access.
                    If you are seeing this, you are one of the lucky few who have found this exclusive content.
                </p>

                <p>
                    We hope you enjoy exploring this hidden gem and discovering all the exciting features it has to offer.
                    Thank you for being part of our early access community!
                </p>
            </div>

            <div className="md:max-w-xl">
                <ComingSoonCard
                    title="Shhhh..."
                    description="This is a secret area for Early Access."
                    footer="Coming Soon."
                />
            </div>
        </div>
    );
}

