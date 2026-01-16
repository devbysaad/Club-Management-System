export const dynamic = "force-dynamic";

import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const TeacherPage = async () => {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
        return (
            <div className="p-4">
                <p>Please log in to view this page.</p>
            </div>
        );
    }

    // Get the coach record to find their coach ID
    const coach = await prisma.coach.findUnique({
        where: {
            userId: userId,
        },
        include: {
            ageGroups: {
                include: {
                    ageGroup: true,
                },
            },
        },
    });

    if (!coach) {
        return (
            <div className="p-4">
                <p>Coach profile not found for this account.</p>
            </div>
        );
    }

    // Get age group IDs that this coach manages
    const ageGroupIds = coach.ageGroups.map((ag) => ag.ageGroupId);

    // Get students in these age groups to find their userIds
    const studentsInAgeGroups = await prisma.student.findMany({
        where: {
            ageGroupId: {
                in: ageGroupIds,
            },
            isDeleted: false,
        },
        select: {
            userId: true,
        },
    });

    const studentUserIds = studentsInAgeGroups.map((s) => s.userId);

    // Get recent orders from these students
    const recentOrders = studentUserIds.length > 0 ? await prisma.jerseyOrder.findMany({
        where: {
            userId: {
                in: studentUserIds,
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
    }) : [];

    // Get recent admissions (approximated - showing recent admissions)
    const recentAdmissions = await prisma.admission.findMany({
        where: {
            status: {
                in: ['PENDING', 'UNDER_REVIEW', 'APPROVED'],
            },
            isDeleted: false,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 space-y-4">
                {/* Recent Orders Section */}
                {recentOrders.length > 0 && (
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-4">
                            🛍️ Recent Jersey Orders
                        </h2>
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="glass-card rounded-xl p-4 border border-[var(--border-color)]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">👕</span>
                                                <div>
                                                    <h3 className="font-heading font-semibold text-[var(--text-primary)]">
                                                        {order.jerseyName} #{order.jerseyNumber}
                                                    </h3>
                                                    <p className="text-xs text-[var(--text-muted)]">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${order.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                                            order.status === 'PROCESSING' ? 'bg-fcBlue/20 text-fcBlue' :
                                                order.status === 'COMPLETED' ? 'bg-fcGreen/20 text-fcGreen' :
                                                    'bg-fcGarnet/20 text-fcGarnet'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Admissions Section */}
                {recentAdmissions.length > 0 && (
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-4">
                            📋 Recent Admissions
                        </h2>
                        <div className="space-y-3">
                            {recentAdmissions.map((admission) => (
                                <div
                                    key={admission.id}
                                    className="glass-card rounded-xl p-4 border border-[var(--border-color)]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-heading font-semibold text-[var(--text-primary)]">
                                                {admission.firstName} {admission.lastName}
                                            </h3>
                                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                                Submitted: {new Date(admission.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${admission.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                                            admission.status === 'UNDER_REVIEW' ? 'bg-fcBlue/20 text-fcBlue' :
                                                admission.status === 'APPROVED' ? 'bg-fcGreen/20 text-fcGreen' :
                                                    'bg-fcGarnet/20 text-fcGarnet'
                                            }`}>
                                            {admission.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Coaching Schedule */}
                <div className="h-full glass-card rounded-2xl p-6">
                    <h1 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                        📅 My Coaching Schedule
                    </h1>
                    <BigCalendarContainer type="teacherId" id={coach.id} />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
};

export default TeacherPage;
