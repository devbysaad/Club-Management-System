"use client";

import { useState } from "react";
import { markStaffAttendance } from "@/lib/staff-attendance-actions";
import { toast } from "react-toastify";

type MarkedStatus = "PRESENT" | "ABSENT" | null;

export default function StaffAttendanceButtons({
    staffId,
    markedStatus,
}: {
    staffId: string;
    markedStatus: MarkedStatus;
}) {
    const [status, setStatus] = useState<MarkedStatus>(markedStatus);
    const [loading, setLoading] = useState(false);

    const handleMark = async (attendanceStatus: "PRESENT" | "ABSENT") => {
        setLoading(true);
        try {
            const result = await markStaffAttendance(staffId, attendanceStatus);

            if (result.success) {
                setStatus(attendanceStatus);
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to mark attendance");
        } finally {
            setLoading(false);
        }
    };

    if (status) {
        return (
            <div className="flex items-center gap-2">
                <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${status === "PRESENT"
                        ? "bg-fcGreen/20 text-fcGreen"
                        : "bg-fcGarnet/20 text-fcGarnet"
                        }`}
                >
                    {status === "PRESENT" ? "✓ Present" : "✗ Absent"}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleMark("PRESENT")}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-fcGreen/20 text-fcGreen hover:bg-fcGreen/30 disabled:opacity-50 text-xs font-semibold transition-colors"
            >
                Present
            </button>
            <button
                onClick={() => handleMark("ABSENT")}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-fcGarnet/20 text-fcGarnet hover:bg-fcGarnet/30 disabled:opacity-50 text-xs font-semibold transition-colors"
            >
                Absent
            </button>
        </div>
    );
}
