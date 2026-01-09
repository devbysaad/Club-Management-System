"use client";

import { updateAdmissionStatus } from "@/lib/admission-actions";
import { useState } from "react";
import { toast } from "react-toastify";

type AdmissionStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

interface AdmissionStatusSelectorProps {
    admissionId: string;
    currentStatus: AdmissionStatus;
}

const AdmissionStatusSelector = ({ admissionId, currentStatus }: AdmissionStatusSelectorProps) => {
    const [status, setStatus] = useState<AdmissionStatus>(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: AdmissionStatus) => {
        if (newStatus === status) return;

        setLoading(true);
        const result = await updateAdmissionStatus(admissionId, newStatus);

        if (result.success) {
            setStatus(newStatus);
            toast.success("Admission status updated successfully!");
        } else {
            toast.error("Failed to update status");
        }
        setLoading(false);
    };

    const statuses: { value: AdmissionStatus; label: string; color: string }[] = [
        { value: "PENDING", label: "Pending", color: "bg-fcGold/20 text-fcGold hover:bg-fcGold/30" },
        { value: "REVIEWING", label: "Reviewing", color: "bg-fcBlue/20 text-fcBlue hover:bg-fcBlue/30" },
        { value: "ACCEPTED", label: "Accepted", color: "bg-fcGreen/20 text-fcGreen hover:bg-fcGreen/30" },
        { value: "REJECTED", label: "Rejected", color: "bg-fcGarnet/20 text-fcGarnet hover:bg-fcGarnet/30" },
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

export default AdmissionStatusSelector;
