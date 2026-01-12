"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const LoginPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    // If already signed in, redirect to admin immediately
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/admin");
        }
    }, [isLoaded, isSignedIn, router]);

    return (
        <div className="min-h-screen flex bg-[var(--bg-primary)]">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-rmBlue relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rmBlue to-rmBlueDark opacity-90"></div>
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                            <span className="text-4xl">⚽</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Pato Hornets</h1>
                        <p className="text-xl text-blue-100">Football Academy Management</p>
                    </div>

                    <div className="space-y-6 mt-12">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">🏆</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Elite Training</h3>
                                <p className="text-blue-100 text-sm">Professional coaching for all skill levels</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Expert Coaches</h3>
                                <p className="text-blue-100 text-sm">15+ years of combined experience</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Track Progress</h3>
                                <p className="text-blue-100 text-sm">Advanced analytics and reporting tools</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/20">
                        <p className="text-blue-100 text-sm">
                            Building Champions Since 2015
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-primary)]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-rmBlue flex items-center justify-center">
                                <span className="text-2xl">⚽</span>
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pato Hornets</h1>
                                <p className="text-sm text-[var(--text-muted)]">Football Academy</p>
                            </div>
                        </div>
                    </div>

                    <SignIn.Root>
                        <SignIn.Step
                            name="start"
                            className="w-full"
                        >
                            {/* Header */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-[var(--text-secondary)]">
                                    Sign in to access your dashboard
                                </p>
                            </div>

                            {/* Global Error */}
                            <Clerk.GlobalError className="block text-sm text-red-600 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg px-4 py-3 mb-4" />

                            {/* Form Fields */}
                            <div className="space-y-5">
                                <Clerk.Field name="identifier" className="space-y-2">
                                    <Clerk.Label className="block text-sm font-semibold text-[var(--text-secondary)]">
                                        Username
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all"
                                        placeholder="Enter your Username"
                                    />
                                    <Clerk.FieldError className="text-sm text-red-600" />
                                </Clerk.Field>

                                <Clerk.Field name="password" className="space-y-2">
                                    <Clerk.Label className="block text-sm font-semibold text-[var(--text-secondary)]">
                                        Password
                                    </Clerk.Label>
                                    <Clerk.Input
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:border-rmBlue focus:ring-2 focus:ring-rmBlue/10 outline-none transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <Clerk.FieldError className="text-sm text-red-600" />
                                </Clerk.Field>
                            </div>

                            {/* Submit Button */}
                            <SignIn.Action
                                submit
                                className="w-full mt-6 py-3.5 rounded-lg bg-rmBlue text-white font-semibold hover:bg-rmBlueDark transition-all shadow-md hover:shadow-lg"
                            >
                                Sign In
                            </SignIn.Action>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Don't have an account?{" "}
                                    <a href="#" className="text-rmBlue font-semibold hover:text-rmBlueDark">
                                        Contact admin
                                    </a>
                                </p>
                            </div>

                            <div className="mt-6 text-center">
                                <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to home
                                </Link>
                            </div>

                            <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
                                By signing in, you agree to our Terms & Privacy Policy
                            </p>
                        </SignIn.Step>
                    </SignIn.Root>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
