"use client";

import { useState, useEffect } from "react";
import { recordPayment, createFeeRecordForPlayer } from "@/lib/fee-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type FeePlan = {
    id: string;
    name: string;
    amount: number;
};

type FeeCollectionButtonsProps = {
    feeRecordId: string | null;
    playerId: string;
    playerName: string;
    currentStatus: string;
    feeAmount: number;
    month: number;
    year: number;
    feePlans?: FeePlan[];
};

export default function FeeCollectionButtons({
    feeRecordId,
    playerId,
    playerName,
    currentStatus,
    feeAmount,
    month,
    year,
    feePlans = [],
}: FeeCollectionButtonsProps) {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        // Auto-select first plan if available
        if (feePlans.length > 0 && !selectedPlan) {
            setSelectedPlan(feePlans[0].id);
        }
    }, [feePlans, selectedPlan]);

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

    const handleCreateFeeRecord = async () => {
        if (!selectedPlan) {
            toast.error("Please select a fee plan");
            return;
        }

        setLoading(true);

        try {
            const result = await createFeeRecordForPlayer({
                playerId,
                feePlanId: selectedPlan,
                month,
                year,
            });

            if (result.success) {
                toast.success(`Fee record created for ${playerName}`);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error("Failed to create fee record");
        } finally {
            setLoading(false);
        }
    };

    // No fee record - show fee plan selector and create button
    if (!feeRecordId) {
        return (
            <div className="flex items-center gap-2">
                {feePlans.length > 0 ? (
                    <>
                        <select
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-fcBlue"
                            disabled={loading}
                        >
                            {feePlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} (PKR {plan.amount.toLocaleString()})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleCreateFeeRecord}
                            disabled={loading}
                            className="px-3 py-1.5 text-sm bg-fcBlue hover:bg-fcBlue/80 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                            title="Create Fee Record"
                        >
                            {loading ? "..." : "+ Create"}
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <p className="text-xs text-[var(--text-muted)] mb-1">No fee plans</p>
                        <p className="text-[10px] text-[var(--text-muted)] italic">Create a plan first</p>
                    </div>
                )}
            </div>
        );
    }

    // Fee paid - show checkmark
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

    // Fee record exists but unpaid - show mark as paid button
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
