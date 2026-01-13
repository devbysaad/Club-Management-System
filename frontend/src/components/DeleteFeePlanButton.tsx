"use client";

import { useState } from "react";
import { deleteFeePlan } from "@/lib/fee-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type DeleteFeePlanButtonProps = {
    planId: string;
    planName: string;
};

export default function DeleteFeePlanButton({ planId, planName }: DeleteFeePlanButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = confirm(
            `Are you sure you want to delete the fee plan "${planName}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const result = await deleteFeePlan(planId);

            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error("Failed to delete fee plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-fcGarnet hover:bg-fcGarnet/80 text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
