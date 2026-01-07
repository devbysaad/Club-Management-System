import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);

    // Fetch attendance records with the training session date
    const resData = await prisma.attendance.findMany({
        where: {
            trainingSession: {
                date: {
                    gte: lastMonday,
                },
            },
        },
        select: {
            status: true,
            trainingSession: {
                select: {
                    date: true,
                },
            },
        },
    });

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
    };

    resData.forEach((item) => {
        const itemDate = new Date(item.trainingSession.date);
        const dayOfWeek = itemDate.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1];

            // Count PRESENT and LATE as present, ABSENT and EXCUSED as absent
            if (item.status === "PRESENT" || item.status === "LATE") {
                attendanceMap[dayName].present += 1;
            } else {
                attendanceMap[dayName].absent += 1;
            }
        }
    });

    const data = daysOfWeek.map((day) => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent,
    }));

    // Debug logging
    console.log("📊 Attendance Data:", {
        totalRecords: resData.length,
        attendanceMap,
        chartData: data,
    });

    // Calculate average attendance percentage
    const totalPresent = data.reduce((sum, day) => sum + day.present, 0);
    const totalAbsent = data.reduce((sum, day) => sum + day.absent, 0);
    const total = totalPresent + totalAbsent;
    const avgAttendance = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

    return (
        <div className="glass-card rounded-2xl p-6 h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">
                        Training Attendance
                    </h1>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Weekly training session participation
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-fcGreen/20 text-fcGreen font-medium">
                        Avg: {avgAttendance}%
                    </span>
                    <button className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] transition-colors">
                        <svg
                            className="w-5 h-5 text-[var(--text-muted)]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-fcGarnet" />
                    <span className="text-xs text-[var(--text-muted)]">Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-fcBlue" />
                    <span className="text-xs text-[var(--text-muted)]">Absent</span>
                </div>
            </div>

            {/* Chart */}
            <AttendanceChart data={data} />
        </div>
    );
};

export default AttendanceChartContainer;
