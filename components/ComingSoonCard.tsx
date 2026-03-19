type ComingSoonCardProps = {
    title: string;
    description: string;
    items?: string[];
    footer?: string;
};

export default function ComingSoonCard({
    title,
    description,
    items = [],
    footer,
}: ComingSoonCardProps) {
    return (
        <div className="container-soft p-6">
            <div className="text-sm font-semibold">{title}</div>
            <p className="mt-2 text-sm text-zinc-300">{description}</p>

            {items.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-zinc-400">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            ) : null}

            {footer ? <div className="mt-4 text-xs text-zinc-500">{footer}</div> : null}
        </div>
    );
}

