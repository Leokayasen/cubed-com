import Link from "next/link";

const questions = [
    {
        title: "Events & Social Media",
        links: [
            { href: "/support/social/cubed-social-media", label: "Cubed on Social Media" },
            { href: "/support/social/cubed-blog", label: "Cubed Blog" },
            { href: "/support/social/redeem-promo", label: "How do I redeem a promo code?" },
        ],
    },
    {
        title: "Features & Updates",
        links: [
            { href: "/support/social/suggestions", label: "Suggestions" },
            { href: "/support/social/next-updates", label: "When is x Feature coming?" },
            { href: "/support/social/cubed-cross-platform", label: "Will Cubed be on other devices?" },
        ],
    },
];

export default function AccountSupportPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Social Media</h1>
                <p className="mt-2 text-zinc-300">
                    I'm interested in merch, events and social media
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {questions.map((questions) => (
                    <section key={questions.title} className="container-soft p-6">
                        <h2 className="text-sm font-semibold">{questions.title}</h2>
                        <ul className="mt-3 grid gap-2 text-sm text-zinc-300">
                            {questions.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}

