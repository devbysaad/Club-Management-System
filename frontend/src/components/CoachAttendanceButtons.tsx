"use client";

import { markCoachAttendance } from "@/lib/coach-attendance-actions";
import { useState } from "react";
import { toast } from "react-toastify";

interface CoachAttendanceButtonsProps {
    coachId: string;
    markedStatus?: "PRESENT" | "ABSENT" | null;
}

export default function CoachAttendanceButtons({ coachId, markedStatus: initialMarkedStatus }: CoachAttendanceButtonsProps) {
    const [loading, setLoading] = useState(false);
    const [markedStatus, setMarkedStatus] = useState<"PRESENT" | "ABSENT" | null>(initialMarkedStatus || null);

    console.log("========================================");
    console.log("[CoachAttendanceButtons] 🎨 Component rendered!");
    console.log("[CoachAttendanceButtons] Props:");
    console.log("  - coachId:", coachId);
    console.log("  - markedStatus:", markedStatus);
    console.log("  - loading state:", loading);
    console.log("========================================");

    const handleMark = async (status: "PRESENT" | "ABSENT") => {
        console.log("========================================");
        console.log("[CoachAttendanceButtons] 🖱️ Button clicked!");
        console.log("[CoachAttendanceButtons] Call parameters:");
        console.log("  - coachId:", coachId);
        console.log("  - status:", status);
        console.log("========================================");

        setLoading(true);
        console.log("[CoachAttendanceButtons] ⏳ Loading set to true");

        try {
            console.log("[CoachAttendanceButtons] 📡 Calling markCoachAttendance server action...");
            const result = await markCoachAttendance(coachId, status);

            console.log("[CoachAttendanceButtons] 📥 Server action returned:");
            console.log("  - result:", JSON.stringify(result, null, 2));
            console.log("  - result.success:", result.success);
            console.log("  - result.error:", result.error);
            console.log("  - result.message:", result.message);

            if (result.success) {
                console.log("[CoachAttendanceButtons] ✅ Success! Showing success toast");
                setMarkedStatus(status);
                toast.success(result.message);
            } else {
                console.log("[CoachAttendanceButtons] ❌ Failed! Showing error toast");
                console.log("[CoachAttendanceButtons] Error message:", result.message);
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error("========================================");
            console.error("[CoachAttendanceButtons] 💥 EXCEPTION CAUGHT!");
            console.error("[CoachAttendanceButtons] Error:", error);
            console.error("[CoachAttendanceButtons] Error name:", error?.name);
            console.error("[CoachAttendanceButtons] Error message:", error?.message);
            console.error("[CoachAttendanceButtons] Error stack:", error?.stack);
            console.error("========================================");
            toast.error("Failed to mark attendance");
        } finally {
            setLoading(false);
            console.log("[CoachAttendanceButtons] ⏹️ Loading set to false");
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
        <div className="flex items-center gap-1">
            <button
                onClick={() => {
                    console.log("[CoachAttendanceButtons] ✅ PRESENT button onClick triggered");
                    handleMark("PRESENT");
                }}
                disabled={loading}
                className="px-2 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition-colors"
                title="Mark Present"
            >
                ✓
            </button>
            <button
                onClick={() => {
                    console.log("[CoachAttendanceButtons] ❌ ABSENT button onClick triggered");
                    handleMark("ABSENT");
                }}
                disabled={loading}
                className="px-2 py-1 text-xs font-medium rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                title="Mark Absent"
            >
                ✗
            </button>
        </div>
    );
}
