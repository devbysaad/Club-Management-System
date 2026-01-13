"use server";

import { z } from "zod";
import prisma from "./prisma";
import { withRole } from "./action-helpers";
import { Role, FeeStatus, FeeFrequency, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

type ActionResult = {
    success: boolean;
    error: boolean;
    message: string;
    data?: any;
};

// ============================================
// FEE PLAN MANAGEMENT (Admin Only)
// ============================================

const FeePlanSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    amount: z.number().min(0, "Amount must be positive"),
    frequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "ONE_TIME"]).default("MONTHLY"),
    isActive: z.boolean().default(true),
});

export async function createFeePlan(data: z.infer<typeof FeePlanSchema>): Promise<ActionResult> {
    return withRole([Role.ADMIN], async (user) => {
        try {
            const validated = FeePlanSchema.parse(data);

            const feePlan = await prisma.feePlan.create({
                data: {
                    name: validated.name,
                    description: validated.description,
                    amount: validated.amount,
                    frequency: validated.frequency as FeeFrequency,
                    isActive: validated.isActive,
                },
            });

            revalidatePath("/admin/fees");
            return {
                success: true,
                error: false,
                message: "Fee plan created successfully",
                data: feePlan,
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to create fee plan",
            };
        }
    });
}

export async function getActiveFeePlans() {
    try {
        const feePlans = await prisma.feePlan.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return feePlans;
    } catch (error) {
        console.error("[GET_ACTIVE_FEE_PLANS] Error:", error);
        return [];
    }
}

/**
 * Delete a fee plan (Admin only)
 */
export async function deleteFeePlan(feePlanId: string): Promise<ActionResult> {
    return withRole([Role.ADMIN], async (user) => {
        try {
            // Check if plan has any fee records
            const recordCount = await prisma.playerFeeRecord.count({
                where: { feePlanId, isDeleted: false },
            });

            if (recordCount > 0) {
                return {
                    success: false,
                    error: true,
                    message: `Cannot delete fee plan. ${recordCount} fee records are using this plan. Delete those records first.`,
                };
            }

            await prisma.feePlan.delete({
                where: { id: feePlanId },
            });

            revalidatePath("/admin/fees");
            return {
                success: true,
                error: false,
                message: "Fee plan deleted successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to delete fee plan",
            };
        }
    });
}

// ============================================
// FEE RECORD MANAGEMENT
// ============================================

/**
 * Generate monthly fee records for all active players
 */
export async function generateMonthlyFeeRecords(month: number, year: number): Promise<ActionResult> {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        try {
            // Get all active players
            const activePlayers = await prisma.student.findMany({
                where: { isDeleted: false },
                select: { id: true, firstName: true, lastName: true },
            });

            // Get active monthly fee plan
            const feePlan = await prisma.feePlan.findFirst({
                where: { isActive: true, frequency: FeeFrequency.MONTHLY },
            });

            if (!feePlan) {
                return {
                    success: false,
                    error: true,
                    message: "No active monthly fee plan found. Please create one first.",
                };
            }

            let created = 0;
            let skipped = 0;

            for (const player of activePlayers) {
                // Check if record already exists
                const existing = await prisma.playerFeeRecord.findUnique({
                    where: {
                        playerId_feePlanId_month_year: {
                            playerId: player.id,
                            feePlanId: feePlan.id,
                            month,
                            year,
                        },
                    },
                });

                if (!existing) {
                    await prisma.playerFeeRecord.create({
                        data: {
                            playerId: player.id,
                            feePlanId: feePlan.id,
                            month,
                            year,
                            amount: feePlan.amount,
                            dueDate: new Date(year, month - 1, 5), // 5th of each month
                            status: FeeStatus.UNPAID,
                        },
                    });
                    created++;
                } else {
                    skipped++;
                }
            }

            revalidatePath("/admin/fees");
            revalidatePath("/list/students");

            return {
                success: true,
                error: false,
                message: `Generated ${created} fee records. Skipped ${skipped} existing records.`,
                data: { created, skipped },
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to generate fee records",
            };
        }
    });
}

/**
 * Get fee records for a specific player
 */
export async function getPlayerFeeRecords(playerId: string, year?: number) {
    try {
        const currentYear = year || new Date().getFullYear();

        const records = await prisma.playerFeeRecord.findMany({
            where: {
                playerId,
                year: currentYear,
                isDeleted: false,
            },
            include: {
                feePlan: true,
                payments: {
                    orderBy: { paidAt: "desc" },
                },
            },
            orderBy: { month: "asc" },
        });

        return records;
    } catch (error) {
        console.error("[GET_PLAYER_FEE_RECORDS] Error:", error);
        return [];
    }
}

/**
 * Delete a fee record (Admin/Staff)
 */
export async function deleteFeeRecord(feeRecordId: string): Promise<ActionResult> {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        try {
            // Check if record has any payments
            const paymentCount = await prisma.feePayment.count({
                where: { feeRecordId },
            });

            if (paymentCount > 0) {
                return {
                    success: false,
                    error: true,
                    message: `Cannot delete fee record. It has ${paymentCount} payment(s) recorded. Delete payments first.`,
                };
            }

            await prisma.playerFeeRecord.update({
                where: { id: feeRecordId },
                data: { isDeleted: true },
            });

            revalidatePath("/admin/fees");
            revalidatePath("/list/students");
            return {
                success: true,
                error: false,
                message: "Fee record deleted successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to delete fee record",
            };
        }
    });
}

/**
 * Create a fee record for an individual player (Admin/Staff)
 */
export async function createFeeRecordForPlayer(data: {
    playerId: string;
    feePlanId: string;
    month: number;
    year: number;
}): Promise<ActionResult> {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        try {
            // Get the fee plan
            const feePlan = await prisma.feePlan.findUnique({
                where: { id: data.feePlanId },
            });

            if (!feePlan) {
                return {
                    success: false,
                    error: true,
                    message: "Fee plan not found",
                };
            }

            // Check if record already exists
            const existing = await prisma.playerFeeRecord.findUnique({
                where: {
                    playerId_feePlanId_month_year: {
                        playerId: data.playerId,
                        feePlanId: data.feePlanId,
                        month: data.month,
                        year: data.year,
                    },
                },
            });

            if (existing && !existing.isDeleted) {
                return {
                    success: false,
                    error: true,
                    message: "Fee record already exists for this player, plan, and month",
                };
            }

            // Create or restore the fee record
            if (existing && existing.isDeleted) {
                // Restore the deleted record
                await prisma.playerFeeRecord.update({
                    where: { id: existing.id },
                    data: {
                        isDeleted: false,
                        deletedAt: null,
                        amount: feePlan.amount,
                        status: FeeStatus.UNPAID,
                        paidAmount: 0,
                    },
                });
            } else {
                // Create new record
                await prisma.playerFeeRecord.create({
                    data: {
                        playerId: data.playerId,
                        feePlanId: data.feePlanId,
                        month: data.month,
                        year: data.year,
                        amount: feePlan.amount,
                        dueDate: new Date(data.year, data.month - 1, 5), // 5th of each month
                        status: FeeStatus.UNPAID,
                    },
                });
            }

            revalidatePath("/admin/fees/collect");
            revalidatePath("/admin/fees");
            revalidatePath("/list/students");

            return {
                success: true,
                error: false,
                message: "Fee record created successfully",
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to create fee record",
            };
        }
    });
}

// ============================================
// PAYMENT MANAGEMENT
// ============================================

const PaymentSchema = z.object({
    feeRecordId: z.string(),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "CASH", "PAYPAL", "STRIPE", "MOCK"]).default("CASH"),
    receiptNumber: z.string().optional(),
    notes: z.string().optional(),
});

export async function recordPayment(data: z.infer<typeof PaymentSchema>): Promise<ActionResult> {
    return withRole([Role.ADMIN, Role.STAFF], async (user) => {
        try {
            const validated = PaymentSchema.parse(data);

            // Get the fee record
            const feeRecord = await prisma.playerFeeRecord.findUnique({
                where: { id: validated.feeRecordId },
            });

            if (!feeRecord) {
                return {
                    success: false,
                    error: true,
                    message: "Fee record not found",
                };
            }

            // Check if payment exceeds remaining amount
            const remaining = feeRecord.amount - feeRecord.paidAmount;
            if (validated.amount > remaining) {
                return {
                    success: false,
                    error: true,
                    message: `Payment amount (${validated.amount}) exceeds remaining balance (${remaining})`,
                };
            }

            // Create payment record
            const payment = await prisma.feePayment.create({
                data: {
                    feeRecordId: validated.feeRecordId,
                    amount: validated.amount,
                    paymentMethod: validated.paymentMethod as any,
                    receivedBy: user.id,
                    receiptNumber: validated.receiptNumber,
                    notes: validated.notes,
                },
            });

            // Update fee record
            const newPaidAmount = feeRecord.paidAmount + validated.amount;
            const percentage = (newPaidAmount / feeRecord.amount) * 100;

            let newStatus: FeeStatus;
            if (percentage >= 100) {
                newStatus = FeeStatus.PAID;
            } else if (percentage > 0) {
                newStatus = FeeStatus.PARTIAL;
            } else {
                newStatus = FeeStatus.UNPAID;
            }

            await prisma.playerFeeRecord.update({
                where: { id: validated.feeRecordId },
                data: {
                    paidAmount: newPaidAmount,
                    status: newStatus,
                },
            });

            revalidatePath(`/list/students/${feeRecord.playerId}`);
            revalidatePath("/admin/fees");

            return {
                success: true,
                error: false,
                message: `Payment of ${validated.amount} recorded successfully`,
                data: payment,
            };
        } catch (error: any) {
            return {
                success: false,
                error: true,
                message: error.message || "Failed to record payment",
            };
        }
    });
}

/**
 * Get payment history for a fee record
 */
export async function getPaymentHistory(feeRecordId: string) {
    try {
        const payments = await prisma.feePayment.findMany({
            where: { feeRecordId },
            orderBy: { paidAt: "desc" },
        });
        return payments;
    } catch (error) {
        console.error("[GET_PAYMENT_HISTORY] Error:", error);
        return [];
    }
}

// ============================================
// REPORTS
// ============================================

/**
 * Get list of players with unpaid fees
 */
export async function getUnpaidPlayers() {
    try {
        const unpaidRecords = await prisma.playerFeeRecord.findMany({
            where: {
                status: { in: [FeeStatus.UNPAID, FeeStatus.PARTIAL, FeeStatus.OVERDUE] },
                isDeleted: false,
            },
            include: {
                player: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        parent: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phone: true,
                            },
                        },
                    },
                },
                feePlan: true,
            },
            orderBy: { dueDate: "asc" },
        });

        return unpaidRecords;
    } catch (error) {
        console.error("[GET_UNPAID_PLAYERS] Error:", error);
        return [];
    }
}

/**
 * Get monthly collection report
 */
export async function getMonthlyCollectionReport(month: number, year: number) {
    try {
        const records = await prisma.playerFeeRecord.findMany({
            where: {
                month,
                year,
                isDeleted: false,
            },
            include: {
                payments: true,
                player: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const totalDue = records.reduce((sum, record) => sum + record.amount, 0);
        const totalPaid = records.reduce((sum, record) => sum + record.paidAmount, 0);
        const totalPending = totalDue - totalPaid;

        const byStatus = {
            paid: records.filter(r => r.status === FeeStatus.PAID).length,
            partial: records.filter(r => r.status === FeeStatus.PARTIAL).length,
            unpaid: records.filter(r => r.status === FeeStatus.UNPAID).length,
            overdue: records.filter(r => r.status === FeeStatus.OVERDUE).length,
        };

        return {
            month,
            year,
            totalRecords: records.length,
            totalDue,
            totalPaid,
            totalPending,
            byStatus,
            records,
        };
    } catch (error) {
        console.error("[GET_MONTHLY_COLLECTION_REPORT] Error:", error);
        return null;
    }
}
