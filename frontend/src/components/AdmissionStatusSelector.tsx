"use client";

import { updateAdmissionStatus, approveAdmission, rejectAdmission } from "@/lib/admission-actions";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type AdmissionStatus = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "CONVERTED";

interface AdmissionStatusSelectorProps {
    admissionId: string;
    currentStatus: AdmissionStatus;
}

const AdmissionStatusSelector = ({ admissionId, currentStatus }: AdmissionStatusSelectorProps) => {
    const [status, setStatus] = useState<AdmissionStatus>(currentStatus);
    const [loading, setLoading] = useState(false);
    const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
    const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
    const router = useRouter();

    const handleStatusChange = async (newStatus: AdmissionStatus) => {
        if (newStatus === status) return;

        // If trying to accept, show age group modal
        if (newStatus === "ACCEPTED") {
            setShowAgeGroupModal(true);
            return;
        }

        // If rejecting, call reject action
        if (newStatus === "REJECTED") {
            if (!confirm("Are you sure you want to reject this admission?")) {
                return;
            }

            setLoading(true);
            const result = await rejectAdmission(admissionId);

            if (result.success) {
                setStatus("REJECTED");
                toast.success(result.message || "Admission rejected");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to reject admission");
            }
            setLoading(false);
            return;
        }

        // For other status changes (PENDING, REVIEWING)
        setLoading(true);
        const result = await updateAdmissionStatus(admissionId, newStatus);

        if (result.success) {
            setStatus(newStatus);
            toast.success("Status updated successfully!");
            router.refresh();
        } else {
            toast.error("Failed to update status");
        }
        setLoading(false);
    };

    const handleApprove = async () => {
        if (!selectedAgeGroup) {
            toast.error("Please select an age group");
            return;
        }

        setLoading(true);
        const result = await approveAdmission(admissionId, selectedAgeGroup);

        if (result.success) {
            setStatus("CONVERTED");
            toast.success(result.message || "Admission approved! Student and parent created.");
            setShowAgeGroupModal(false);
            router.refresh();
        } else {
            toast.error(result.message || "Failed to approve admission");
        }
        setLoading(false);
    };

    const statuses: { value: AdmissionStatus; label: string; color: string }[] = [
        { value: "PENDING", label: "Pending", color: "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30" },
        { value: "REVIEWING", label: "Under Review", color: "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30" },
        { value: "ACCEPTED", label: "✅ Approve & Create Student", color: "bg-green-500/20 text-green-600 hover:bg-green-500/30" },
        { value: "REJECTED", label: "❌ Reject", color: "bg-red-500/20 text-red-600 hover:bg-red-500/30" },
    ];

    // Filter out CONVERTED from display if already converted
    const displayStatuses = status === "CONVERTED"
        ? [{ value: "CONVERTED" as AdmissionStatus, label: "✅ Converted to Student", color: "bg-green-600 text-white" }]
        : statuses;

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-muted)]">Update Status</label>
                <div className="flex flex-wrap gap-2">
                    {displayStatuses.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => handleStatusChange(s.value)}
                            disabled={loading || status === "CONVERTED"}
                            className={`
                                px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${s.color}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {s.label}
                            {status === s.value && " ✓"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Age Group Selection Modal */}
            {showAgeGroupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--bg-surface)] rounded-2xl p-6 max-w-md w-full mx-4 border border-[var(--border-color)]">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                            Select Age Group
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-4">
                            Choose which age group this student will be assigned to:
                        </p>

                        <select
                            value={selectedAgeGroup}
                            onChange={(e) => setSelectedAgeGroup(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] mb-4"
                        >
                            <option value="">-- Select Age Group --</option>
                            <option value="U10">U-10 (Under 10)</option>
                            <option value="U12">U-12 (Under 12)</option>
                            <option value="U14">U-14 (Under 14)</option>
                            <option value="U16">U-16 (Under 16)</option>
                            <option value="U18">U-18 (Under 18)</option>
                            <option value="Senior">Senior</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAgeGroupModal(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={loading || !selectedAgeGroup}
                                className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 font-semibold"
                            >
                                {loading ? "Approving..." : "Approve & Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdmissionStatusSelector;
