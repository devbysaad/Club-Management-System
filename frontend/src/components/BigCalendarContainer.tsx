import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
    type,
    id,
}: {
    type: "teacherId" | "classId";
    id: string | number;
}) => {
    const dataRes = await prisma.trainingSession.findMany({
        where: {
            ...(type === "teacherId"
                ? { coachId: id as string }
                : { ageGroupId: id as string }),
        },
    });

    const data = dataRes.map((session) => ({
        title: session.title,
        start: session.startTime,
        end: session.endTime,
    }));

    const schedule = adjustScheduleToCurrentWeek(data);

    return (
        <div className="">
            <BigCalendar data={schedule} />
        </div>
    );
};

export default BigCalendarContainer;
