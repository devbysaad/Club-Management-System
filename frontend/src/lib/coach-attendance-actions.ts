// ============================================
// COACH ATTENDANCE ACTIONS (Daily Coach Attendance)
// ============================================
"use server";

import { z } from "zod";
import prisma from "./prisma";
import { withRole } from "./action-helpers";
import { Role, DailyAttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Mark coach attendance for today
 * Admin only - marks once per 24 hours
 */
export const markCoachAttendance = async (
    coachId: string,
    status: "PRESENT" | "ABSENT"
) => {
    console.log("========================================");
    console.log("[MARK_COACH_ATTENDANCE] 🚀 Function called!");
    console.log("[MARK_COACH_ATTENDANCE] Input Parameters:");
    console.log("  - coachId:", coachId);
    console.log("  - status:", status);
    console.log("  - coachId type:", typeof coachId);
    console.log("  - status type:", typeof status);
    console.log("========================================");

    // Validate inputs before proceeding
    if (!coachId) {
        console.error("[MARK_COACH_ATTENDANCE] ❌ ERROR: coachId is missing or empty!");
        return {
            success: false,
            error: true,
            message: "Coach ID is required",
        };
    }

    if (!status || !["PRESENT", "ABSENT"].includes(status)) {
        console.error("[MARK_COACH_ATTENDANCE] ❌ ERROR: Invalid status value:", status);
        return {
            success: false,
            error: true,
            message: "Status must be PRESENT or ABSENT",
        };
    }

    console.log("[MARK_COACH_ATTENDANCE] ✅ Input validation passed");
    console.log("[MARK_COACH_ATTENDANCE] 🔐 Calling withRole([ADMIN])...");

    const result = await withRole([Role.ADMIN], async (user) => {
        console.log("[MARK_COACH_ATTENDANCE] 🔓 withRole callback entered");
        console.log("[MARK_COACH_ATTENDANCE] User:", user.email, "Role:", user.role);

        try {
            // Get today's date at midnight (for consistent date comparison)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            console.log("[MARK_COACH_ATTENDANCE] 📅 Today's date:", today.toISOString());

            // Check if coach exists first
            console.log("[MARK_COACH_ATTENDANCE] 🔍 Checking if coach exists...");
            const coach = await prisma.coach.findUnique({
                where: { id: coachId },
                select: { id: true, firstName: true, lastName: true },
            });

            if (!coach) {
                console.error("[MARK_COACH_ATTENDANCE] ❌ Coach NOT found!");
                return {
                    success: false,
                    error: true,
                    message: `Coach not found`,
                };
            }

            console.log("[MARK_COACH_ATTENDANCE] ✅ Coach found:", coach.firstName, coach.lastName);

            // CHECK IF ALREADY MARKED TODAY (prevent multiple marks)
            console.log("[MARK_COACH_ATTENDANCE] 🔍 Checking if already marked today...");
            const existingAttendance = await prisma.coachDailyAttendance.findUnique({
                where: {
                    coachId_date: {
                        coachId,
                        date: today,
                    },
                },
            });

            if (existingAttendance) {
                console.warn("[MARK_COACH_ATTENDANCE] ⚠️ Already marked today!");
                console.log("[MARK_COACH_ATTENDANCE] Existing:", existingAttendance.status);
                return {
                    success: false,
                    error: true,
                    message: `Already marked as ${existingAttendance.status.toLowerCase()} today. Attendance can only be marked once per day.`,
                };
            }

            // Create new attendance record (only once per day)
            console.log("[MARK_COACH_ATTENDANCE] 💾 Creating attendance record...");
            const attendance = await prisma.coachDailyAttendance.create({
                data: {
                    coachId,
                    date: today,
                    status: status as DailyAttendanceStatus,
                    markedBy: user.id,
                },
            });

            console.log("[MARK_COACH_ATTENDANCE] ✅ Attendance created successfully!");
            console.log("[MARK_COACH_ATTENDANCE] Result:", JSON.stringify(attendance, null, 2));

            console.log("[MARK_COACH_ATTENDANCE] 🔄 Revalidating paths...");
            revalidatePath("/list/coaches");
            revalidatePath(`/list/coaches/${coachId}`);
            console.log("[MARK_COACH_ATTENDANCE] ✅ Paths revalidated");

            const successResult = {
                success: true,
                error: false,
                message: `Marked ${status.toLowerCase()}`,
            };
            console.log("[MARK_COACH_ATTENDANCE] 🎉 Returning success:", JSON.stringify(successResult));
            return successResult;
        } catch (error: any) {
            console.error("========================================");
            console.error("[MARK_COACH_ATTENDANCE] ❌ CATCH BLOCK ERROR!");
            console.error("[MARK_COACH_ATTENDANCE] Error name:", error.name);
            console.error("[MARK_COACH_ATTENDANCE] Error message:", error.message);
            console.error("[MARK_COACH_ATTENDANCE] Error code:", error.code);
            console.error("[MARK_COACH_ATTENDANCE] Error meta:", error.meta);
            console.error("[MARK_COACH_ATTENDANCE] Full error:", error);
            console.error("[MARK_COACH_ATTENDANCE] Error stack:", error.stack);
            console.error("========================================");
            return {
                success: false,
                error: true,
                message: error.message || "Failed to mark attendance",
            };
        }
    });

    console.log("[MARK_COACH_ATTENDANCE] 📤 withRole returned:");
    console.log("  - result:", JSON.stringify(result, null, 2));
    console.log("========================================");

    return result;
};

/**
 * Get coach attendance history
 */
export const getCoachAttendance = async (coachId: string) => {
    console.log("========================================");
    console.log("[GET_COACH_ATTENDANCE] 🚀 Function called!");
    console.log("[GET_COACH_ATTENDANCE] coachId:", coachId);
    console.log("========================================");

    try {
        console.log("[GET_COACH_ATTENDANCE] 🔍 Querying database...");
        const attendance = await prisma.coachDailyAttendance.findMany({
            where: {
                coachId,
            },
            orderBy: {
                date: "desc",
            },
        });

        console.log("[GET_COACH_ATTENDANCE] ✅ Query successful!");
        console.log("[GET_COACH_ATTENDANCE] Records found:", attendance.length);
        console.log("[GET_COACH_ATTENDANCE] Data:", JSON.stringify(attendance, null, 2));

        return attendance;
    } catch (error: any) {
        console.error("========================================");
        console.error("[GET_COACH_ATTENDANCE] ❌ ERROR!");
        console.error("[GET_COACH_ATTENDANCE] Error name:", error.name);
        console.error("[GET_COACH_ATTENDANCE] Error message:", error.message);
        console.error("[GET_COACH_ATTENDANCE] Full error:", error);
        console.error("========================================");
        return [];
    }
};
