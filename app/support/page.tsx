import Link from "next/link";

const supportSections = [
    {
        title: "Cubed Account",
        description: "I need help with my account.",
        href: "/support/account",
        cta: "Open account tips",
    },
    {
        title: "Safety and Moderation",
        description: "User safety and Community Standards.",
        href: "/support/safety",
        cta: "Open Safety and Community Standards.",
    },
    {
        title: "Playing on Cubed",
        description: "I have questions on how to play",
        href: "/support/playing",
        cta: "Open playing on how to play",
    },
    {
        title: "Social Media and Merchandise",
        description: "I'm interested in toys, events and Cubed on social media.",
        href: "/support/social",
        cta: "Open social media",
    }
];

export default function SupportPage() {
    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Support Center</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Central place for help resources, support channels, and platform guidance while
                    Cubed is in active development.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {supportSections.map((section) => (
                    <article key={section.title} className="container-soft p-6">
                        <h2 className="text-lg font-semibold">{section.title}</h2>
                        <p className="mt-2 text-sm text-zinc-300">{section.description}</p>
                        <Link href={section.href}
                              className="mt-4 inline-flex text-sm text-zinc-100 underline-offset-4 hover:underline">
                            {section.cta}
                        </Link>
                    </article>
                ))}
            </section>
        </div>
    );
}

