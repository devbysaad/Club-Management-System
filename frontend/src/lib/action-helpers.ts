"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { Role } from "@prisma/client";
import { formatPrismaError, formatError } from "./error-utils";
import crypto from "crypto";

// ============================================
// TYPE DEFINITIONS
// ============================================
export type ActionResult<T = any> = {
    success: boolean;
    error: boolean;
    message?: string;
    data?: T;
};

export type ClerkUserInfo = {
    id: string;
    email: string;
    role: Role;
};

// ============================================
// AUTHENTICATION HELPERS (ALL ASYNC)
// ============================================

/**
 * Get current Clerk user and sync/validate with AppUser
 * This is the SINGLE SOURCE OF TRUTH for authorization
 */
export async function getCurrentUser(): Promise<ClerkUserInfo | null> {
    try {
        // Try auth() first
        const { userId: authUserId } = await auth();

        // If auth() doesn't work (Server Actions bug), try currentUser()
        let userId = authUserId;
        if (!userId) {
            const user = await currentUser();
            if (user) {
                userId = user.id;
            }
        }

        if (!userId) return null;

        // Get Clerk client and user
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        // Sync with AppUser table (source of truth for role)
        let appUser = await prisma.appUser.findUnique({
            where: { id: userId },
        });

        // If AppUser doesn't exist but Clerk user does, create it
        if (!appUser) {
            // Clerk stores role as lowercase string "admin", "coach", etc.
            // Prisma Role enum needs uppercase "ADMIN", "COACH", etc.
            const roleFromClerk = clerkUser.publicMetadata?.role as string;
            const role = (roleFromClerk?.toUpperCase() as Role) || Role.STUDENT;

            appUser = await prisma.appUser.create({
                data: {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress || "",
                    role,
                    status: "ACTIVE",
                },
            });
        }

        // Check if account is active
        if (appUser.isDeleted || appUser.status !== "ACTIVE") {
            return null;
        }

        return {
            id: appUser.id,
            email: appUser.email,
            role: appUser.role,
        };
    } catch (error) {
        console.error("[GET_CURRENT_USER_ERROR]", error);
        return null;
    }
}

/**
 * Validate that a Clerk user exists
 */
export async function validateClerkUser(userId: string): Promise<boolean> {
    try {
        const client = await clerkClient();
        await client.users.getUser(userId);
        return true;
    } catch (error) {
        return false;
    }
}

// ============================================
// AUTHORIZATION HELPERS (ALL ASYNC)
// ============================================

/**
 * Check if current user has required role
 */
export async function hasRole(allowedRoles: Role[]): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
}

/**
 * Check if current user owns a resource
 */
export async function assertOwnership(resourceUserId: string): Promise<boolean> {
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    // Admin can access everything
    if (currentUser.role === Role.ADMIN) return true;

    // For other roles, must match userId
    return currentUser.id === resourceUserId;
}

/**
 * Check if coach owns an age group
 */
export async function coachOwnsAgeGroup(ageGroupId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    if (user.role === Role.ADMIN) return true;
    if (user.role !== Role.COACH) return false;

    const assignment = await prisma.coachAgeGroup.findFirst({
        where: {
            ageGroupId,
            coach: { userId: user.id },
        },
    });

    return !!assignment;
}

/**
 * Check if parent owns a student
 */
export async function parentOwnsStudent(studentId: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    if (user.role === Role.ADMIN) return true;
    if (user.role !== Role.PARENT) return false;

    const student = await prisma.student.findFirst({
        where: {
            id: studentId,
            parent: { userId: user.id },
        },
    });

    return !!student;
}

// ============================================
// ACTION WRAPPERS (ALL ASYNC)
// ============================================

/**
 * Wrap an action with authentication check
 */
export async function withAuth<T>(
    action: (user: ClerkUserInfo) => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: true,
                message: "Unauthorized: Please log in",
            };
        }

        return await action(user);
    } catch (error: any) {
        console.error("[WITH_AUTH_ERROR]", error);
        return {
            success: false,
            error: true,
            message: error.message || "Authentication failed",
        };
    }
}

/**
 * Wrap an action with role-based authorization
 */
export async function withRole<T>(
    allowedRoles: Role[],
    action: (user: ClerkUserInfo) => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
    return withAuth(async (user) => {
        if (!allowedRoles.includes(user.role)) {
            return {
                success: false,
                error: true,
                message: `Unauthorized: Requires one of roles: ${allowedRoles.join(", ")}`,
            };
        }

        return await action(user);
    });
}

/**
 * Wrap an action with database transaction
 */
export async function withTransaction<T>(
    action: (tx: any) => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
    try {
        return await prisma.$transaction(async (tx) => {
            return await action(tx);
        });
    } catch (error: any) {
        console.error("[TRANSACTION_ERROR] Full error object:", error);
        console.error("[TRANSACTION_ERROR] Details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            meta: error.meta,
            clientVersion: error.clientVersion,
            stack: error.stack
        });

        return {
            success: false,
            error: true,
            message: formatPrismaError(error),
        };
    }
}

// ============================================
// LOGGING HELPERS (ALL ASYNC)
// ============================================

/**
 * Log admin activity for audit trail
 */
export async function logActivity(params: {
    action: string;
    performedBy: string;
    targetType?: string;
    targetId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
}): Promise<void> {
    try {
        await prisma.activityLog.create({
            data: params,
        });
    } catch (error) {
        // Don't fail the operation if logging fails
        console.error("[ACTIVITY_LOG_ERROR]", error);
    }
}

// ============================================
// CLERK INVITATION HELPER (ASYNC)
// ============================================

/**
 * Send Clerk invitation email
 * Users set their own password via invitation link
 */
export async function sendClerkInvitation(params: {
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
}): Promise<ActionResult<{ clerkUserId: string }>> {
    try {
        const client = await clerkClient();

        // Generate username from email (part before @)
        // Clerk only allows: letters, numbers, dash, underscore
        const username = params.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_');

        // Generate a secure random password
        // User will reset this via invitation email
        const tempPassword = crypto.randomBytes(32).toString('hex');

        console.log("🟦 [SEND_CLERK_INVITATION] Creating user with payload:", {
            username,
            emailAddress: [params.email],
            firstName: params.firstName,
            lastName: params.lastName,
            role: params.role
        });

        // Create Clerk user WITH username and temporary password
        const clerkUser = await client.users.createUser({
            username: username,  // Clerk requires username for this instance
            emailAddress: [params.email],
            password: tempPassword,
            firstName: params.firstName,
            lastName: params.lastName,
            publicMetadata: { role: params.role },
        });

        console.log("🟦 [SEND_CLERK_INVITATION] User created successfully:", clerkUser.id);

        // Try to send invitation (non-fatal if this fails)
        try {
            const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
                ? `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`
                : 'http://localhost:3000/sign-in';

            await client.invitations.createInvitation({
                emailAddress: params.email,
                publicMetadata: {
                    role: params.role,
                    userId: clerkUser.id,
                },
                redirectUrl: redirectUrl,
            });

            console.log("🟦 [SEND_CLERK_INVITATION] Invitation sent successfully");
        } catch (inviteError: any) {
            // Invitation failed but user was created - this is OK
            console.warn("⚠️  [SEND_CLERK_INVITATION] Invitation email failed (user still created):", {
                error: inviteError.message,
                code: inviteError.code,
                userId: clerkUser.id
            });
        }

        // Return success as long as user was created
        return {
            success: true,
            error: false,
            message: "User created successfully",
            data: { clerkUserId: clerkUser.id },
        };
    } catch (error: any) {
        console.error("[SEND_INVITATION_ERROR]", error);
        console.error("[SEND_INVITATION_ERROR] Full error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            status: error.status,
            errors: error.errors,
            clerkError: error.clerkError,
            longMessage: error.longMessage
        });

        // Handle duplicate email gracefully
        if (error.errors?.[0]?.code === "form_identifier_exists") {
            return {
                success: false,
                error: true,
                message: "This email is already registered",
            };
        }

        // Handle username issues
        if (error.errors?.[0]?.code === "form_data_missing") {
            console.error("[SEND_INVITATION_ERROR] Username validation failed");
            return {
                success: false,
                error: true,
                message: `Username error: ${error.errors[0].longMessage || error.errors[0].message}`,
            };
        }

        return {
            success: false,
            error: true,
            message: formatError(error),
        };
    }
}

// ============================================
// SOFT DELETE HELPERS (ALL ASYNC)
// ============================================

/**
 * Soft delete a record (for financial/critical data)
 */
export async function softDelete(model: any, id: string): Promise<ActionResult> {
    try {
        await model.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });

        return {
            success: true,
            error: false,
            message: "Record deleted successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            error: true,
            message: formatPrismaError(error),
        };
    }
}

/**
 * Hard delete a record (for non-critical data)
 */
export async function hardDelete(model: any, id: string): Promise<ActionResult> {
    try {
        await model.delete({
            where: { id },
        });

        return {
            success: true,
            error: false,
            message: "Record permanently deleted",
        };
    } catch (error: any) {
        return {
            success: false,
            error: true,
            message: formatPrismaError(error),
        };
    }
}

// ============================================
// BACKGROUND TASK HELPER (ASYNC)
// ============================================

/**
 * Run a task in the background without blocking the UI
 * For: sending emails, processing images, large deletes
 */
export async function runInBackground(task: () => Promise<void>): Promise<void> {
    // Fire and forget - don't await
    task().catch((error) => {
        console.error("[BACKGROUND_TASK_ERROR]", error);
    });
}
