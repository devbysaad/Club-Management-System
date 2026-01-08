"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const data = [
    {
      name: "Total",
      count: girls + boys,
      fill: "var(--bg-surface-light)",
    },
    {
      name: "Girls",
      count: girls,
      fill: "#004d98",
    },
    {
      name: "Boys",
      count: boys,
      fill: "#a50044",
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
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
  );
};

export default CountChart;
