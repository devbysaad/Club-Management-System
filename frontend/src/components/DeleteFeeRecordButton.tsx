"use client";

import { useState } from "react";
import { deleteFeeRecord } from "@/lib/fee-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type DeleteFeeRecordButtonProps = {
    feeRecordId: string;
    playerName: string;
    month: number;
    year: number;
};

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function DeleteFeeRecordButton({
    feeRecordId,
    playerName,
    month,
    year
}: DeleteFeeRecordButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = confirm(
            `Delete fee record for ${playerName}?\n${monthNames[month - 1]} ${year}\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setLoading(true);

        try {
            const result = await deleteFeeRecord(feeRecordId);

            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error("Failed to delete fee record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="w-10 h-10 rounded-md bg-fcGarnet hover:bg-fcGarnet/80 flex items-center justify-center text-white transition-colors disabled:opacity-50"
            title="Delete fee record"
        >
            {loading ? "..." : "🗑️"}
        </button>
    );
}
