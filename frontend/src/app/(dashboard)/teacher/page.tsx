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
    });

    if (!coach) {
        return (
            <div className="p-4">
                <p>Coach profile not found for this account.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
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
