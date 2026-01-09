"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { useAuth } from "@clerk/nextjs";
import { createAdmission, AdmissionSchema } from "@/lib/admission-actions";
import { useRouter } from "next/navigation";

const AdmissionPage = () => {
    const { theme, toggleTheme } = useTheme();
    const { userId } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());

        // Basic validation & formatting
        const admissionData: AdmissionSchema = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            sex: data.sex as "MALE" | "FEMALE",
            address: data.address,
            parentName: data.parentName,
            parentPhone: data.parentPhone,
            position: data.position,
            notes: data.notes,
        };

        const res = await createAdmission(admissionData);

        if (res.success) {
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setError(res.message || "Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Application Submitted!</h1>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md">
                    Thank you for applying to Pato Hornets Football Academy. Our team will review your application and contact you soon.
                </p>
                <Link href="/" className="px-8 py-3 bg-rmBlue text-white rounded-lg font-semibold hover:bg-rmBlueDark transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-surface)] border-b border-[var(--border-color)] shadow-sm backdrop-blur-md bg-opacity-80">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                            <span className="font-bold text-lg text-[var(--text-primary)]">Pato Hornets</span>
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-sm font-medium text-[var(--text-secondary)] hover:text-rmBlue">Home</Link>
                            <button onClick={toggleTheme} className="p-2 rounded-lg bg-[var(--bg-surface-light)] border border-[var(--border-color)] text-[var(--text-primary)]">
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            {userId ? (
                                <Link href="/admin" className="px-5 py-2 bg-rmBlue text-white rounded-md text-sm font-semibold">Dashboard</Link>
                            ) : (
                                <Link href="/sign-in" className="px-5 py-2 bg-rmBlue text-white rounded-md text-sm font-semibold">Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-rmBlue uppercase tracking-wider text-sm font-bold">Join the Academy</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-6">Admission Form</h1>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Fill out the details below to apply for a spot in our elite football development program.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] rounded-2xl p-8 shadow-xl border border-[var(--border-color)] space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Student Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-rmBlue/10 text-rmBlue flex items-center justify-center text-sm">1</span>
                                Player Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">First Name *</label>
                                    <input required name="firstName" type="text" placeholder="John" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Last Name *</label>
                                    <input required name="lastName" type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Email Address *</label>
                                    <input required name="email" type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Phone Number *</label>
                                    <input required name="phone" type="tel" placeholder="+92 ..." className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Date of Birth *</label>
                                    <input required name="dateOfBirth" type="date" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Gender *</label>
                                    <select required name="sex" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all appearance-none cursor-pointer">
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Preferred Position</label>
                                    <input name="position" type="text" placeholder="e.g. Forward, Midfielder, Goalkeeper" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Home Address *</label>
                                    <textarea required name="address" rows={2} placeholder="Enter your full address" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Parent Information */}
                        <div className="space-y-6 pt-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-rmGold/10 text-rmGold flex items-center justify-center text-sm">2</span>
                                Parent / Guardian Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Parent Full Name *</label>
                                    <input required name="parentName" type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)]">Parent Phone Number *</label>
                                    <input required name="parentPhone" type="tel" placeholder="+92 ..." className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-6 pt-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm">3</span>
                                Additional Details
                            </h3>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)]">Notes / Experience</label>
                                <textarea name="notes" rows={4} placeholder="Tell us about your previous football experience or any special requirements..." className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all resize-none"></textarea>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-rmBlue text-white font-bold rounded-xl hover:bg-rmBlueDark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {loading ? "Submitting..." : "Submit Application"}
                            </button>
                            <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                                By submitting, you agree to our terms and conditions for academy trial and training.
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-surface)] mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[var(--text-muted)] text-sm">
                        © 2026 Pato Hornets Football Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdmissionPage;
