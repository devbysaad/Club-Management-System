"use client";

import { useState } from "react";
import { recordPayment } from "@/lib/fee-actions";
import { toast } from "react-toastify";

type PaymentModalProps = {
    feeRecord: {
        id: string;
        month: number;
        year: number;
        amount: number;
        paidAmount: number;
        status: string;
        feePlan: {
            name: string;
        };
    };
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function PaymentModal({ feeRecord, isOpen, onClose, onSuccess }: PaymentModalProps) {
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [receiptNumber, setReceiptNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const remaining = feeRecord.amount - feeRecord.paidAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await recordPayment({
                feeRecordId: feeRecord.id,
                amount: parseFloat(amount),
                paymentMethod: paymentMethod as any,
                receiptNumber: receiptNumber || undefined,
                notes: notes || undefined,
            });

            if (result.success) {
                toast.success(result.message);
                setAmount("");
                setReceiptNumber("");
                setNotes("");
                onSuccess();
                onClose();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to record payment");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-card)] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[var(--bg-card)] border-b border-[var(--border-color)] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
                                Record Payment
                            </h2>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                {MONTHS[feeRecord.month - 1]} {feeRecord.year} - {feeRecord.feePlan.name}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Fee Summary */}
                <div className="p-6 bg-[var(--bg-surface)] border-b border-[var(--border-color)]">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Total Amount</p>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">
                                PKR {feeRecord.amount.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Paid Amount</p>
                            <p className="text-lg font-semibold text-fcGreen">
                                PKR {feeRecord.paidAmount.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Remaining</p>
                            <p className="text-lg font-semibold text-fcGarnet">
                                PKR {remaining.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Payment Amount <span className="text-fcGarnet">*</span>
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="0.01"
                            max={remaining}
                            step="0.01"
                            required
                            className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            Maximum: PKR {remaining.toLocaleString()}
                        </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Payment Method <span className="text-fcGarnet">*</span>
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                        >
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="DEBIT_CARD">Debit Card</option>
                            <option value="PAYPAL">PayPal</option>
                            <option value="STRIPE">Stripe</option>
                        </select>
                    </div>

                    {/* Receipt Number */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Receipt Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={receiptNumber}
                            onChange={(e) => setReceiptNumber(e.target.value)}
                            placeholder="e.g., RCP-2024-001"
                            className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)]"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional notes..."
                            rows={3}
                            className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-fcBlue text-[var(--text-primary)] resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className="flex-1 px-4 py-2 bg-fcGreen hover:bg-fcGreen/80 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Recording..." : "Record Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
