'use server';

import { Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { emitSystemEvent } from '@/lib/systemEvents';
import { currentUser } from '@clerk/nextjs/server';

// Simple role check wrapper
async function checkAdminRole() {
    const user = await currentUser();
    if (!user || user.publicMetadata.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
    }
    return user;
}

// Mark monthly fee as paid
export async function markFeeAsPaid(formData: FormData) {
    try {
        // Check admin role
        await checkAdminRole();

        const studentId = formData.get('studentId') as string;
        const month = parseInt(formData.get('month') as string);
        const year = parseInt(formData.get('year') as string);
        const amount = parseFloat(formData.get('amount') as string);
        const sendEmail = formData.get('sendEmail') === 'true';

        console.log(`💰 [FEE] Marking fee as paid for student ${studentId}, ${month}/${year}`);

        // Find student with parent
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: true },
        });

        if (!student) {
            return { success: false, error: true, message: 'Student not found' };
        }

        // Check if fee record exists
        const existingFee = await prisma.monthlyFee.findUnique({
            where: {
                studentId_month_year: {
                    studentId,
                    month,
                    year,
                },
            },
        });

        let fee;

        if (existingFee) {
            // Update existing fee
            fee = await prisma.monthlyFee.update({
                where: { id: existingFee.id },
                data: {
                    status: 'PAID',
                    paidAt: new Date(),
                    paidAmount: amount,
                },
            });
        } else {
            // Create new fee record
            const dueDate = new Date(year, month - 1, 5); // 5th of the month

            fee = await prisma.monthlyFee.create({
                data: {
                    studentId,
                    parentId: student.parentId,
                    amount,
                    month,
                    year,
                    status: 'PAID',
                    dueDate,
                    paidAt: new Date(),
                    paidAmount: amount,
                },
            });
        }

        console.log(`✅ [FEE] Fee marked as paid: ${fee.id}`);

        // Send confirmation email if requested
        if (sendEmail) {
            console.log(`📧 [FEE] Sending payment confirmation email`);
            try {
                await emitSystemEvent({ type: 'FEE_PAID', payload: { feeId: fee.id } });
            } catch (emailError: any) {
                console.error('⚠️ [FEE] Email sending failed:', emailError.message);
                // Don't fail the entire operation if email fails
            }
        }

        revalidatePath(`/list/students/${studentId}`);

        return {
            success: true,
            error: false,
            message: `Fee marked as paid for ${month}/${year}`,
        };
    } catch (error: any) {
        console.error('❌ [FEE] Error marking fee as paid:', error);
        return {
            success: false,
            error: true,
            message: error.message || 'Failed to mark fee as paid',
        };
    }
}

// Get student fees for a year
export async function getStudentFees(studentId: string, year: number) {
    try {
        const fees = await prisma.monthlyFee.findMany({
            where: {
                studentId,
                year,
                isDeleted: false,
            },
            orderBy: {
                month: 'asc',
            },
        });

        // Create a map for quick lookup
        const feeMap: Record<number, any> = {};
        fees.forEach((fee: any) => {
            feeMap[fee.month] = fee;
        });

        // Return all 12 months with status
        const monthlyFees = [];
        for (let month = 1; month <= 12; month++) {
            const fee = feeMap[month];
            monthlyFees.push({
                month,
                status: fee?.status || 'UNPAID',
                amount: fee?.amount,
                paidAt: fee?.paidAt,
                paidAmount: fee?.paidAmount,
                feeId: fee?.id,
            });
        }

        return monthlyFees;
    } catch (error: any) {
        console.error('❌ [FEE] Error fetching student fees:', error);
        return [];
    }
}
