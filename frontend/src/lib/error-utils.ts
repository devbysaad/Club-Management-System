// ============================================
// ERROR FORMATTING UTILITIES
// ============================================
// NO "use server" - these are pure utility functions

/**
 * Convert Prisma errors to user-friendly messages
 */
export function formatPrismaError(error: any): string {
    if (error.code === "P2002") {
        const field = error.meta?.target?.[0] || "field";
        return `A record with this ${field} already exists`;
    }

    if (error.code === "P2003") {
        return "Related record not found. Please check your inputs.";
    }

    if (error.code === "P2025") {
        return "Record not found";
    }

    if (error.code === "P2014") {
        return "This operation would violate a relation constraint";
    }

    return error.message || "Database operation failed";
}

/**
 * Format general errors
 */
export function formatError(error: any): string {
    if (error.message) return error.message;
    if (typeof error === "string") return error;
    return "An unexpected error occurred";
}
