"use client";
import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Wins", value: 28, color: "#00a64e" },
  { name: "Draws", value: 8, color: "#edbb00" },
  { name: "Losses", value: 4, color: "#a50044" },
];

const Performance = () => {
  const totalMatches = data.reduce((sum, item) => sum + item.value, 0);
  const winRate = Math.round((data[0].value / totalMatches) * 100);

  return (
    <div className="glass-card rounded-2xl p-6 h-80 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">Season Performance</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-fcGreen/20 text-fcGreen font-medium">
          {winRate}% Win Rate
        </span>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-4">2024/25 Season Stats</p>

      {/* Chart */}
      <div className="relative w-full h-[60%]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Stats */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-3xl font-heading font-bold text-[var(--text-primary)]">{totalMatches}</p>
          <p className="text-xs text-[var(--text-muted)]">Matches</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
