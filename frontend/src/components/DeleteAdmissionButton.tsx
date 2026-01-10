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
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!confirm(`Are you sure you want to delete admission for ${applicantName}? This action cannot be undone.`)) {
            return;
        }

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
        <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-600 hover:bg-red-500/30 text-sm font-medium transition-colors disabled:opacity-50"
        >
            {loading ? "Deleting..." : "🗑️ Delete Admission"}
        </button>
    );
};

export default DeleteAdmissionButton;
