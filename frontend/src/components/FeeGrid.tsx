"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";

type FeeRecord = {
    id: string;
    month: number;
    year: number;
    amount: number;
    paidAmount: number;
    status: string;
    dueDate: Date;
    feePlan: {
        name: string;
    };
    payments: any[];
};

type FeeGridProps = {
    playerId: string;
    year: number;
    feeRecords: FeeRecord[];
    onRefresh: () => void;
};

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function FeeGrid({ playerId, year, feeRecords, onRefresh }: FeeGridProps) {
    const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleMonthClick = (record: FeeRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-fcGreen/20 text-fcGreen border-fcGreen/30";
            case "PARTIAL":
                return "bg-fcGold/20 text-fcGold border-fcGold/30";
            case "UNPAID":
                return "bg-fcGarnet/20 text-fcGarnet border-fcGarnet/30";
            case "OVERDUE":
                return "bg-red-500/20 text-red-400 border-red-500/30";
            case "WAIVED":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            default:
                return "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)]";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PAID":
                return "✓";
            case "PARTIAL":
                return "◐";
            case "UNPAID":
                return "✗";
            case "OVERDUE":
                return "⚠";
            case "WAIVED":
                return "—";
            default:
                return "?";
        }
    };

    // Create array of all 12 months with fee records
    const monthsData = MONTHS.map((month, index) => {
        const monthNum = index + 1;
        const record = feeRecords.find(r => r.month === monthNum);
        return { month, monthNum, record };
    });

    return (
        <>
            <div className="space-y-4">
                {/* Year Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-heading font-semibold text-[var(--text-primary)]">
                        Fee Records - {year}
                    </h3>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-fcGreen/20 border border-fcGreen/30"></div>
                            <span className="text-[var(--text-muted)]">Paid</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-fcGold/20 border border-fcGold/30"></div>
                            <span className="text-[var(--text-muted)]">Partial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-fcGarnet/20 border border-fcGarnet/30"></div>
                            <span className="text-[var(--text-muted)]">Unpaid</span>
                        </div>
                    </div>
                </div>

                {/* 12-Month Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {monthsData.map(({ month, monthNum, record }) => {
                        if (!record) {
                            return (
                                <div
                                    key={monthNum}
                                    className="p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg opacity-50"
                                >
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-[var(--text-muted)]">{month}</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">No record</p>
                                    </div>
                                </div>
                            );
                        }

                        const percentage = (record.paidAmount / record.amount) * 100;

                        return (
                            <button
                                key={monthNum}
                                onClick={() => handleMonthClick(record)}
                                className={`p-4 border-2 rounded-lg transition-all hover:scale-105 hover:shadow-lg ${getStatusColor(
                                    record.status
                                )}`}
                            >
                                <div className="text-center space-y-2">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-lg">{getStatusIcon(record.status)}</span>
                                        <p className="text-sm font-semibold">{month}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs opacity-80">
                                            PKR {record.amount.toLocaleString()}
                                        </p>
                                        {record.status === "PARTIAL" && (
                                            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-current transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        )}
                                        {record.paidAmount > 0 && (
                                            <p className="text-xs font-medium">
                                                Paid: {record.paidAmount.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Summary Stats */}
                {feeRecords.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)]">
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Total Due</p>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">
                                PKR {feeRecords.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Total Paid</p>
                            <p className="text-lg font-semibold text-fcGreen">
                                PKR {feeRecords.reduce((sum, r) => sum + r.paidAmount, 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Pending</p>
                            <p className="text-lg font-semibold text-fcGarnet">
                                PKR {feeRecords.reduce((sum, r) => sum + (r.amount - r.paidAmount), 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Paid Months</p>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">
                                {feeRecords.filter(r => r.status === "PAID").length} / {feeRecords.length}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {selectedRecord && (
                <PaymentModal
                    feeRecord={selectedRecord}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedRecord(null);
                    }}
                    onSuccess={onRefresh}
                />
            )}
        </>
    );
}
