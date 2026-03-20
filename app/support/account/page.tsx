import Link from "next/link";

const questions = [
    {
        title: "Protect Your Account",
        links: [
            { href: "/support/account/keep-your-account-safe", label: "Keep Your Account Safe" },
            { href: "/support/account/account-protection", label: "Account Session Protection" },
            { href: "/support/account/account-hacked", label: "My account was hacked - What do I do?" },
            { href: "/support/account/verifying-address", label: "Verifying your Email Address or Phone Number" },
            { href: "/support/account/2fa-verification", label: "Add 2-Step Verification" },
            { href: "/support/account/2fa-troubleshooting", label: "Troubleshooting 2-Step Verification" },
            { href: "/support/account/change-password-banner", label: "Why am I seeing a banner asking me to change my Password?" }
        ],
    },
    {
        title: "Account Settings",
        links: [
            { href: "/support/account/managing-notifications", label: "Managing Cubed Notifications" },
            { href: "/support/account/visibility", label: "Online Status and Visibility" },
            { href: "/support/account/change-password", label: "How do I change my password?" },
            { href: "/support/account/account-deactivation", label: "How do I delete or deactivate my account?" },
            { href: "/support/account/changing-username", label: "How do I change my username?" },
            { href: "/support/account/changing-displayname", label: "How do I change my display name?" },
        ],
    },
    {
        title: "Logging In",
        links: [
            { href: "support/account/forgot-password", label: "I Forgot my Password" },
            { href: "/support/account/switch-account", label: "Account Switching" },
            { href: "/support/account/forgot-username", label: "I Forgot my Username" },
            { href: "/support/account/email-login", label: "Logging in with your Email" },
            { href: "/support/account/quick-login", label: "Quick Login" },
        ],
    },
];

export default function AccountSupportPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Cubed Account</h1>
                <p className="mt-2 text-zinc-300">
                    I need help with my account
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

