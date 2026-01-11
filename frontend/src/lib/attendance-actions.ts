// ============================================
// ATTENDANCE ACTIONS (Daily Student Attendance)
// ============================================
"use server";

import { z } from "zod";
import prisma from "./prisma";
import { withRole } from "./action-helpers";
import { Role, DailyAttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Mark student attendance for today
 * Admin only - uses upsert to create or update
 */
export const markAttendance = async (
    studentId: string,
    status: "PRESENT" | "ABSENT"
) => {
    console.log("========================================");
    console.log("[MARK_ATTENDANCE] 🚀 Function called!");
    console.log("[MARK_ATTENDANCE] Input Parameters:");
    console.log("  - studentId:", studentId);
    console.log("  - status:", status);
    console.log("  - studentId type:", typeof studentId);
    console.log("  - status type:", typeof status);
    console.log("========================================");

    // Validate inputs before proceeding
    if (!studentId) {
        console.error("[MARK_ATTENDANCE] ❌ ERROR: studentId is missing or empty!");
        return {
            success: false,
            error: true,
            message: "Student ID is required",
        };
    }

    if (!status || !["PRESENT", "ABSENT"].includes(status)) {
        console.error("[MARK_ATTENDANCE] ❌ ERROR: Invalid status value:", status);
        return {
            success: false,
            error: true,
            message: "Status must be PRESENT or ABSENT",
        };
    }

    console.log("[MARK_ATTENDANCE] ✅ Input validation passed");
    console.log("[MARK_ATTENDANCE] 🔐 Calling withRole([ADMIN])...");

    const result = await withRole([Role.ADMIN], async (user) => {
        console.log("[MARK_ATTENDANCE] 🔓 withRole callback entered");
        console.log("[MARK_ATTENDANCE] User:", user.email, "Role:", user.role);

        try {
            // Get today's date at midnight (for consistent date comparison)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            console.log("[MARK_ATTENDANCE] 📅 Today's date:", today.toISOString());

            // Check if student exists first
            console.log("[MARK_ATTENDANCE] 🔍 Checking if student exists...");
            const student = await prisma.student.findUnique({
                where: { id: studentId },
                select: { id: true, firstName: true, lastName: true },
            });

            if (!student) {
                console.error("[MARK_ATTENDANCE] ❌ Student NOT found!");
                return {
                    success: false,
                    error: true,
                    message: `Student not found`,
                };
            }

            console.log("[MARK_ATTENDANCE] ✅ Student found:", student.firstName, student.lastName);

            // CHECK IF ALREADY MARKED TODAY (prevent multiple marks)
            console.log("[MARK_ATTENDANCE] 🔍 Checking if already marked today...");
            const existingAttendance = await prisma.dailyAttendance.findUnique({
                where: {
                    studentId_date: {
                        studentId,
                        date: today,
                    },
                },
            });

            if (existingAttendance) {
                console.warn("[MARK_ATTENDANCE] ⚠️ Already marked today!");
                console.log("[MARK_ATTENDANCE] Existing:", existingAttendance.status);
                return {
                    success: false,
                    error: true,
                    message: `Already marked as ${existingAttendance.status.toLowerCase()} today. Attendance can only be marked once per day.`,
                };
            }

            // Create new attendance record (only once per day)
            console.log("[MARK_ATTENDANCE] 💾 Creating attendance record...");
            const attendance = await prisma.dailyAttendance.create({
                data: {
                    studentId,
                    date: today,
                    status: status as DailyAttendanceStatus,
                    markedBy: user.id,
                },
            });

            console.log("[MARK_ATTENDANCE] ✅ Attendance created successfully!");
            console.log("[MARK_ATTENDANCE] Result:", JSON.stringify(attendance, null, 2));

            console.log("[MARK_ATTENDANCE] 🔄 Revalidating paths...");
            revalidatePath("/list/students");
            revalidatePath(`/list/students/${studentId}`);
            console.log("[MARK_ATTENDANCE] ✅ Paths revalidated");

            const successResult = {
                success: true,
                error: false,
                message: `Marked ${status.toLowerCase()}`,
            };
            console.log("[MARK_ATTENDANCE] 🎉 Returning success:", JSON.stringify(successResult));
            return successResult;
        } catch (error: any) {
            console.error("========================================");
            console.error("[MARK_ATTENDANCE] ❌ CATCH BLOCK ERROR!");
            console.error("[MARK_ATTENDANCE] Error name:", error.name);
            console.error("[MARK_ATTENDANCE] Error message:", error.message);
            console.error("[MARK_ATTENDANCE] Error code:", error.code);
            console.error("[MARK_ATTENDANCE] Error meta:", error.meta);
            console.error("[MARK_ATTENDANCE] Full error:", error);
            console.error("[MARK_ATTENDANCE] Error stack:", error.stack);
            console.error("========================================");
            return {
                success: false,
                error: true,
                message: error.message || "Failed to mark attendance",
            };
        }
    });

    console.log("[MARK_ATTENDANCE] 📤 withRole returned:");
    console.log("  - result:", JSON.stringify(result, null, 2));
    console.log("========================================");

    return result;
};

/**
 * Get student attendance history
 */
export const getStudentAttendance = async (studentId: string) => {
    console.log("========================================");
    console.log("[GET_STUDENT_ATTENDANCE] 🚀 Function called!");
    console.log("[GET_STUDENT_ATTENDANCE] studentId:", studentId);
    console.log("========================================");

    try {
        console.log("[GET_STUDENT_ATTENDANCE] 🔍 Querying database...");
        const attendance = await prisma.dailyAttendance.findMany({
            where: {
                studentId,
            },
            orderBy: {
                date: "desc",
            },
        });

        console.log("[GET_STUDENT_ATTENDANCE] ✅ Query successful!");
        console.log("[GET_STUDENT_ATTENDANCE] Records found:", attendance.length);
        console.log("[GET_STUDENT_ATTENDANCE] Data:", JSON.stringify(attendance, null, 2));

        return attendance;
    } catch (error: any) {
        console.error("========================================");
        console.error("[GET_STUDENT_ATTENDANCE] ❌ ERROR!");
        console.error("[GET_STUDENT_ATTENDANCE] Error name:", error.name);
        console.error("[GET_STUDENT_ATTENDANCE] Error message:", error.message);
        console.error("[GET_STUDENT_ATTENDANCE] Full error:", error);
        console.error("========================================");
        return [];
    }
};
