"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "@/lib/ThemeContext";

const AboutPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userId } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const socialLinks = [
        {
            name: "GitHub",
            url: "https://github.com/devbysaad",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/muhammad-saad-972185381/",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            )
        },
        {
            name: "X (Twitter)",
            url: "https://x.com/maisaadhon",
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Minimal Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--border-color)] backdrop-blur-md bg-opacity-80">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 relative flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Pato Hornets Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="font-bold text-lg text-[var(--text-primary)]">Pato Hornets</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-rmBlue transition-colors">Home</Link>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-[var(--bg-surface-light)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                <svg className="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1m-16 0h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                                <svg className="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>

                            {userId ? (
                                <Link href="/admin" className="px-5 py-2 rounded-md bg-rmBlue text-white text-sm font-semibold hover:bg-rmBlueDark transition-all">Dashboard</Link>
                            ) : (
                                <Link href="/sign-in" className="px-5 py-2 rounded-md bg-rmBlue text-white text-sm font-semibold hover:bg-rmBlueDark transition-all">Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-12">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-rmBlue to-blue-400 flex items-center justify-center mb-8 shadow-xl overflow-hidden border-4 border-[var(--bg-secondary)]">
                            <Image
                                src="/devbysaad.jpg"
                                alt="Muhammad Saad"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 tracking-tight">
                            Muhammad Saad
                        </h1>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-8 text-lg text-[var(--text-secondary)] leading-relaxed">
                        <p>
                            I am a web developer and I work as a freelancer. I build websites and web
                            apps using modern tools like Next.js.
                        </p>

                        <p>
                            Currently, I am working with{" "}
                            <span className="text-rmBlue font-semibold">
                                Pato Hornets Football Academy
                            </span>{" "}
                            as a freelance developer.
                        </p>

                        <p>
                            This website is a project I built for them to manage players, admissions,
                            and other academy work.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="mt-16 pt-12 border-t border-[var(--border-color)]">
                        <h2 className="text-sm font-bold text-rmBlue uppercase tracking-widest mb-8">
                            Connect with me
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-rmBlue hover:text-rmBlue transition-all shadow-sm hover:shadow-md group"
                                >
                                    <span className="text-[var(--text-secondary)] group-hover:text-rmBlue transition-colors">
                                        {link.icon}
                                    </span>
                                    <span className="font-semibold">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-24 text-sm text-[var(--text-muted)] border-t border-[var(--border-color)] pt-8 text-center">
                        <p>© 2026 Muhammad Saad. Built in Pakistan.</p>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AboutPage;
