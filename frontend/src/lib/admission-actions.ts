// ============================================
// ADMISSION ACTIONS
// ============================================
"use server";

import { z } from "zod";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

const admissionSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    sex: z.enum(["MALE", "FEMALE"]),
    address: z.string().min(1, "Address is required"),
    parentName: z.string().min(1, "Parent/Guardian name is required"),
    parentPhone: z.string().min(1, "Parent/Guardian phone is required"),
    position: z.string().optional(),
    notes: z.string().optional(),
});

export type AdmissionSchema = z.infer<typeof admissionSchema>;

export const createAdmission = async (data: AdmissionSchema) => {
    try {
        await prisma.admission.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                dateOfBirth: new Date(data.dateOfBirth),
                sex: data.sex,
                address: data.address,
                parentName: data.parentName,
                parentPhone: data.parentPhone,
                position: data.position || null,
                notes: data.notes || null,
                status: "PENDING",
            },
        });

        revalidatePath("/admin/admission");
        return { success: true, error: false };
    } catch (err) {
        console.error("Admission Creation Error:", err);
        return { success: false, error: true, message: "Failed to submit admission form" };
    }
};

export const getAllAdmissions = async () => {
    try {
        const admissions = await prisma.admission.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return admissions;
    } catch (err) {
        console.error("Fetch Admissions Error:", err);
        return [];
    }
};

export const getAdmissionById = async (id: string) => {
    try {
        const admission = await prisma.admission.findUnique({
            where: { id },
        });
        return admission;
    } catch (err) {
        console.error("Fetch Admission Detail Error:", err);
        return null;
    }
};

// ============================================
// GET AGE GROUPS FOR ADMISSION APPROVAL
// ============================================
export const getAgeGroups = async () => {
    try {
        console.log("[GET_AGE_GROUPS] Fetching age groups from database");
        const ageGroups = await prisma.ageGroup.findMany({
            where: { isDeleted: false },
            select: {
                id: true,
                name: true,
                minAge: true,
                maxAge: true,
                capacity: true,
            },
            orderBy: { name: 'asc' },
        });
        console.log("[GET_AGE_GROUPS] Found", ageGroups.length, "age groups");
        return ageGroups;
    } catch (err) {
        console.error("[GET_AGE_GROUPS] Error:", err);
        return [];
    }
};

export const updateAdmissionStatus = async (id: string, status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED") => {
    try {
        console.log("[UPDATE_STATUS] Updating admission:", id, "to", status);

        await prisma.admission.update({
            where: { id },
            data: { status },
        });

        revalidatePath("/admin/admission");
        revalidatePath(`/admin/admission/${id}`);

        console.log("[UPDATE_STATUS] Success");
        return { success: true, error: false };
    } catch (err: any) {
        console.error("[UPDATE_STATUS] Error:", err);
        return {
            success: false,
            error: true,
            message: err.message || "Failed to update status"
        };
    }
};

export const deleteAdmission = async (id: string) => {
    try {
        await prisma.admission.delete({
            where: { id },
        });
        revalidatePath("/admin/admission");
        return { success: true, error: false };
    } catch (err) {
        console.error("Delete Admission Error:", err);
        return { success: false, error: true };
    }
};

// ============================================
// APPROVE ADMISSION WORKFLOW
// ============================================
export const approveAdmission = async (
    admissionId: string,
    ageGroupId: string,
    credentials?: {
        parentEmail: string;
        parentPassword: string;
        studentUsername: string;
        studentPassword: string;
    }
) => {
    try {
        console.log("[APPROVE_ADMISSION] Starting for:", admissionId);
        console.log("[APPROVE_ADMISSION] Age Group ID:", ageGroupId);
        console.log("[APPROVE_ADMISSION] Credentials provided:", !!credentials);

        // 1. Validate age group exists
        if (!ageGroupId) {
            return { success: false, error: true, message: "Age group is required" };
        }

        const ageGroup = await prisma.ageGroup.findUnique({
            where: { id: ageGroupId },
        });

        if (!ageGroup) {
            return { success: false, error: true, message: "Invalid age group selected" };
        }

        console.log("[APPROVE_ADMISSION] Age group validated:", ageGroup.name);

        // 2. Get admission details
        const admission = await prisma.admission.findUnique({
            where: { id: admissionId },
        });

        if (!admission) {
            return { success: false, error: true, message: "Admission not found" };
        }

        if (admission.status === "CONVERTED") {
            return { success: false, error: true, message: "Admission already approved" };
        }

        // 3. Create Clerk user for parent
        console.log("[APPROVE_ADMISSION] Creating parent Clerk user");
        const client = await clerkClient();

        // Use provided credentials or generate defaults
        const parentEmail = credentials?.parentEmail ||
            admission.parentEmail ||
            `${admission.parentName.toLowerCase().replace(/\s+/g, '.')}.parent@patohornets.local`;

        console.log("[APPROVE_ADMISSION] Using parent email:", parentEmail);

        // Create parent Clerk user with password if provided
        const parentUserData: any = {
            emailAddress: [parentEmail],
            firstName: admission.parentName.split(" ")[0],
            lastName: admission.parentName.split(" ").slice(1).join(" ") || admission.lastName,
            publicMetadata: { role: "parent" },
        };

        if (credentials?.parentPassword) {
            parentUserData.password = credentials.parentPassword;
        } else {
            parentUserData.skipPasswordRequirement = true;
        }

        const parentClerkUser = await client.users.createUser(parentUserData);

        console.log("[APPROVE_ADMISSION] Parent Clerk user created:", parentClerkUser.id);

        // 4. Create Parent profile
        const parent = await prisma.parent.create({
            data: {
                userId: parentClerkUser.id,
                firstName: admission.parentName.split(" ")[0],
                lastName: admission.parentName.split(" ").slice(1).join(" ") || admission.lastName,
                email: parentEmail, // Use parent email, not student email
                phone: admission.parentPhone,
                address: admission.address,
            },
        });

        console.log("[APPROVE_ADMISSION] Parent DB record created:", parent.id);

        // 5. Create Clerk user for student
        console.log("[APPROVE_ADMISSION] Creating student Clerk user");

        const studentEmail = credentials?.studentUsername
            ? `${credentials.studentUsername}@patohornets.local`
            : `${admission.firstName.toLowerCase()}.${admission.lastName.toLowerCase()}@patohornets.local`;

        console.log("[APPROVE_ADMISSION] Using student email:", studentEmail);

        const studentUserData: any = {
            emailAddress: [studentEmail],
            firstName: admission.firstName,
            lastName: admission.lastName,
            publicMetadata: { role: "student" },
        };

        if (credentials?.studentPassword) {
            studentUserData.password = credentials.studentPassword;
        } else {
            studentUserData.skipPasswordRequirement = true;
        }

        const studentClerkUser = await client.users.createUser(studentUserData);

        console.log("[APPROVE_ADMISSION] Student Clerk user created:", studentClerkUser.id);

        // 6. Create Student profile with provided age group ID
        const student = await prisma.student.create({
            data: {
                userId: studentClerkUser.id,
                firstName: admission.firstName,
                lastName: admission.lastName,
                email: studentEmail,
                phone: admission.phone,
                dateOfBirth: admission.dateOfBirth,
                address: admission.address,
                position: admission.position,
                sex: admission.sex,
                parentId: parent.id,
                ageGroupId: ageGroupId, // Use the provided age group ID
            },
        });

        console.log("[APPROVE_ADMISSION] Student DB record created:", student.id);

        // 7. Send Clerk invitations to parent
        console.log("[APPROVE_ADMISSION] Sending invitation to parent");
        await client.invitations.createInvitation({
            emailAddress: parentEmail, // Use parent email
            publicMetadata: { role: "parent", userId: parentClerkUser.id },
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sign-in`,
        });

        // 8. Update admission status
        await prisma.admission.update({
            where: { id: admissionId },
            data: {
                status: "CONVERTED",
                convertedToStudentId: student.id,
            },
        });

        console.log("[APPROVE_ADMISSION] Success!");

        revalidatePath("/admin/admission");
        revalidatePath("/list/students");
        revalidatePath("/list/parents");

        return {
            success: true,
            error: false,
            message: `Admission approved! Student ${admission.firstName} ${admission.lastName} created and assigned to ${ageGroup.name}.`,
        };
    } catch (err: any) {
        console.error("[APPROVE_ADMISSION] Error:", err);

        // Handle specific Clerk errors
        if (err.errors?.[0]?.code === "form_identifier_exists") {
            return {
                success: false,
                error: true,
                message: "Email already registered. Please use a different email or contact support.",
            };
        }

        return {
            success: false,
            error: true,
            message: `Failed to approve admission: ${err.message || "Unknown error"}`,
        };
    }
};

// ============================================
// REJECT ADMISSION WORKFLOW
// ============================================
export const rejectAdmission = async (admissionId: string, reason?: string) => {
    try {
        console.log("[REJECT_ADMISSION] Rejecting:", admissionId);

        const { userId } = await auth();

        await prisma.admission.update({
            where: { id: admissionId },
            data: {
                status: "REJECTED",
                notes: reason ? `${reason}\n\nRejected by admin.` : "Rejected by admin",
            },
        });

        console.log("[REJECT_ADMISSION] Success");

        revalidatePath("/admin/admission");
        revalidatePath(`/admin/admission/${admissionId}`);

        return {
            success: true,
            error: false,
            message: "Admission rejected successfully",
        };
    } catch (err: any) {
        console.error("[REJECT_ADMISSION] Error:", err);
        return {
            success: false,
            error: true,
            message: `Failed to reject admission: ${err.message || "Unknown error"}`,
        };
    }
};

// ============================================
// GET ADMISSIONS BY PARENT EMAIL
// ============================================
export const getAdmissionsByParentEmail = async (parentEmail: string) => {
    try {
        const admissions = await prisma.admission.findMany({
            where: {
                OR: [
                    { parentEmail: parentEmail },
                    { email: parentEmail }, // In case parent used their own email
                ],
                isDeleted: false,
            },
            orderBy: { createdAt: 'desc' },
        });
        return admissions;
    } catch (err) {
        console.error("[GET_ADMISSIONS_BY_PARENT_EMAIL] Error:", err);
        return [];
    }
};
