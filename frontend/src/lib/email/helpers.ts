/**
 * Email Helper Functions
 * Permission checks and recipient data fetching
 */

import prisma from "../prisma";
import { Role } from "@prisma/client";
import { getCurrentUser } from "../action-helpers";

/**
 * Require admin permission - throws if not admin
 */
export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== Role.ADMIN) {
        throw new Error("Unauthorized: Admin access required");
    }
    return user;
}

/**
 * Require staff or admin permission
 */
export async function requireStaffOrAdmin() {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.COACH)) {
        throw new Error("Unauthorized: Staff or admin access required");
    }
    return user;
}

/**
 * Get all player (student) email addresses
 * Optionally filter by age group
 */
export async function getPlayerEmails(ageGroupId?: string): Promise<string[]> {
    const students = await prisma.student.findMany({
        where: {
            isDeleted: false,
            ...(ageGroupId ? { ageGroupId } : {}),
        },
        select: {
            email: true,
        },
    });

    return students
        .filter((s) => s.email)
        .map((s) => s.email as string);
}

/**
 * Get all parent email addresses
 */
export async function getParentEmails(): Promise<string[]> {
    const parents = await prisma.parent.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            email: true,
        },
    });

    return parents
        .filter((p) => p.email)
        .map((p) => p.email as string);
}

/**
 * Get all staff (coaches + admins) email addresses
 */
export async function getStaffEmails(): Promise<string[]> {
    // Get coaches
    const coaches = await prisma.coach.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            email: true,
        },
    });

    // Get admins from AppUser
    const admins = await prisma.appUser.findMany({
        where: {
            role: Role.ADMIN,
            isDeleted: false,
        },
        select: {
            email: true,
        },
    });

    const emails = [
        ...coaches.filter((c) => c.email).map((c) => c.email as string),
        ...admins.filter((a) => a.email).map((a) => a.email as string),
    ];

    // Remove duplicates
    return [...new Set(emails)];
}

/**
 * Get recipients by role array
 * Used for announcements targeting specific roles
 */
export async function getRecipientsByRole(roles: Role[]): Promise<string[]> {
    const emails: string[] = [];

    if (roles.includes(Role.STUDENT)) {
        emails.push(...(await getPlayerEmails()));
    }

    if (roles.includes(Role.PARENT)) {
        emails.push(...(await getParentEmails()));
    }

    if (roles.includes(Role.COACH) || roles.includes(Role.ADMIN)) {
        emails.push(...(await getStaffEmails()));
    }

    // Remove duplicates
    return [...new Set(emails)];
}

/**
 * Get student and parent email for a specific student
 */
export async function getStudentAndParentEmails(
    studentId: string
): Promise<string[]> {
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            parent: {
                select: { email: true },
            },
        },
    });

    if (!student) return [];

    const emails: string[] = [];
    if (student.email) emails.push(student.email);
    if (student.parent?.email) emails.push(student.parent.email);

    return emails;
}
