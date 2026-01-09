// ============================================
// ADMISSION ACTIONS
// ============================================
"use server";

import { z } from "zod";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

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

export const updateAdmissionStatus = async (id: string, status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED") => {
    try {
        await prisma.admission.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/admin/admission");
        revalidatePath(`/admin/admission/${id}`);
        return { success: true, error: false };
    } catch (err) {
        console.error("Update Admission Status Error:", err);
        return { success: false, error: true };
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
