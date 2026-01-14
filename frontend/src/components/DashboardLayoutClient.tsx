"use client";

import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayoutClient({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex overflow-hidden bg-[var(--bg-primary)]">
            {/* LEFT SIDEBAR */}
            <div className="w-16 lg:w-64 flex-shrink-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col overflow-hidden">
                {/* Logo Section */}
                <div className="p-3 lg:p-5">
                    <Link
                        href="/"
                        className="flex items-center justify-center lg:justify-start gap-3 group"
                    >
                        {/* Club Badge/Logo */}
                        <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue p-[2px] group-hover:shadow-glow-garnet transition-all duration-300 flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-[var(--bg-sidebar)] flex items-center justify-center">
                                <Image src="/logo.png" alt="Logo" width={50} height={50} />
                            </div>
                        </div>
                        {/* Club Name - Hidden on mobile */}
                        <div className="hidden lg:flex flex-col">
                            <span className="font-heading font-bold text-lg text-[var(--text-primary)] tracking-wide whitespace-nowrap">
                                Pato <span className="gradient-text">Hornets</span>
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">
                                Football Academy
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Accent Line */}
                <div className="mx-3 lg:mx-4 h-[2px] bg-gradient-to-r from-fcGarnet via-fcBlue to-fcGold rounded-full opacity-40 flex-shrink-0" />

                {/* Menu */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Menu />
                </div>

                {/* Bottom Section - Season Info */}
                <div className="p-3 lg:p-4 flex-shrink-0">
                    {/* Mobile: Small indicator */}
                    <div className="lg:hidden flex flex-col items-center gap-1">
                        <div className="w-2 h-2 bg-fcGreen rounded-full animate-pulse" />
                        <span className="text-[9px] text-fcGold font-bold">25/26</span>
                    </div>

                    {/* Desktop: Full card */}
                    <div className="hidden lg:block glass-card rounded-xl p-4 border border-[var(--border-color)]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-fcGreen rounded-full animate-pulse" />
                            <span className="text-xs text-[var(--text-muted)]">Season Active</span>
                        </div>
                        <p className="text-fcGold font-heading font-bold text-lg">
                            2025/26
                        </p>
                        <p className="text-[10px] text-[var(--text-dim)] mt-1">
                            Matchday 24 of 38
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="page-transition">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
