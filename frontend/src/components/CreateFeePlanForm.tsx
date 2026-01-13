"use client";

import { useState } from "react";
import { createFeePlan } from "@/lib/fee-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CreateFeePlanForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        amount: 5000,
        frequency: "MONTHLY",
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createFeePlan({
                ...formData,
                amount: parseFloat(formData.amount.toString()),
                frequency: formData.frequency as "MONTHLY" | "QUARTERLY" | "YEARLY" | "ONE_TIME",
            });

            if (result.success) {
                toast.success(result.message);
                router.push("/admin/fees");
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create fee plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Plan Name <span className="text-fcGarnet">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Monthly Academy Fee"
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Description (Optional)
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this fee plan..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)] resize-none"
                />
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Amount (PKR) <span className="text-fcGarnet">*</span>
                </label>
                <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="5000"
                    min="0"
                    step="100"
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                />
            </div>

            {/* Frequency */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Frequency <span className="text-fcGarnet">*</span>
                </label>
                <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                    <option value="ONE_TIME">One-Time</option>
                </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]">
                <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border-color)] text-fcGreen focus:ring-fcGreen"
                />
                <label htmlFor="isActive" className="text-sm text-[var(--text-primary)] cursor-pointer">
                    Set as active fee plan (will be used for generating fee records)
                </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-6 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-lg font-semibold transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-fcGreen hover:bg-fcGreen/80 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating..." : "Create Fee Plan"}
                </button>
            </div>
        </form>
    );
}
