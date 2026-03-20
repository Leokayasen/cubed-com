import Link from "next/link";

const questions = [
    {
        title: "Experience Visit",
        links: [
            { href: "/support/playing/capture-share-discover", label: "Cubed Moments How to Capture, Share and Discover" },
            { href: "/support/playing/experience-controls", label: "Experience Controls" },
            { href: "/support/playing/cubed-experiences", label: "Experiences on Cubed" },
            { href: "/support/playing/contact-creator-for-help", label: "Contacting an Experience's Creators for Help" },
            { href: "/support/playing/hardware-and-requirements", label: "Computer Hardware & Operating System Requirements" },
            { href: "/support/playing/in-game-settings", label: "In-experience Settings and Help" },
        ],
    },
    {
        title: "Friends & Followers",
        links: [
            { href: "/support/playing/friend-invite-rewards", label: "Friend Invite Reward System" },
            { href: "/support/playing/how-to-make-friends", label: "How to make Friends" },
        ],
    },
    {
        title: "Communicating across experiences",
        links: [
            { href: "support/playing/enable-voice-chat", label: "How do I enable Voice Chat?" },
            { href: "support/playing/party-faq", label: "Party FAQ" },
            { href: "support/playing/party-chat", label: "Party Chat" },
            { href: "support/playing/connect-faq", label: "Cubed Connect FAQ" },
        ],
    },
    {
        title: "Communicating in experiences",
        links: [
            { href: "support/playing/enable-voice-chat", label: "How do I enable Voice Chat?" },
            { href: "support/playing/voice-faq", label: "Voice FAQ" },
            { href: "support/playing/game-chat", label: "Experience Chat" },
            { href: "support/playing/chat-translation", label: "Automatic Chat Translation" },
        ]
    }
];

export default function AccountSupportPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Playing on Cubed</h1>
                <p className="mt-2 text-zinc-300">
                    I have questions on how to play
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

