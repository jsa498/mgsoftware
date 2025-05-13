"use client"

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Raag } from "@/app/courses/cource-raags/raagsData";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

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
  // group into eight 3-hour bins
  const intervalLabels = [
    "12 am-3 am",
    "3 am-6 am",
    "6 am-9 am",
    "9 am-12 pm",
    "12 pm-3 pm",
    "3 pm-6 pm",
    "6 pm-9 pm",
    "9 pm-12 am",
  ];

  const intervalData = useMemo(() => {
    const bins = intervalLabels.map((label) => ({ label, raags: [] as Raag[] }));
    const parseTimeRange = (time: string): [number, number] | null => {
      const match = time.match(/(\d{1,2}\s*(?:am|pm))\s*-\s*(\d{1,2}\s*(?:am|pm))/i);
      if (!match) return null;
      const parseHour = (str: string) => {
        const m = str.match(/(\d{1,2})\s*(am|pm)/i);
        let h = m ? parseInt(m[1], 10) : 0;
        const suffix = m ? m[2].toLowerCase() : "am";
        if (suffix === "pm" && h !== 12) h += 12;
        if (suffix === "am" && h === 12) h = 0;
        return h;
      };
      let start = parseHour(match[1]);
      let end = parseHour(match[2]);
      if (end <= start) end += 24;
      return [start, end];
    };

    data.forEach((r) => {
      const range = parseTimeRange(r.time);
      const midHour = range ? ((range[0] + range[1]) / 2) % 24 : 22;
      const idx = Math.floor(midHour / 3);
      bins[idx].raags.push(r);
    });

    return bins.map((b) => ({ label: b.label, value: b.raags.length, raags: b.raags }));
  }, [data]);

  const renderLabels = ({ cx, cy, midAngle, outerRadius, payload }: any) => {
    return (payload.raags as Raag[]).map((r, i) => {
      const RAD = Math.PI / 180;
      const offset = outerRadius + 20 + i * 16;
      const x = cx + offset * Math.cos(-midAngle * RAD);
      const y = cy + offset * Math.sin(-midAngle * RAD);
      return (
        <HoverCard key={`label-${payload.label}-${r.name}`}>
          <HoverCardTrigger asChild>
            <text
              x={x}
              y={y}
              fill="#000"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 12, cursor: "pointer" }}
              transform={`rotate(${-midAngle} ${x},${y})`}
            >
              {r.name}
            </text>
          </HoverCardTrigger>
          <HoverCardContent>
            <h4 className="font-semibold mb-1">{r.name}</h4>
            <p className="text-sm mb-2">{r.description}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Time:</strong> {r.time}</p>
              <p><strong>Mood:</strong> {r.mood}</p>
              <p><strong>Origin:</strong> {r.origin}</p>
              <p><strong>Notes:</strong> {r.notes}</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    });
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={intervalData}
          dataKey="value"
          nameKey="label"
          startAngle={90}
          endAngle={-270}
          innerRadius="40%"
          outerRadius="80%"
          isAnimationActive={false}
          paddingAngle={0}
          labelLine={false}
          label={renderLabels}
        >
          {intervalData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={categoryColors[getTimeCategory(entry.label)] || categoryColors.other}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}; 