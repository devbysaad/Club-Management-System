"use client";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";
import { getMonthlyRevenue } from "@/lib/revenue-actions";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-4 border border-[var(--border-color)] min-w-[150px]">
        <p className="text-[var(--text-primary)] font-heading font-semibold mb-3">{label} 2026</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs text-[var(--text-muted)]">{entry.name}:</span>
            <span className="text-sm font-semibold" style={{ color: entry.color }}>
              PKR {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Net:</span>
            <span className="text-sm font-semibold text-fcGreen">
              PKR {((payload[0]?.value || 0) - (payload[1]?.value || 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FinanceChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ revenue: 0, expenses: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const revenueData = await getMonthlyRevenue();
        setData(revenueData);

        // Calculate totals
        const revenue = revenueData.reduce((sum: number, item: any) => sum + item.income, 0);
        const expenses = revenueData.reduce((sum: number, item: any) => sum + item.expense, 0);
        setTotals({ revenue, expenses });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">Club Finances</h1>
            <p className="text-xs text-[var(--text-muted)] mt-1">Loading revenue data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">Club Finances</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Revenue & expenses overview</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Stats Cards */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Total Revenue</p>
              <p className="text-lg font-heading font-bold text-fcGold">
                PKR {(totals.revenue / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="w-[1px] h-10 bg-[var(--border-color)]" />
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Total Expenses</p>
              <p className="text-lg font-heading font-bold text-fcGarnet">
                PKR {(totals.expenses / 1000).toFixed(1)}K
              </p>
            </div>
          </div>

          <button className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] transition-colors">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-fcGold" />
          <span className="text-xs text-[var(--text-muted)]">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-fcGarnet" />
          <span className="text-xs text-[var(--text-muted)]">Expenses</span>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-[var(--text-muted)] mb-2">No revenue data available</p>
            <p className="text-xs text-[var(--text-muted)]">Start generating fee records to see data</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#edbb00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#edbb00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a50044" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a50044" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Revenue"
              stroke="#edbb00"
              strokeWidth={3}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expenses"
              stroke="#a50044"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FinanceChart;
