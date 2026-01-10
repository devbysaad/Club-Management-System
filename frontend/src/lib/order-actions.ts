// ============================================
// ORDER ACTIONS (Jersey Shop)
// ============================================
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";

const orderSchema = z.object({
    customerName: z.string().min(1),
    contactNumber: z.string().min(1),
    email: z.string().email(),
    shirtSize: z.string().min(1),
    shortsSize: z.string().min(1),
    socksSize: z.string().min(1),
    jerseyName: z.string().min(1),
    jerseyNumber: z.number().int().positive(),
    customLength: z.string().optional(),
    customWidth: z.string().optional(),
    customNotes: z.string().optional(),
});

export type OrderSchema = z.infer<typeof orderSchema>;

export const createOrder = async (data: OrderSchema) => {
    try {
        console.log("[CREATE_ORDER] Starting:", data);

        const { userId } = await auth();
        if (!userId) {
            console.error("[CREATE_ORDER] No userId");
            return { success: false, error: true, message: "Not authenticated" };
        }

        const order = await prisma.order.create({
            data: {
                userId,
                customerName: data.customerName,
                contactNumber: data.contactNumber,
                email: data.email,
                shirtSize: data.shirtSize,
                shortsSize: data.shortsSize,
                socksSize: data.socksSize,
                jerseyName: data.jerseyName,
                jerseyNumber: data.jerseyNumber,
                customLength: data.customLength || null,
                customWidth: data.customWidth || null,
                customNotes: data.customNotes || null,
            },
        });

        console.log("[CREATE_ORDER] Success:", order.id);
        revalidatePath("/admin/orders");

        return {
            success: true,
            error: false,
            message: `Order #${order.id.slice(0, 8)} placed successfully!`
        };
    } catch (err: any) {
        console.error("[CREATE_ORDER] Error:", err);
        return {
            success: false,
            error: true,
            message: err.message || "Failed to place order"
        };
    }
};

export const getAllOrders = async () => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    } catch (err) {
        console.error("[GET_ORDERS] Error:", err);
        return [];
    }
};

export const getOrderById = async (id: string) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id },
        });
        return order;
    } catch (err) {
        console.error("[GET_ORDER] Error:", err);
        return null;
    }
};

export const updateOrderStatus = async (id: string, status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED") => {
    try {
        await prisma.order.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/admin/orders");
        return { success: true, error: false };
    } catch (err) {
        console.error("[UPDATE_ORDER_STATUS] Error:", err);
        return { success: false, error: true };
    }
};

export const deleteOrder = async (id: string) => {
    try {
        await prisma.order.delete({
            where: { id },
        });
        revalidatePath("/admin/orders");
        return { success: true, error: false, message: "Order deleted successfully" };
    } catch (err: any) {
        console.error("[DELETE_ORDER] Error:", err);
        return { success: false, error: true, message: err.message || "Failed to delete order" };
    }
};
