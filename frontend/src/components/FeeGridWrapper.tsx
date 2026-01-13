"use client";

import { useState, useEffect } from "react";
import FeeGrid from "./FeeGrid";
import { getPlayerFeeRecords } from "@/lib/fee-actions";

type FeeGridWrapperProps = {
    playerId: string;
    year: number;
};

export default function FeeGridWrapper({ playerId, year }: FeeGridWrapperProps) {
    const [feeRecords, setFeeRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const records = await getPlayerFeeRecords(playerId, year);
            setFeeRecords(records);
        } catch (error) {
            console.error("[FEE_GRID_WRAPPER] Error fetching fees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, [playerId, year]);

    if (loading) {
        return (
            <div className="glass-card rounded-2xl p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-[var(--bg-surface)] rounded w-1/3"></div>
                    <div className="grid grid-cols-6 gap-3">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-24 bg-[var(--bg-surface)] rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-[var(--text-primary)]">
                    💰 Fee Management
                </h2>
            </div>
            <FeeGrid
                playerId={playerId}
                year={year}
                feeRecords={feeRecords}
                onRefresh={fetchFees}
            />
        </div>
    );
}
