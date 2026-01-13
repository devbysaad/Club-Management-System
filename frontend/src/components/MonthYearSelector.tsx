"use client";

import { useRouter, useSearchParams } from "next/navigation";

type MonthYearSelectorProps = {
    selectedMonth: number;
    selectedYear: number;
};

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function MonthYearSelector({ selectedMonth, selectedYear }: MonthYearSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleMonthChange = (month: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        router.push(`/admin/fees/collect?${params.toString()}`);
    };

    const handleYearChange = (year: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("year", year);
        router.push(`/admin/fees/collect?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--text-muted)]">Month:</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                >
                    {monthNames.map((month, index) => (
                        <option key={index} value={index + 1}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--text-muted)]">Year:</label>
                <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)]"
                >
                    {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
