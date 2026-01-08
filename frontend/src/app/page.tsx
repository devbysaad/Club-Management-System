"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const Homepage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isSignedIn } = useAuth();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue p-[2px]">
                                <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                                    <span className="text-lg font-bold gradient-text">⚽</span>
                                </div>
                            </div>
                            <span className="font-heading font-bold text-lg text-[var(--text-primary)]">
                                Pato <span className="gradient-text">Hornets</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#about" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">About</a>
                            <a href="#teams" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Teams</a>
                            <a href="#coaches" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Coaches</a>
                            <a href="#contact" className="text-sm text-[var(--text-muted)] hover:text-fcGold transition-colors">Contact</a>
                            {isSignedIn && (
                                <Link href="/shop" className="text-sm text-fcGold hover:text-fcGold/80 transition-colors font-semibold">
                                    Shop Now
                                </Link>
                            )}
                            <Link
                                href={isSignedIn ? "/admin" : "/sign-in"}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fcGarnet to-fcBlue text-white text-sm font-semibold shadow-glow-garnet hover:opacity-90 transition-opacity"
                            >
                                {isSignedIn ? "Dashboard" : "Login"}
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg"
                        >
                            <svg className="w-6 h-6 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass border-t border-[var(--border-color)] p-4">
                        <div className="flex flex-col gap-3">
                            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2">About</a>
                            <a href="#teams" onClick={() => setMobileMenuOpen(false)} className="py-2">Teams</a>
                            <a href="#coaches" onClick={() => setMobileMenuOpen(false)} className="py-2">Coaches</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2">Contact</a>
                            {isSignedIn && (
                                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="py-2 text-fcGold font-semibold">
                                    Shop Now
                                </Link>
                            )}
                            <Link href={isSignedIn ? "/admin" : "/sign-in"} className="px-6 py-3 rounded-xl bg-gradient-to-r from-fcGarnet to-fcBlue text-white text-center font-semibold">
                                {isSignedIn ? "Dashboard" : "Login"}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
                <div className="absolute inset-0 opacity-20 hero-pattern" />
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-fcGarnet/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-fcBlue/20 rounded-full blur-3xl" />

                <div className="relative z-10 text-center max-w-5xl mx-auto">
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fcGold/10 border border-fcGold/20 text-fcGold text-sm font-medium">
                            <span className="w-2 h-2 bg-fcGold rounded-full animate-pulse" />
                            Building Champions Since 2015
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading font-black text-[var(--text-primary)] mb-6">
                        PATO <span className="gradient-text">HORNETS</span>
                    </h1>

                    <p className="text-xl text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
                        Premier football academy offering world-class training for all ages
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#contact" className="px-8 py-4 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-bold shadow-glow-garnet hover:scale-105 transition-transform">
                            Join Academy
                        </a>
                        <a href="#about" className="px-8 py-4 rounded-xl border-2 border-fcGold/50 text-fcGold font-heading font-bold hover:bg-fcGold/10 transition-colors">
                            Learn More
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: "100+", label: "Players" },
                            { value: "15+", label: "Coaches" },
                            { value: "All Ages", label: "Programs" },
                            { value: "95%", label: "Satisfaction" },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6">
                                <p className="text-4xl font-heading font-bold text-fcGold">{stat.value}</p>
                                <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-fcGold uppercase tracking-widest text-sm font-semibold">About Us</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mt-4 mb-6">
                            Welcome to <span className="gradient-text">Pato Hornets</span>
                        </h2>
                        <p className="text-lg text-[var(--text-muted)] mb-8">
                            Celebrated its opening on October 10, 2025, Pato Hornets Football Academy is dedicated to nurturing the next generation of football stars through technical excellence and character development.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: "⚽", title: "Technical Excellence", desc: "Master ball control and skills" },
                                { icon: "🎯", title: "Tactical Awareness", desc: "Game intelligence and positioning" },
                                { icon: "💪", title: "Physical Development", desc: "Strength and conditioning" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-surface)]">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <h3 className="font-heading font-semibold text-[var(--text-primary)]">{item.title}</h3>
                                        <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="glass-card rounded-3xl p-4">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-fcGarnet/20 to-fcBlue/20 flex items-center justify-center">
                                <span className="text-8xl">⚽</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Teams Section */}
            <section id="teams" className="py-24 px-4 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-fcGold uppercase tracking-widest text-sm font-semibold">Our Teams</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mt-4">
                            Age Group <span className="gradient-text">Programs</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "U-10", ages: "8-10 years", color: "from-fcGreen to-fcGreen/50" },
                            { name: "U-12", ages: "10-12 years", color: "from-fcBlue to-fcBlue/50" },
                            { name: "U-15", ages: "12-15 years", color: "from-fcGold to-fcGold/50" },
                            { name: "Senior", ages: "15+ years", color: "from-fcGarnet to-fcGarnet/50" },
                        ].map((team, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${team.color} flex items-center justify-center mb-4`}>
                                    <span className="text-2xl font-heading font-bold text-white">{team.name}</span>
                                </div>
                                <h3 className="font-heading font-bold text-xl text-[var(--text-primary)]">{team.ages}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coaches Section */}
            <section id="coaches" className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-fcGold uppercase tracking-widest text-sm font-semibold">Our Staff</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mt-4">
                            Expert <span className="gradient-text">Coaching Team</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Coach Ahmed", role: "Head Coach", exp: "15+ years" },
                            { name: "Coach Sarah", role: "Youth Development", exp: "10+ years" },
                            { name: "Coach Mike", role: "Fitness Coach", exp: "12+ years" },
                        ].map((coach, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 text-center">
                                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue p-1 mb-4">
                                    <div className="w-full h-full rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                                        <span className="text-4xl">👤</span>
                                    </div>
                                </div>
                                <h3 className="font-heading font-bold text-xl text-[var(--text-primary)]">{coach.name}</h3>
                                <p className="text-fcGold text-sm font-medium">{coach.role}</p>
                                <p className="text-[var(--text-muted)] text-sm mt-2">{coach.exp} Experience</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-4 bg-[var(--bg-surface)]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                    <div>
                        <span className="text-fcGold uppercase tracking-widest text-sm font-semibold">Contact Us</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mt-4 mb-6">
                            Get In <span className="gradient-text">Touch</span>
                        </h2>
                        <p className="text-lg text-[var(--text-muted)] mb-8">
                            Ready to start your football journey? Contact us today!
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: "📍", label: "Location", value: "New City Phase 2, C Block" },
                                { icon: "📞", label: "Phone", value: "+92 3364 67 63 87" },
                                { icon: "✉️", label: "Email", value: "patohornets@gmail.com" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-fcGarnet/10 flex items-center justify-center">
                                        <span className="text-xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                                        <p className="text-base font-medium text-[var(--text-primary)]">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-8">
                        <h3 className="font-heading font-bold text-xl text-[var(--text-primary)] mb-6">Send a message</h3>
                        <form className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none" />
                                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none" />
                            </div>
                            <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none" />
                            <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-fcGarnet focus:outline-none resize-none" />
                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white font-heading font-bold shadow-glow-garnet hover:opacity-90 transition-opacity">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <span className="font-heading font-bold text-lg text-[var(--text-primary)]">
                            Pato <span className="gradient-text">Hornets</span>
                        </span>
                    </div>

                    <p className="text-[var(--text-muted)] text-sm">
                        © 2025 Pato Hornets Football Academy. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-fcGold">Privacy</a>
                        <a href="#" className="text-sm text-[var(--text-muted)] hover:text-fcGold">Terms</a>
                        <Link href="/admin" className="text-sm text-fcGold font-semibold">Dashboard</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;
