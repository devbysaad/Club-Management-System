"use client";

import { useState } from "react";
import { recordPayment } from "@/lib/fee-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type FeeCollectionButtonsProps = {
    feeRecordId: string | null;
    playerId: string;
    playerName: string;
    currentStatus: string;
    feeAmount: number;
    month: number;
    year: number;
};

export default function FeeCollectionButtons({
    feeRecordId,
    playerId,
    playerName,
    currentStatus,
    feeAmount,
    month,
    year,
}: FeeCollectionButtonsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleMarkAsPaid = async () => {
        if (!feeRecordId) {
            toast.error("No fee record found for this player");
            return;
        }

        setLoading(true);

        try {
            const result = await recordPayment({
                feeRecordId,
                amount: feeAmount,
                paymentMethod: "CASH",
                notes: `Marked as paid`,
            });

            if (result.success) {
                toast.success("Fee marked as paid");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error("Failed to mark fee as paid");
        } finally {
            setLoading(false);
        }
    };

    if (!feeRecordId) {
        return (
            <div className="text-center">
                <p className="text-xs text-[var(--text-muted)] mb-1">No fee record</p>
                <p className="text-[10px] text-[var(--text-muted)] italic">Generate records first</p>
            </div>
        );
    }

    if (currentStatus === "PAID") {
        return (
            <div className="flex items-center justify-center gap-2">
                <button
                    disabled
                    className="w-10 h-10 rounded-md bg-fcGreen flex items-center justify-center text-white cursor-not-allowed opacity-100"
                >
                    ✓
                </button>
                <button
                    disabled
                    className="w-10 h-10 rounded-md bg-fcSurface/50 flex items-center justify-center text-[var(--text-muted)] cursor-not-allowed"
                >
                    ✗
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={handleMarkAsPaid}
                disabled={loading}
                className="w-10 h-10 rounded-md bg-fcGreen hover:bg-fcGreen/80 flex items-center justify-center text-white transition-colors disabled:opacity-50"
                title="Mark as Paid"
            >
                {loading ? "..." : "✓"}
            </button>
            <button
                disabled
                className="w-10 h-10 rounded-md bg-fcSurface/50 flex items-center justify-center text-[var(--text-muted)] cursor-not-allowed"
                title="Mark as Unpaid (Not available)"
            >
                ✗
            </button>
        </div>
    );
}
