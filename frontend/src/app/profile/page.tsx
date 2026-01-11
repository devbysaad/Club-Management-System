import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const ProfilePage = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await currentUser();
    const role = user?.publicMetadata?.role as string | undefined;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="glass-card rounded-3xl p-12 shadow-2xl border border-[var(--border-color)]">

                    {/* Header Section */}
                    <div className="mb-12">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-rmBlue to-blue-400 flex items-center justify-center mb-8 shadow-xl overflow-hidden border-4 border-[var(--bg-secondary)]">
                            {user?.imageUrl ? (
                                <Image
                                    src={user.imageUrl}
                                    alt={user.firstName || "User"}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-5xl">👤</span>
                            )}
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 tracking-tight">
                            {user?.firstName} {user?.lastName}
                        </h1>

                        <div className="inline-block px-4 py-2 rounded-full bg-rmBlue/20 text-rmBlue font-semibold uppercase text-sm tracking-wider border border-rmBlue/30">
                            {role || "User"}
                        </div>
                    </div>

                    {/* Profile Information Section */}
                    <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Email */}
                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-rmBlue uppercase tracking-widest">Email</div>
                                <div className="text-[var(--text-primary)] font-medium">
                                    {user?.emailAddresses?.[0]?.emailAddress || "—"}
                                </div>
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-rmBlue uppercase tracking-widest">Role</div>
                                <div className="text-[var(--text-primary)] font-medium capitalize">
                                    {role || "User"}
                                </div>
                            </div>

                            {/* Username */}
                            {user?.username && (
                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-rmBlue uppercase tracking-widest">Username</div>
                                    <div className="text-[var(--text-primary)] font-medium">
                                        @{user.username}
                                    </div>
                                </div>
                            )}

                            {/* Member Since */}
                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-rmBlue uppercase tracking-widest">Member Since</div>
                                <div className="text-[var(--text-primary)] font-medium">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : "—"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="mt-16 pt-12 border-t border-[var(--border-color)]">
                        <h2 className="text-sm font-bold text-rmBlue uppercase tracking-widest mb-8">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href="/admin"
                                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-rmBlue/50 hover:bg-rmBlue/5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-rmBlue/20 flex items-center justify-center group-hover:bg-rmBlue/30 transition-colors">
                                    <svg className="w-6 h-6 text-rmBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-[var(--text-primary)]">Dashboard</div>
                                    <div className="text-xs text-[var(--text-muted)]">View your dashboard</div>
                                </div>
                            </a>

                            <a
                                href="/about"
                                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-rmBlue/50 hover:bg-rmBlue/5 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-rmBlue/20 flex items-center justify-center group-hover:bg-rmBlue/30 transition-colors">
                                    <svg className="w-6 h-6 text-rmBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold text-[var(--text-primary)]">About Developer</div>
                                    <div className="text-xs text-[var(--text-muted)]">Learn about the developer</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-24 text-sm text-[var(--text-muted)] border-t border-[var(--border-color)] pt-8 text-center">
                        <p>Pato Hornets Football Academy Management System</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
