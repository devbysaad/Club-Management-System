"use server";

import { z } from "zod";
import prisma from "./prisma";
import { withRole } from "./action-helpers";
import { Role, DailyAttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Mark staff attendance for today
 * Admin only - marks once per 24 hours
 */
export const markStaffAttendance = async (
    staffId: string,
    status: "PRESENT" | "ABSENT"
) => {
    if (!staffId) {
        return {
            success: false,
            error: true,
            message: "Staff ID is required",
        };
    }

    if (!status || !["PRESENT", "ABSENT"].includes(status)) {
        return {
            success: false,
            error: true,
            message: "Status must be PRESENT or ABSENT",
        };
    }

    const result = await withRole([Role.ADMIN], async (user) => {
        try {
            // Get today's date at midnight (for consistent date comparison)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if staff exists first
            const staff = await prisma.staff.findUnique({
                where: { id: staffId },
                select: { id: true, firstName: true, lastName: true },
            });

            if (!staff) {
                return {
                    success: false,
                    error: true,
                    message: `Staff not found`,
                };
            }

            // CHECK IF ALREADY MARKED TODAY (prevent multiple marks)
            const existingAttendance = await prisma.staffDailyAttendance.findUnique({
                where: {
                    staffId_date: {
                        staffId,
                        date: today,
                    },
                },
            });

            if (existingAttendance) {
                return {
                    success: false,
                    error: true,
                    message: `Already marked as ${existingAttendance.status.toLowerCase()} today. Attendance can only be marked once per day.`,
                };
            }

            // Create new attendance record (only once per day)
            const attendance = await prisma.staffDailyAttendance.create({
                data: {
                    staffId,
                    date: today,
                    status: status as DailyAttendanceStatus,
                    markedBy: user.id,
                },
            });

            revalidatePath("/list/staff");
            revalidatePath(`/list/staff/${staffId}`);

            return {
                success: true,
                error: false,
                message: `Marked ${status.toLowerCase()}`,
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to mark attendance",
            };
        }
    });

    return result;
};

/**
 * Get staff attendance history
 */
export const getStaffAttendance = async (staffId: string) => {
    try {
        const attendance = await prisma.staffDailyAttendance.findMany({
            where: {
                staffId,
            },
            orderBy: {
                date: "desc",
            },
        });

        return attendance;
    } catch (error: any) {
        console.error("[GET_STAFF_ATTENDANCE] ERROR:", error);
        return [];
    }
};
