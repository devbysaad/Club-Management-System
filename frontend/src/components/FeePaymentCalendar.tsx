'use client';

import { markFeeAsPaid } from '@/lib/fee-actions';
import { useState } from 'react';
import { toast } from 'react-toastify';

const FeePaymentCalendar = ({
    studentId,
    studentName,
    year,
    fees,
    isAdmin,
}: {
    studentId: string;
    studentName: string;
    year: number;
    fees: Array<{
        month: number;
        status: string;
        amount?: number;
        paidAt?: Date;
        paidAmount?: number;
    }>;
    isAdmin: boolean;
}) => {
    const [loading, setLoading] = useState<number | null>(null);
    const [sendEmail, setSendEmail] = useState(true);
    const [feeAmount, setFeeAmount] = useState(5000); // Default fee amount

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const handleMarkAsPaid = async (month: number) => {
        if (!isAdmin) return;

        const confirmed = confirm(`Mark fee as PAID for ${monthNames[month - 1]} ${year}?\nAmount: PKR ${feeAmount}`);
        if (!confirmed) return;

        setLoading(month);

        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('month', month.toString());
        formData.append('year', year.toString());
        formData.append('amount', feeAmount.toString());
        formData.append('sendEmail', sendEmail.toString());

        try {
            const result = await markFeeAsPaid(formData);

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error('Failed to mark fee as paid');
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    if (!isAdmin) {
        return null; // Don't show to non-admins
    }

    return (
        <div className="glass-card rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-heading font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <span>💰</span>
                        Fee Payment Calendar - {year}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Click on unpaid months to mark as paid
                    </p>
                </div>
            </div>

            {/* Settings */}
            <div className="mb-6 flex flex-wrap items-center gap-4 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-[var(--text-muted)]">Monthly Fee:</label>
                    <input
                        type="number"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(parseInt(e.target.value) || 0)}
                        className="w-32 px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm"
                        placeholder="Amount"
                    />
                    <span className="text-sm text-[var(--text-muted)]">PKR</span>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="sendEmail"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border-color)] text-fcGarnet focus:ring-fcGarnet"
                    />
                    <label htmlFor="sendEmail" className="text-sm text-[var(--text-muted)] cursor-pointer">
                        Send confirmation email
                    </label>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {fees.map((fee) => {
                    const isPaid = fee.status === 'PAID';
                    const isLoading = loading === fee.month;

                    return (
                        <button
                            key={fee.month}
                            onClick={() => !isPaid && handleMarkAsPaid(fee.month)}
                            disabled={isPaid || isLoading}
                            className={`
                p-4 rounded-xl border-2 transition-all duration-200 text-center
                ${isPaid
                                    ? 'bg-fcGreen/10 border-fcGreen/30 cursor-not-allowed'
                                    : 'bg-fcGarnet/10 border-fcGarnet/30 hover:bg-fcGarnet/20 hover:scale-105 cursor-pointer active:scale-95'
                                }
                ${isLoading ? 'opacity-50 cursor-wait' : ''}
              `}
                        >
                            <div className="text-2xl mb-1">
                                {isPaid ? '✅' : '❌'}
                            </div>
                            <div className="font-semibold text-[var(--text-primary)] text-sm">
                                {monthNames[fee.month - 1]}
                            </div>
                            <div className={`text-xs mt-1 font-medium ${isPaid ? 'text-fcGreen' : 'text-fcGarnet'}`}>
                                {isPaid ? 'PAID' : 'UNPAID'}
                            </div>
                            {isPaid && fee.paidAt && (
                                <div className="text-[10px] text-[var(--text-muted)] mt-1">
                                    {new Date(fee.paidAt).toLocaleDateString()}
                                </div>
                            )}
                            {isLoading && (
                                <div className="text-xs text-[var(--text-muted)] mt-1">
                                    Processing...
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Paid Months:</span>
                    <span className="font-semibold text-fcGreen">
                        {fees.filter(f => f.status === 'PAID').length} / 12
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[var(--text-muted)]">Total Collected:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                        PKR {fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + (f.paidAmount || 0), 0).toLocaleString()}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[var(--text-muted)]">Pending:</span>
                    <span className="font-semibold text-fcGarnet">
                        PKR {((12 - fees.filter(f => f.status === 'PAID').length) * feeAmount).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FeePaymentCalendar;
