import Link from "next/link";

const sections = [
    {
        title: "Explore",
        links: [
            { href: "/", label: "Home" },
            { href: "/discover", label: "Discover" },
            { href: "/media", label: "Media" },
            { href: "/devlog", label: "Devlog" },
            { href: "/community", label: "Community" },
            { href: "/playtest", label: "Playtest" },
        ],
    },
    {
        title: "Support",
        links: [
            { href: "/support/feedback", label: "Feedback" },
            { href: "/support/players", label: "Tips for Players" },
            { href: "/support/devs", label: "Tips for Developers" },
            { href: "/support/download", label: "Download" },
            { href: "/support/contact", label: "Contact Us" },
        ],
    },
    {
        title: "Account and Shop",
        links: [
            { href: "/account", label: "Account" },
            { href: "/redeem", label: "Redeem" },
            { href: "/marketplace", label: "Marketplace" },
            { href: "/giftcards", label: "Giftcards" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: "/legal/terms", label: "Terms" },
            { href: "/legal/privacy", label: "Privacy" },
            { href: "/legal/eula", label: "EULA" },
        ],
    },
];

export default function SupportSitemapPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Site Map</h1>
                <p className="mt-2 text-zinc-300">Browse key pages across the Cubed website.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {sections.map((section) => (
                    <section key={section.title} className="container-soft p-6">
                        <h2 className="text-sm font-semibold">{section.title}</h2>
                        <ul className="mt-3 grid gap-2 text-sm text-zinc-300">
                            {section.links.map((link) => (
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

