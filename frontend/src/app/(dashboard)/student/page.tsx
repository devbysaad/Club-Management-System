export const dynamic = "force-dynamic";

import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
        return (
            <div className="p-4">
                <p>Please log in to view this page.</p>
            </div>
        );
    }

    // Get the student record
    const student = await prisma.student.findUnique({
        where: {
            userId: userId,
        },
        include: {
            ageGroup: true,
            parent: true,
        },
    });

    if (!student) {
        return (
            <div className="p-4">
                <p>Student profile not found for this account.</p>
            </div>
        );
    }

    // Get siblings (other students with the same parent)
    const siblings = await prisma.student.findMany({
        where: {
            parentId: student.parentId,
            id: {
                not: student.id, // Exclude the current student
            },
        },
        include: {
            ageGroup: true,
        },
    });

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 space-y-4">
                {/* My Family Section */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-6">
                        👨‍👩‍👧‍👦 My Family
                    </h2>

                    {/* Parent Info */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">Parent/Guardian</h3>
                        <div className="glass-card rounded-xl p-4 border border-[var(--border-color)]">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fcGarnet to-fcBlue flex items-center justify-center text-xl">
                                    👤
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-heading font-semibold text-[var(--text-primary)]">
                                        {student.parent.firstName} {student.parent.lastName}
                                    </h4>
                                    {student.parent.email && (
                                        <p className="text-sm text-[var(--text-muted)] mt-1">
                                            📧 {student.parent.email}
                                        </p>
                                    )}
                                    {student.parent.phone && (
                                        <p className="text-sm text-[var(--text-muted)] mt-1">
                                            📞 {student.parent.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Siblings */}
                    {siblings.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">Siblings</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {siblings.map((sibling) => (
                                    <div
                                        key={sibling.id}
                                        className="glass-card rounded-xl p-4 border border-[var(--border-color)] hover:border-fcGold transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fcGold to-fcGoldLight flex items-center justify-center text-lg">
                                                {sibling.photo ? (
                                                    <img
                                                        src={sibling.photo}
                                                        alt={sibling.firstName}
                                                        className="w-full h-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    "⚽"
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-heading font-medium text-[var(--text-primary)]">
                                                    {sibling.firstName} {sibling.lastName}
                                                </h4>
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {sibling.ageGroup.name}
                                                </p>
                                                {sibling.position && (
                                                    <p className="text-xs text-fcGold mt-1">
                                                        {sibling.position}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* My Schedule */}
                <div className="h-full glass-card rounded-2xl p-6">
                    <h1 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                        📅 My Schedule ({student.ageGroup.name})
                    </h1>
                    <BigCalendarContainer type="classId" id={student.ageGroupId} />
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

export default StudentPage;
