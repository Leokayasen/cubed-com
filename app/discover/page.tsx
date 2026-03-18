const features = [
    { title: "Voxel building", desc: "Blocks, materials, lighting, cozy interiors. (Placeholder)" },
    { title: "Multiplayer worlds", desc: "Roblox-ish networking feel, drop-in sessions. (Placeholder)" },
    { title: "Creatures & NPCs", desc: "Friendly critters + simple villagers. (Placeholder)" },
    { title: "Biomes", desc: "Forests, coastlines, caves, snowy peaks. (Placeholder)" },
    { title: "Tools", desc: "Mining, chopping, crafting loops. (Placeholder)" },
    { title: "Customization", desc: "Skins, emotes, cosmetics later. (Placeholder)" },
];

export default function DiscoverPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-semibold">Discover</h1>
                <p className="mt-2 text-zinc-300">
                    Cubed aims for Minecraft-style visuals with a Roblox-style social layer.
                    Everything here is placeholder until you lock the design.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {features.map((f) => (
                    <div key={f.title} className="container-soft p-6">
                        <div className="text-sm font-semibold">{f.title}</div>
                        <p className="mt-2 text-sm text-zinc-300">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
