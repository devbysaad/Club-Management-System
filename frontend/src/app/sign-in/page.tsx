"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    useEffect(() => {
        console.log(" SIGN-IN PAGE useEffect triggered");
        console.log("  isLoaded:", isLoaded);
        console.log("  isSignedIn:", isSignedIn);

        if (!isLoaded || !isSignedIn) {
            console.log("  ⏸️ Waiting for auth to load...");
            return;
        }

        const role = user?.publicMetadata?.role;
        console.log("   User role from publicMetadata:", role);
        console.log("   Full publicMetadata:", user?.publicMetadata);

        if (role) {
            // Role-based redirect after login
            const roleRoutes: Record<string, string> = {
                admin: "/admin",
                teacher: "/list/teachers",
                student: "/admin", // Students redirect to admin (dashboard) since they can't access /list/students
                parent: "/admin", // Parents redirect to admin (dashboard) since they can't access /list/parents
            };

            const targetRoute = roleRoutes[role as string];
            console.log("   Target route for role:", targetRoute);

            if (targetRoute) {
                console.log("   CLIENT-SIDE REDIRECT to:", targetRoute);
                // Small delay to ensure components are ready
                setTimeout(() => {
                    router.push(targetRoute);
                }, 100);
            }
        } else {
            console.log("  NO ROLE - Not redirecting");
        }
    }, [user, router, isLoaded, isSignedIn]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fcDarkBg via-fcSurface to-fcDarkBg px-4 relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Glow Orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-fcGarnet/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-fcBlue/10 rounded-full blur-3xl" />

            <SignIn.Root>
                <SignIn.Step
                    name="start"
                    className="relative z-10 w-full max-w-md space-y-6 rounded-2xl glass-card border border-fcBorder px-6 py-10 shadow-xl sm:px-10"
                >
                    {/* Header */}
                    <header className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fcGarnet to-fcBlue mb-4 shadow-glow-garnet">
                            <span className="text-3xl">⚽</span>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-white">
                            Sign in to FC Manager
                        </h1>
                        <p className="mt-2 text-sm text-fcTextMuted">
                            Enter your credentials to continue
                        </p>
                    </header>

                    {/* Global Error */}
                    <Clerk.GlobalError className="block text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2" />

                    {/* Fields */}
                    <div className="space-y-4">
                        <Clerk.Field name="identifier" className="space-y-2">
                            <Clerk.Label className="text-sm text-fcTextMuted">
                                Email or Username
                            </Clerk.Label>
                            <Clerk.Input
                                type="text"
                                required
                                className="w-full rounded-lg bg-fcSurface border border-fcBorder px-4 py-2.5 text-sm text-white outline-none transition-all hover:border-fcGarnet/50 focus:border-fcGarnet focus:ring-2 focus:ring-fcGarnet/20"
                            />
                            <Clerk.FieldError className="text-sm text-red-400" />
                        </Clerk.Field>

                        <Clerk.Field name="password" className="space-y-2">
                            <Clerk.Label className="text-sm text-fcTextMuted">
                                Password
                            </Clerk.Label>
                            <Clerk.Input
                                type="password"
                                required
                                className="w-full rounded-lg bg-fcSurface border border-fcBorder px-4 py-2.5 text-sm text-white outline-none transition-all hover:border-fcGarnet/50 focus:border-fcGarnet focus:ring-2 focus:ring-fcGarnet/20"
                            />
                            <Clerk.FieldError className="text-sm text-red-400" />
                        </Clerk.Field>
                    </div>

                    {/* Submit */}
                    <SignIn.Action
                        submit
                        className="w-full rounded-lg bg-gradient-to-r from-fcGarnet to-fcBlue py-2.5 text-sm font-semibold text-white shadow-glow-garnet hover:opacity-90 transition-all active:scale-[0.98]"
                    >
                        Sign In
                    </SignIn.Action>

                    {/* Footer */}
                    <p className="text-center text-xs text-fcTextDim mt-4">
                        By signing in, you agree to our Terms & Privacy Policy
                    </p>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    );
};

export default LoginPage;
