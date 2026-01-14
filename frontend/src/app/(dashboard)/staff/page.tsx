export const dynamic = "force-dynamic";

import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StaffPage = async () => {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
        return (
            <div className="p-4">
                <p>Please log in to view this page.</p>
            </div>
        );
    }

    // Get the staff member record
    const staff = await prisma.staff.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!staff) {
        return (
            <div className="p-4">
                <p>Staff profile not found for this account.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 space-y-4">
                {/* Staff Profile Section */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
                            👨‍💼 Staff Dashboard
                        </h1>
                    </div>

                    <div className="glass-card rounded-xl p-6 border border-[var(--border-color)]">
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center text-4xl">
                                👤
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-2">
                                    {staff.firstName} {staff.lastName}
                                </h2>
                                <div className="space-y-2 text-[var(--text-muted)]">
                                    {staff.email && (
                                        <p className="flex items-center gap-2">
                                            <span className="text-fcGold">📧</span>
                                            {staff.email}
                                        </p>
                                    )}
                                    {staff.phone && (
                                        <p className="flex items-center gap-2">
                                            <span className="text-fcGold">📱</span>
                                            {staff.phone}
                                        </p>
                                    )}
                                    {staff.address && (
                                        <p className="flex items-center gap-2">
                                            <span className="text-fcGold">📍</span>
                                            {staff.address}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-fcGarnet/20 border border-fcGarnet/30">
                                    <span className="text-fcGarnet font-semibold text-sm">
                                        ⭐ Staff Member
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-xl p-6 border border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-fcBlue/20 flex items-center justify-center text-2xl">
                                🎯
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Role</p>
                                <p className="text-lg font-heading font-bold text-[var(--text-primary)]">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 border border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-fcGreen/20 flex items-center justify-center text-2xl">
                                ✅
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Status</p>
                                <p className="text-lg font-heading font-bold text-fcGreen">
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 border border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-fcGold/20 flex items-center justify-center text-2xl">
                                🔐
                            </div>
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">Access</p>
                                <p className="text-lg font-heading font-bold text-[var(--text-primary)]">
                                    Full Access
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
};

export default StaffPage;
