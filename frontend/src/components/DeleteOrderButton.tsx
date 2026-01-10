"use client";

import { deleteOrder } from "@/lib/order-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteOrderButtonProps {
    orderId: string;
    customerName: string;
}

const DeleteOrderButton = ({ orderId, customerName }: DeleteOrderButtonProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete order from ${customerName}? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        const result = await deleteOrder(orderId);

        if (result.success) {
            toast.success(result.message || "Order deleted successfully");
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete order");
        }
        setLoading(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30 text-xs font-medium transition-colors disabled:opacity-50"
        >
            {loading ? "Deleting..." : "🗑️ Delete"}
        </button>
    );
};

export default DeleteOrderButton;
