"use server";

import prisma from "./prisma";

/**
 * Get monthly revenue data from fee records
 */
export async function getMonthlyRevenue(year?: number) {
    try {
        const currentYear = year || new Date().getFullYear();

        // Get all fee records for the year
        const feeRecords = await prisma.playerFeeRecord.findMany({
            where: {
                year: currentYear,
                isDeleted: false,
            },
            select: {
                month: true,
                paidAmount: true,
                amount: true,
            },
        });

        // Group by month and calculate totals
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const monthRecords = feeRecords.filter(r => r.month === month);
            const income = monthRecords.reduce((sum, r) => sum + Number(r.paidAmount), 0);
            const expected = monthRecords.reduce((sum, r) => sum + Number(r.amount), 0);

            return {
                name: new Date(currentYear, i).toLocaleDateString("en-US", { month: "short" }),
                income,
                expense: 0, // We don't track expenses yet
                expected,
            };
        });

        return monthlyData;
    } catch (error) {
        console.error("[GET_MONTHLY_REVENUE] Error:", error);
        return [];
    }
}
