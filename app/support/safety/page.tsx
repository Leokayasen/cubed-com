import Link from "next/link";

const questions = [
    {
        title: "Safety",
        links: [
            { href: "/support/safety/safety-and-civility", label: "Safety and Civilian" },
            { href: "/support/safety/user-data-faq", label: "Cubed & User Data FAQ" },
            { href: "/support/safety/chat-on-cubed", label: "How to Chat on Cubed" },
            { href: "/support/safety/safety-features", label: "Safety Features: Chat, Privacy & Filtering" },
        ],
    },
    {
        title: "Moderation & Guidelines",
        links: [
            { href: "/support/safety/regional-restrictions", label: "Regional Restrictions on Features & Content" },
            { href: "/support/safety/appeal-moderation", label: "Appeal Your Content or Account Moderation" },
            { href: "/support/safety/custom-experience-rules", label: "Understanding Custom Experience Rules on Cubed" },
        ],
    },
    {
        title: "Account Settings",
        links: [
            { href: "support/safety/right-to-access", label: "Right to Access Reports" },
            { href: "support/safety/ads-preferences", label: "Ads Preferences" },
            { href: "support/safety/content-maturity-labels", label: "Content Maturity Labels" },
        ],
    },
    {
        title: "Information",
        links: [
            { href: "support/safety/contact-us", label: "Contact Us" },
            { href: "support/safety/join-bitwave", label: "How can I join the team?" },
            { href: "support/safety/company-information", label: "BitWave Studios Information" },
            { href: "support/safety/language-support", label: "Support Languages: Customer Support" },
            { href: "support/safety/safety-act", label: "Online Safety Act" },
        ]
    },
];

export default function AccountSupportPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Safety & Moderation</h1>
                <p className="mt-2 text-zinc-300">
                    User Safety and Community Standards
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

