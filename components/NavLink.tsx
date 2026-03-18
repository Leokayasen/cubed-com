"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={[
                "rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5 hover:text-white",
            ].join(" ")}
        >
            {label}
        </Link>
    );
}
