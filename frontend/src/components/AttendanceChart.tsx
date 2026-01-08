"use client";
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-xs text-[var(--text-muted)] flex items-center gap-2"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AttendanceChart = ({
  data,
}: {
  data: { name: string; present: number; absent: number }[];
}) => {
  // Debug: Log the data to see what we're receiving
  console.log("📈 Chart received data:", data);

  return (
    <ResponsiveContainer width="100%" height="75%">
      <BarChart data={data} barSize={16} barGap={4}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border-color)"
        />
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
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(165, 0, 68, 0.1)" }} />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
          iconType="circle"
          formatter={(value) => (
            <span className="text-xs text-[var(--text-muted)]">{value}</span>
          )}
        />
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
  );
};

export default AttendanceChart;