import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
    title: {
        default: "Cubed — Cozy Voxel Adventure",
        template: "%s · Cubed",
    },
    description:
        "Cubed is an upcoming voxel game with Minecraft-style visuals and Roblox-style networking.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className="dark">
        <body className="min-h-dvh bg-zinc-950 text-zinc-100 antialiased">
        <div className="min-h-dvh">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
            <SiteFooter />
        </div>
        </body>
        </html>
    );
}
