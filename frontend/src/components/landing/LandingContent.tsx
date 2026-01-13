"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";

interface LandingData {
    stats: {
        coaches: number;
        students: number;
    };
    ageGroups: Array<{
        name: string;
        ages: string;
        description: string | null;
    }>;
    coaches: Array<{
        name: string;
        role: string;
        exp: string;
        photo: string | null;
    }>;
}

const LandingContent = ({ data }: { data: LandingData | null }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userId } = useAuth();
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    // Dummy data as fallback if DB is empty or fetch fails
    const defaultStats = [
        { value: data?.stats.students ? `${data.stats.students}+` : "100+", label: "Players Trained" },
        { value: data?.stats.coaches ? `${data.stats.coaches}+` : "15+", label: "Professional Coaches" },
        { value: "All Ages", label: "Training Programs" },
        { value: "95%", label: "Success Rate" },
    ];

    const ageGroups = data?.ageGroups.length ? data.ageGroups : [
        { name: "U-10", ages: "8-10 years", color: "bg-green-500" },
        { name: "U-12", ages: "10-12 years", color: "bg-rmBlue" },
        { name: "U-15", ages: "12-15 years", color: "bg-rmGold" },
        { name: "Senior", ages: "15+ years", color: "bg-gray-800" },
    ];

    const coaches = data?.coaches.length ? data.coaches : [
        { name: "Coach Ahmed", role: "Head Coach", exp: "15+ years", photo: null },
        { name: "Coach Sarah", role: "Youth Development", exp: "10+ years", photo: null },
        { name: "Coach Mike", role: "Fitness Coach", exp: "12+ years", photo: null },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Professional Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--border-color)] shadow-sm backdrop-blur-md bg-opacity-80">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 relative flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Pato Hornets Logo"
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-[var(--text-primary)]">Pato Hornets</span>
                                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Football Academy</span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">

                            <a href="#programs" className="text-sm font-medium text-[var(--text-secondary)] hover:text-rmBlue transition-colors">Programs</a>
                            <a href="#coaches" className="text-sm font-medium text-[var(--text-secondary)] hover:text-rmBlue transition-colors">Coaches</a>

                            <a href="#contact" className="text-sm font-medium text-[var(--text-secondary)] hover:text-rmBlue transition-colors">Contact</a>

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
                                <Link
                                    href="/admin"
                                    className="px-6 py-2.5 rounded-md bg-rmBlue text-white text-sm font-semibold hover:bg-rmBlueDark transition-all shadow-sm"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/sign-in"
                                    className="px-6 py-2.5 rounded-md bg-rmBlue text-white text-sm font-semibold hover:bg-rmBlueDark transition-all shadow-sm"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-surface-light)]"
                        >
                            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
                        <div className="px-6 py-4 space-y-3">
                            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-secondary)] hover:text-rmBlue">About</a>
                            <a href="#programs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-secondary)] hover:text-rmBlue">Programs</a>
                            <a href="#coaches" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-secondary)] hover:text-rmBlue">Coaches</a>
                            <a href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-secondary)] hover:text-rmBlue">Shop</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[var(--text-secondary)] hover:text-rmBlue">Contact</a>
                            {userId ? (
                                <Link href="/admin" className="block px-6 py-3 mt-2 rounded-lg bg-rmBlue text-white text-center font-semibold">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href="/sign-in" className="block px-6 py-3 mt-2 rounded-lg bg-rmBlue text-white text-center font-semibold">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section - Clean & Professional */}
            <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-[var(--bg-surface-light)] to-[var(--bg-primary)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>


                            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                                Build Your<br />
                                <span className="text-rmBlue">Football Legacy</span>
                            </h1>

                            <p className="text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
                                Professional football academy offering world-class coaching and development programs for all ages and skill levels.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/admission" className="px-8 py-4 rounded-lg bg-rmBlue text-white font-semibold text-center hover:bg-rmBlueDark transition-all shadow-md hover:shadow-lg">
                                    Join Academy
                                </a>
                                <a href="#programs" className="px-8 py-4 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-center hover:border-rmBlue hover:text-rmBlue transition-all">
                                    View Programs
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <Image src="/patoAssets/patoCover.jpg" alt="" width={500} height={500} className="rounded-lg" />
                            {/* Floating Stats */}
                            <div className="absolute -bottom-6 -left-6 bg-[var(--bg-surface)] rounded-xl shadow-lg p-6 border border-[var(--border-color)]">
                                <div className="text-3xl font-bold text-rmBlue">{data?.stats.students || 100}+</div>
                                <div className="text-sm text-[var(--text-muted)]">Active Players</div>
                            </div>
                            <div className="absolute -top-6 -right-6 bg-[var(--bg-surface)] rounded-xl shadow-lg p-6 border border-[var(--border-color)]">
                                <div className="text-3xl font-bold text-rmGold">{data?.stats.coaches || 15}+</div>
                                <div className="text-sm text-[var(--text-muted)]">Expert Coaches</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-rmBlue">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {defaultStats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-blue-100 text-sm uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section id="programs" className="py-24 px-6 bg-[var(--bg-surface-light)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-rmBlue uppercase tracking-wider text-sm font-bold">Our Programs</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
                            Age Group Training
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ageGroups.map((team, i) => (
                            <div key={i} className="bg-[var(--bg-surface)] rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-[var(--border-color)]">
                                <div className={`w-16 h-16 rounded-xl ${'color' in team ? team.color as string : 'bg-rmBlue'} flex items-center justify-center mb-6`}>
                                    <span className="text-2xl font-bold text-white">{team.name}</span>
                                </div>
                                <h3 className="font-bold text-xl text-[var(--text-primary)] mb-2">Age Group</h3>
                                <p className="text-[var(--text-muted)]">{team.ages}</p>
                                <button className="mt-6 w-full py-3 rounded-lg border-2 border-[var(--border-color)] text-[var(--text-secondary)] font-semibold hover:border-rmBlue hover:text-rmBlue transition-all">
                                    Learn More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coaches Section */}
            <section id="coaches" className="py-24 px-6 bg-[var(--bg-primary)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-rmBlue uppercase tracking-wider text-sm font-bold">Our Team</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
                            Expert Coaching Staff
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coaches.map((coach, i) => (
                            <div key={i} className="bg-[var(--bg-surface)] rounded-2xl p-8 text-center border border-[var(--border-color)] hover:border-rmBlue transition-all">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-rmBlue to-blue-400 flex items-center justify-center mb-6 overflow-hidden">
                                    {coach.photo ? (
                                        <Image src={coach.photo} alt={coach.name} width={96} height={96} className="object-cover w-full h-full" />
                                    ) : (
                                        <span className="text-5xl">👤</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-xl text-[var(--text-primary)] mb-1">{coach.name}</h3>
                                <p className="text-rmBlue text-sm font-semibold mb-2">{coach.role}</p>
                                <p className="text-[var(--text-muted)] text-sm">10+ Experience</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section - Moved to end before Contact */}
            <section id="about" className="py-24 px-6 bg-[var(--bg-surface-light)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white flex items-center justify-center shadow-xl border border-[var(--border-color)]">
                                <video
                                    className="w-full h-full object-cover"
                                    src="/patoAssets/patoVideo.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            </div>
                        </div>


                        <div className="order-1 md:order-2">
                            <span className="text-rmBlue uppercase tracking-wider text-sm font-bold">About Us</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-6">
                                Welcome to Pato Hornets
                            </h2>
                            <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                                Founded on October 10, 2025, Pato Hornets Football Academy is dedicated to developing the next generation of football stars through excellence in coaching, technical training, and character development.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: "⚽", title: "Technical Excellence", desc: "Advanced ball control and skill development" },
                                    { icon: "🎯", title: "Tactical Training", desc: "Game intelligence and strategic positioning" },
                                    { icon: "💪", title: "Physical Conditioning", desc: "Strength, agility, and endurance programs" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--bg-surface)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                                        <span className="text-3xl">{item.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                                            <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 bg-[var(--bg-surface-light)]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <span className="text-rmBlue uppercase tracking-wider text-sm font-bold">Contact Us</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-6">
                                Get In Touch
                            </h2>
                            <p className="text-lg text-[var(--text-secondary)] mb-8">
                                Ready to start your football journey? Contact us today to learn more about our programs.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: "📍", label: "Location", value: "New City Phase 2, C Block" },
                                    { icon: "📞", label: "Phone", value: "+92 3364 67 63 87" },
                                    { icon: "✉️", label: "Email", value: "patohornets@gmail.com" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-rmBlue/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-2xl">{item.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">{item.label}</p>
                                            <p className="text-base font-semibold text-[var(--text-primary)]">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--bg-surface)] rounded-2xl p-8 shadow-lg border border-[var(--border-color)]">
                            <h3 className="font-bold text-xl text-[var(--text-primary)] mb-6">Send us a message</h3>
                            <form className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                    <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all resize-none" />
                                <button type="submit" className="w-full py-4 rounded-lg bg-rmBlue text-white font-semibold hover:bg-rmBlueDark transition-all shadow-md">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Pato Hornets Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-[var(--text-primary)]">Pato Hornets</span>
                                <span className="text-xs text-[var(--text-muted)]">Football Academy</span>
                            </div>
                        </div>

                        <p className="text-[var(--text-muted)] text-sm">
                            © 2025 Pato Hornets Football Academy. All rights reserved.
                        </p>

                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-rmBlue">Privacy</a>
                            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-rmBlue">Terms</a>
                            <a href="/about" className="text-sm text-[var(--text-muted)] hover:text-rmBlue">About</a>
                            <Link href="/admin" className="text-sm text-rmBlue font-semibold hover:text-rmBlueDark">Dashboard</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingContent;
