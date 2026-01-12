"use server";

import prisma from "./prisma";
import { Role } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Sync admin/staff user from Clerk to Prisma Staff table
 * Run this manually for existing admins or during user creation
 */
export async function syncAdminToPrisma(
    userId: string,
    email: string,
    firstName: string,
    lastName: string
) {
    try {
        // Check if already exists
        const existing = await prisma.staff.findUnique({
            where: { userId }
        });

        if (existing) {
            console.log(`✅ Staff record already exists for ${email}`);
            return { success: true, data: existing };
        }

        // Create new staff record
        const staff = await prisma.staff.create({
            data: {
                userId,
                email,
                firstName,
                lastName,
                phone: "",
                address: "",
                isDeleted: false,
            }
        });

        console.log(`✅ Created Staff record for ${email}`);
        return { success: true, data: staff };

    } catch (error) {
        console.error('❌ [syncAdminToPrisma] Error:', error);
        return { success: false, error };
    }
}

/**
 * One-time migration: Sync all existing Clerk admins to Prisma
 * Run this in your console or create an API route to trigger it
 */
export async function migrateAllAdminsToPrisma() {
    try {
        const client = await clerkClient();
        const users = await client.users.getUserList();

        const results = [];

        for (const user of users.data) {
            const role = (user.publicMetadata?.role as string)?.toUpperCase();

            if (role === "ADMIN" || role === "STAFF") {
                const email = user.emailAddresses[0]?.emailAddress || "";
                const firstName = user.firstName || "Admin";
                const lastName = user.lastName || "User";

                const result = await syncAdminToPrisma(
                    user.id,
                    email,
                    firstName,
                    lastName
                );

                results.push({
                    userId: user.id,
                    email,
                    success: result.success
                });
            }
        }

        return {
            success: true,
            synced: results.length,
            details: results
        };

    } catch (error) {
        console.error('❌ [migrateAllAdminsToPrisma] Error:', error);
        return { success: false, error };
    }
}
