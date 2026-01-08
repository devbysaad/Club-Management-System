import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
    });

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 space-y-4">
                {students.length === 0 ? (
                    <div className="glass-card rounded-2xl p-8 text-center">
                        <p className="text-[var(--text-muted)]">No children registered yet.</p>
                    </div>
                ) : (
                    students.map((student) => (
                        <div className="glass-card rounded-2xl p-6" key={student.id}>
                            <h1 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-4">
                                📅 {student.firstName} {student.lastName}'s Schedule
                            </h1>
                            <BigCalendarContainer type="classId" id={student.ageGroupId} />
                        </div>
                    ))
                )}
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
};

export default ParentPage;
