type PlaceholderStatusPanelProps = {
    label: string;
    value: string;
    detail: string;
};

export default function PlaceholderStatusPanel({
    label,
    value,
    detail,
}: PlaceholderStatusPanelProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm md:min-w-64">
            <div className="text-zinc-300">{label}</div>
            <div className="mt-1 text-base font-semibold">{value}</div>
            <div className="mt-2 text-xs text-zinc-400">{detail}</div>
        </div>
    );
}

