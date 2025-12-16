"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 128,
    fill: "var(--bg-surface-light)",
  },
  {
    name: "Academy",
    count: 48,
    fill: "#004d98",
  },
  {
    name: "First Team",
    count: 80,
    fill: "#a50044",
  },
];

const CountChart = () => {
  return (
    <div className="glass-card rounded-2xl w-full h-full p-6">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-heading font-bold text-[var(--text-primary)]">Squad Overview</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Player distribution by team</p>
        </div>
        <button className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-light)] transition-colors">
          <svg className="w-5 h-5 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {/* CHART */}
      <div className="relative w-full h-[60%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={28}
            data={data}
          >
            <RadialBar background dataKey="count" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
          <span className="text-3xl">⚽</span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-8 mt-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fcGarnet rounded-full shadow-glow-garnet" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">80</span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">First Team</span>
          <span className="text-[10px] text-fcGarnet">(62%)</span>
        </div>
        <div className="w-[1px] h-12 bg-[var(--border-color)]" />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fcBlue rounded-full shadow-glow-blue" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">48</span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Academy</span>
          <span className="text-[10px] text-fcBlue">(38%)</span>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
