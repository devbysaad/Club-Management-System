"use client";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Mon",
    present: 85,
    absent: 15,
  },
  {
    name: "Tue",
    present: 92,
    absent: 8,
  },
  {
    name: "Wed",
    present: 88,
    absent: 12,
  },
  {
    name: "Thu",
    present: 95,
    absent: 5,
  },
  {
    name: "Fri",
    present: 78,
    absent: 22,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-[var(--border-color)]">
        <p className="text-[var(--text-primary)] font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AttendanceChart = () => {
  return (
    <div className="glass-card rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">Training Attendance</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Weekly training session participation</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-fcGreen/20 text-fcGreen font-medium">
            Avg: 88%
          </span>
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
          <div className="w-3 h-3 rounded-full bg-fcGarnet" />
          <span className="text-xs text-[var(--text-muted)]">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-fcBlue" />
          <span className="text-xs text-[var(--text-muted)]">Absent</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="75%">
        <BarChart data={data} barSize={16} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(165, 0, 68, 0.1)' }} />
          <Bar
            dataKey="present"
            name="Present"
            fill="#a50044"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="absent"
            name="Absent"
            fill="#004d98"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
