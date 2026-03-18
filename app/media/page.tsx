export default function MediaPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Media</h1>
                <p className="mt-2 text-zinc-300">
                    Screenshots and trailers will go here. For now, placeholders.
                </p>
            </div>

            <div className="container-soft p-6">
                <div className="text-sm font-semibold">Trailer (placeholder)</div>
                <div className="mt-3 aspect-video w-full rounded-2xl border border-white/10 bg-white/5" />
                <p className="mt-3 text-sm text-zinc-300">
                    Later you can embed YouTube/Vimeo and replace with real footage.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5"
                        title={`Screenshot ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
