"use client";

import { deleteAdmission } from "@/lib/admission-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteAdmissionButtonProps {
    admissionId: string;
    applicantName: string;
}

const DeleteAdmissionButton = ({ admissionId, applicantName }: DeleteAdmissionButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteAdmission(admissionId);

        if (result.success) {
            toast.success("Admission deleted successfully");
            router.push("/admin/admission");
            router.refresh();
        } else {
            toast.error("Failed to delete admission");
        }
        setLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-600 hover:bg-red-500/30 text-sm font-medium transition-colors flex items-center gap-2 border border-red-500/30"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Admission
            </button>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-surface)] rounded-2xl p-6 max-w-md w-full border border-[var(--border-color)]">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border-2 border-red-500/20">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-[var(--text-primary)] text-center mb-2">
                            Delete Admission?
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] text-center mb-6">
                            Are you sure you want to delete the admission for <strong>{applicantName}</strong>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-light)] disabled:opacity-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 font-semibold"
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAdmissionButton;
