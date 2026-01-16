export const dynamic = "force-dynamic";

import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getOrdersByUserId } from "@/lib/order-actions";
import { getAdmissionsByParentEmail } from "@/lib/admission-actions";

const ParentPage = async () => {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
        return (
            <div className="p-4">
                <p>Please log in to view this page.</p>
            </div>
        );
    }

    // First get the parent record to find their ID
    const parent = await prisma.parent.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!parent) {
        return (
            <div className="p-4">
                <p>Parent profile not found for this account.</p>
            </div>
        );
    }

    // Get all students for this parent
    const students = await prisma.student.findMany({
        where: {
            parentId: parent.id,
        },
        include: {
            ageGroup: true,
        },
    });

    // Get jersey orders for this parent
    const orders = await getOrdersByUserId(userId);

    // Get admission applications by parent email
    const admissions = parent.email ? await getAdmissionsByParentEmail(parent.email) : [];

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 space-y-4">
                {/* Admission Applications Section */}
                {admissions.length > 0 && (
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-4">
                            📋 Admission Applications
                        </h2>
                        <div className="space-y-3">
                            {admissions.map((admission) => (
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${admission.status === 'PENDING' ? 'bg-fcGold/20 text-fcGold' :
                                                admission.status === 'UNDER_REVIEW' ? 'bg-fcBlue/20 text-fcBlue' :
                                                    admission.status === 'APPROVED' ? 'bg-fcGreen/20 text-fcGreen' :
                                                        admission.status === 'CONVERTED' ? 'bg-fcGreen/20 text-fcGreen' :
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

                {/* My Children Section */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
                            👨‍👩‍👧‍👦 My Children
                        </h1>
                        <Link
                            href="/list/students"
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-fcGarnet to-fcGarnetLight text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            View All Players
                        </Link>
                    </div>

                    {students.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[var(--text-muted)]">No children registered yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    className="glass-card rounded-xl p-4 border border-[var(--border-color)] hover:border-fcGarnet transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center text-2xl">
                                            {student.photo ? (
                                                <img
                                                    src={student.photo}
                                                    alt={student.firstName}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                "⚽"
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-heading font-semibold text-[var(--text-primary)]">
                                                {student.firstName} {student.lastName}
                                            </h3>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                {student.ageGroup.name}
                                            </p>
                                            {student.position && (
                                                <p className="text-xs text-fcGold mt-1">
                                                    Position: {student.position}
                                                </p>
                                            )}
                                            {student.jerseyNumber && (
                                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                                    Jersey #: {student.jerseyNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My Orders Section */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-4">
                        🛍️ My Jersey Orders
                    </h2>
                    {orders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-[var(--text-muted)]">No orders yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="glass-card rounded-xl p-4 border border-[var(--border-color)] hover:border-fcGold transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl">👕</span>
                                                <div>
                                                    <h3 className="font-heading font-semibold text-[var(--text-primary)]">
                                                        {order.jerseyName} #{order.jerseyNumber}
                                                    </h3>
                                                    <p className="text-xs text-[var(--text-muted)]">
                                                        Ordered: {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-xs text-[var(--text-muted)] mt-2">
                                                <div>
                                                    <span className="font-medium">Shirt:</span> {order.shirtSize}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Shorts:</span> {order.shortsSize}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Socks:</span> {order.socksSize}
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
                    )}
                </div>

                {/* Schedules for each child */}
                {students.length > 0 && students.map((student) => (
                    <div className="glass-card rounded-2xl p-6" key={student.id}>
                        <h2 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                            📅 {student.firstName} {student.lastName}&apos;s Schedule
                        </h2>
                        <BigCalendarContainer type="classId" id={student.ageGroupId} />
                    </div>
                ))}
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
};

export default ParentPage;
