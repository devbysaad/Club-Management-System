"use client";

import { updateOrderStatus } from "@/lib/order-actions";
import { useState } from "react";
import { toast } from "react-toastify";

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

interface StatusSelectorProps {
    orderId: string;
    currentStatus: OrderStatus;
}

const StatusSelector = ({ orderId, currentStatus }: StatusSelectorProps) => {
    const [status, setStatus] = useState<OrderStatus>(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (newStatus === status) return;

        setLoading(true);
        const result = await updateOrderStatus(orderId, newStatus);

        if (result.success) {
            setStatus(newStatus);
            toast.success("Order status updated successfully!");
        } else {
            toast.error("Failed to update status");
        }
        setLoading(false);
    };

    const statuses: { value: OrderStatus; label: string; color: string }[] = [
        { value: "PENDING", label: "Pending", color: "bg-fcGold/20 text-fcGold hover:bg-fcGold/30" },
        { value: "PROCESSING", label: "Processing", color: "bg-fcBlue/20 text-fcBlue hover:bg-fcBlue/30" },
        { value: "COMPLETED", label: "Completed", color: "bg-fcGreen/20 text-fcGreen hover:bg-fcGreen/30" },
        { value: "CANCELLED", label: "Cancelled", color: "bg-fcGarnet/20 text-fcGarnet hover:bg-fcGarnet/30" },
    ];

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-muted)]">Update Status</label>
            <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => handleStatusChange(s.value)}
                        disabled={loading || status === s.value}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${status === s.value
                                ? s.color + " ring-2 ring-offset-2 ring-offset-[var(--bg-primary)] ring-current"
                                : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {s.label}
                        {status === s.value && " ✓"}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StatusSelector;
