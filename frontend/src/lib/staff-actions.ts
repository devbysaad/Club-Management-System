"use server";

// Staff CRUD Actions
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { StaffSchema } from "./formValidationSchemas";
import {
    createClerkUserWithPassword,
    deleteFromClerk,
    logActivity,
    withRole,
    withTransaction,
    type ActionResult
} from "./action-helpers";

type CurrentState = { success: boolean; error: boolean; message?: string };

export const createStaff = async (
    currentState: CurrentState,
    data: StaffSchema
): Promise<ActionResult> => {
    return withRole([Role.ADMIN], async (user) => {
        // Create Clerk user with password from form
        const clerkResult = await createClerkUserWithPassword({
            email: data.email!,
            password: data.password,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            role: Role.STAFF,
        });

        if (!clerkResult.success) {
            return clerkResult;
        }

        const clerkUserId = clerkResult.data!.clerkUserId;

        // Save to database in transaction
        return withTransaction(async (tx) => {
            // Upsert AppUser
            await tx.appUser.upsert({
                where: { id: clerkUserId },
                create: {
                    id: clerkUserId,
                    email: data.email!,
                    role: Role.STAFF,
                    status: "ACTIVE",
                },
                update: {
                    email: data.email!,
                    role: Role.STAFF,
                    status: "ACTIVE",
                },
            });

            // Create Staff profile
            const staff = await tx.staff.create({
                data: {
                    userId: clerkUserId,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                },
            });

            // Log activity
            await logActivity({
                action: "CREATE_STAFF",
                performedBy: user.id,
                targetType: "Staff",
                targetId: staff.id,
                details: { firstName: data.firstName, lastName: data.lastName },
            });

            revalidatePath("/list/staff");

            return {
                success: true,
                error: false,
                message: `Staff ${data.firstName} ${data.lastName} created successfully`,
            };
        });
    });
};

export const updateStaff = async (
    currentState: CurrentState,
    data: StaffSchema
): Promise<ActionResult> => {
    if (!data.id) {
        return { success: false, error: true, message: "Staff ID is required" };
    }

    return withRole([Role.ADMIN], async (user) => {
        return withTransaction(async (tx) => {
            // Update Staff profile
            const staff = await tx.staff.update({
                where: { id: data.id },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                },
            });

            // Log activity
            await logActivity({
                action: "UPDATE_STAFF",
                performedBy: user.id,
                targetType: "Staff",
                targetId: staff.id,
                details: data,
            });

            revalidatePath("/list/staff");

            return {
                success: true,
                error: false,
                message: `Staff updated successfully`,
            };
        });
    });
};

export const deleteStaff = async (
    currentState: CurrentState,
    data: FormData
): Promise<ActionResult> => {
    const id = data.get("id") as string;

    return withRole([Role.ADMIN], async (user) => {
        return withTransaction(async (tx) => {
            // Get staff to retrieve userId for Clerk deletion
            const staff = await tx.staff.findUnique({
                where: { id },
                select: { userId: true, firstName: true, lastName: true },
            });

            if (!staff) {
                return {
                    success: false,
                    error: true,
                    message: "Staff not found",
                };
            }

            // Delete from Clerk
            await deleteFromClerk(staff.userId);

            // Soft delete staff member
            await tx.staff.update({
                where: { id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            });

            await logActivity({
                action: "DELETE_STAFF",
                performedBy: user.id,
                targetType: "Staff",
                targetId: id,
                details: { firstName: staff.firstName, lastName: staff.lastName },
            });

            revalidatePath("/list/staff");

            return {
                success: true,
                error: false,
                message: `Staff deleted successfully`,
            };
        });
    });
};
