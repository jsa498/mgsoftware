"use client"

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Raag } from "@/app/courses/cource-raags/raagsData";

interface RaagChartProps {
  data: Raag[];
}

// Map broad time categories to colors
const categoryColors: Record<string, string> = {
  dawn: "hsl(var(--chart-1))",
  morning: "hsl(var(--chart-2))",
  afternoon: "hsl(var(--chart-3))",
  evening: "hsl(var(--chart-4))",
  night: "hsl(var(--chart-5))",
  midnight: "hsl(var(--chart-6))",
  other: "hsl(var(--chart-7))",
};

function getTimeCategory(time: string): string {
  const t = time.toLowerCase();
  if (t.includes("pre-dawn") || t.includes("dawn") || t.includes("3 am") && t.includes("6 am")) return "dawn";
  if (t.includes("6 am") || t.includes("9 am")) return "morning";
  if (t.includes("12 pm") || t.includes("3 pm")) return "afternoon";
  if (t.includes("6 pm")) return "evening";
  if (t.includes("9 pm")) return "night";
  if (t.includes("12 am")) return "midnight";
  return "other";
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: Raag & { timeCategory?: string } = payload[0].payload;
    return (
      <div className="bg-popover text-popover-foreground rounded p-4 shadow-lg">
        <h4 className="font-semibold mb-1">{data.name}</h4>
        <p className="text-sm mb-2">{data.description}</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong>Time:</strong> {data.time}</p>
          <p><strong>Mood:</strong> {data.mood}</p>
          <p><strong>Origin:</strong> {data.origin}</p>
          <p><strong>Notes:</strong> {data.notes}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const RaagPieChart: React.FC<RaagChartProps> = ({ data }) => {
  // assign each slice equal weight
  const chartData = data.map((r) => ({
    name: r.name,
    value: 1,
    time: r.time,
    description: r.description,
    mood: r.mood,
    origin: r.origin,
    notes: r.notes,
    timeCategory: getTimeCategory(r.time),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius="40%"
          outerRadius="80%"
          paddingAngle={2}
        >
          {chartData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={categoryColors[entry.timeCategory] || categoryColors.other}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}; 