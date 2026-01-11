"use client";

import { markAttendance } from "@/lib/attendance-actions";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface AttendanceButtonsProps {
    studentId: string;
    markedStatus?: "PRESENT" | "ABSENT" | null;
}

export default function AttendanceButtons({ studentId, markedStatus: initialMarkedStatus }: AttendanceButtonsProps) {
    const [loading, setLoading] = useState(false);
    const [markedStatus, setMarkedStatus] = useState<"PRESENT" | "ABSENT" | null>(initialMarkedStatus || null);

    console.log("========================================");
    console.log("[AttendanceButtons] 🎨 Component rendered!");
    console.log("[AttendanceButtons] Props:");
    console.log("  - studentId:", studentId);
    console.log("  - markedStatus:", markedStatus);
    console.log("  - loading state:", loading);
    console.log("========================================");

    const handleMark = async (status: "PRESENT" | "ABSENT") => {
        console.log("========================================");
        console.log("[AttendanceButtons] 🖱️ Button clicked!");
        console.log("[AttendanceButtons] Call parameters:");
        console.log("  - studentId:", studentId);
        console.log("  - status:", status);
        console.log("========================================");

        setLoading(true);
        console.log("[AttendanceButtons] ⏳ Loading set to true");

        try {
            console.log("[AttendanceButtons] 📡 Calling markAttendance server action...");
            const result = await markAttendance(studentId, status);

            console.log("[AttendanceButtons] 📥 Server action returned:");
            console.log("  - result:", JSON.stringify(result, null, 2));
            console.log("  - result.success:", result.success);
            console.log("  - result.error:", result.error);
            console.log("  - result.message:", result.message);

            if (result.success) {
                console.log("[AttendanceButtons] ✅ Success! Showing success toast");
                setMarkedStatus(status);
                toast.success(result.message);
            } else {
                console.log("[AttendanceButtons] ❌ Failed! Showing error toast");
                console.log("[AttendanceButtons] Error message:", result.message);
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error("========================================");
            console.error("[AttendanceButtons] 💥 EXCEPTION CAUGHT!");
            console.error("[AttendanceButtons] Error:", error);
            console.error("[AttendanceButtons] Error name:", error?.name);
            console.error("[AttendanceButtons] Error message:", error?.message);
            console.error("[AttendanceButtons] Error stack:", error?.stack);
            console.error("========================================");
            toast.error("Failed to mark attendance");
        } finally {
            setLoading(false);
            console.log("[AttendanceButtons] ⏹️ Loading set to false");
        }
    };

    // If already marked, show status
    if (markedStatus) {
        return (
            <div className="flex items-center gap-1">
                <span className={`px-2 py-1 text-xs font-medium rounded ${markedStatus === "PRESENT"
                    ? "bg-green-500/30 text-green-300"
                    : "bg-red-500/30 text-red-300"
                    }`}>
                    {markedStatus === "PRESENT" ? "✓ Present" : "✗ Absent"}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 md:gap-1">
            <button
                onClick={() => {
                    console.log("[AttendanceButtons] ✅ PRESENT button onClick triggered");
                    handleMark("PRESENT");
                }}
                disabled={loading}
                className="min-w-[44px] md:min-w-0 px-3 md:px-2 py-2 md:py-1 text-sm md:text-xs font-medium rounded-lg md:rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 active:scale-95 disabled:opacity-50 transition-all touch-manipulation"
                title="Mark Present"
            >
                <span className="hidden sm:inline">✓</span>
                <span className="sm:hidden">Present</span>
            </button>
            <button
                onClick={() => {
                    console.log("[AttendanceButtons] ❌ ABSENT button onClick triggered");
                    handleMark("ABSENT");
                }}
                disabled={loading}
                className="min-w-[44px] md:min-w-0 px-3 md:px-2 py-2 md:py-1 text-sm md:text-xs font-medium rounded-lg md:rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-95 disabled:opacity-50 transition-all touch-manipulation"
                title="Mark Absent"
            >
                <span className="hidden sm:inline">✗</span>
                <span className="sm:hidden">Absent</span>
            </button>
        </div>
    );
}
