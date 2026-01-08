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
        },
    });

    if (!student) {
        return (
            <div className="p-4">
                <p>Student profile not found for this account.</p>
            </div>
        );
    }

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
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
