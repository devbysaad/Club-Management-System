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

const data = [
  { name: "Jul", income: 4200, expense: 2400 },
  { name: "Aug", income: 5100, expense: 2800 },
  { name: "Sep", income: 4800, expense: 3200 },
  { name: "Oct", income: 5500, expense: 2900 },
  { name: "Nov", income: 4900, expense: 3100 },
  { name: "Dec", income: 6200, expense: 3500 },
  { name: "Jan", income: 5800, expense: 3000 },
  { name: "Feb", income: 5200, expense: 2700 },
  { name: "Mar", income: 6500, expense: 3800 },
  { name: "Apr", income: 5900, expense: 3200 },
  { name: "May", income: 6800, expense: 3600 },
  { name: "Jun", income: 7200, expense: 4000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-4 border border-[var(--border-color)] min-w-[150px]">
        <p className="text-[var(--text-primary)] font-heading font-semibold mb-3">{label} 2024</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 mb-1">
            <span className="text-xs text-[var(--text-muted)]">{entry.name}:</span>
            <span className="text-sm font-semibold" style={{ color: entry.color }}>
              €{entry.value.toLocaleString()}K
            </span>
          </div>
        ))}
        <div className="mt-3 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Net:</span>
            <span className="text-sm font-semibold text-fcGreen">
              €{((payload[0]?.value || 0) - (payload[1]?.value || 0)).toLocaleString()}K
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FinanceChart = () => {
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
              <p className="text-lg font-heading font-bold text-fcGold">€68.1M</p>
            </div>
            <div className="w-[1px] h-10 bg-[var(--border-color)]" />
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Total Expenses</p>
              <p className="text-lg font-heading font-bold text-fcGarnet">€38.2M</p>
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
            tickFormatter={(value) => `€${value / 1000}K`}
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
    </div>
  );
};

export default FinanceChart;
