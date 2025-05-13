"use client"

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { Raag } from "@/app/courses/cource-raags/raagsData";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

interface RaagChartProps {
  data: Raag[];
}


// Distinct colours for the eight 3-hour intervals.
// Purely static hex palette.
const sliceColors = [
  "#E63946", // red
  "#F4A261", // orange
  "#2A9D8F", // teal
  "#457B9D", // blue
  "#8E44AD", // purple
  "#E9C46A", // yellow
  "#F72585", // pink
  "#52B788", // green
];

// Map common Gurbani/Indian‑classical time descriptors to a 3‑hour bin index
const keywordMap: Record<string, number> = {
  "pre-dawn": 0,
  "amrit vela": 0,
  "brahm": 0,

  "dawn": 1,
  "early morning": 1,
  "4 am": 1,

  "morning": 2,

  "late morning": 3,
  "forenoon": 3,

  "afternoon": 4,
  "siesta": 4,

  "late afternoon": 5,
  "early evening": 5,

  "evening": 6,
  "sunset": 6,

  "night": 7,
  "midnight": 7,
};

// Utility: convert 12‑hr clock + meridiem to 24‑hr integer
const to24 = (num: number, meridiem: string) => {
  if (meridiem === "pm" && num !== 12) return num + 12;
  if (meridiem === "am" && num === 12) return 0;
  return num;
};

// Return the 0‑7 index a rāg belongs in
function bucketIndex(timeStr: string): number {
  // 1) explicit range that may omit one or both meridiems, e.g. "Evening 6-9 pm"
  const flexible = /(\d{1,2})(?:\s*(am|pm))?[^\d]+(\d{1,2})(?:\s*(am|pm))?/i.exec(timeStr);
  if (flexible) {
    const sNum = +flexible[1];
    const sMer = (flexible[2] || flexible[4] || "").toLowerCase(); // inherit end meridiem if start missing
    const eNum = +flexible[3];
    const eMer = (flexible[4] || flexible[2] || "").toLowerCase(); // inherit start meridiem if end missing

    // If at least one meridiem is present we can resolve a 12‑hour clock; otherwise fall through
    if (sMer || eMer) {
      const start = to24(sNum, sMer || eMer);
      let   end   = to24(eNum, eMer || sMer);
      if (end <= start) end += 24;            // handle wrap‑around
      const mid   = (start + end) / 2;
      return Math.floor((mid % 24) / 3);
    }
  }

  // 2) single anchor clock "at 6 am"
  const single = /(\d{1,2})\s*(am|pm)/i.exec(timeStr);
  if (single) {
    const h = to24(+single[1], single[2].toLowerCase());
    return Math.floor(h / 3);
  }

  // 3) keyword pass
  const lc = timeStr.toLowerCase();
  for (const [kw, idx] of Object.entries(keywordMap)) {
    if (lc.includes(kw)) return idx;
  }

  // 4) hard fallback (9 pm‑12 am)
  return 7;
}

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

    data.forEach((r) => {
      const idx = bucketIndex(r.time);
      bins[idx].raags.push(r);
    });

    return bins.map((b, idx) => ({
      label: b.label,
      value: 1,
      raags: b.raags,
      colour: sliceColors[idx],
    }));
  }, [data]);

  const renderLabels = ({ cx, cy, midAngle, outerRadius, payload }: any) => {
    const RAD = Math.PI / 180;

    // Normalize angle to 0‑360 then flip upside‑down values so text stays upright
    const uprightAngle = (deg: number) => {
      const norm = ((deg % 360) + 360) % 360;
      return norm > 90 && norm < 270 ? deg + 180 : deg;
    };

    // Offset at which we’ll draw the slice’s time label
    const timeOffset = outerRadius + 30;   // more clearance outside the ring

    // Build one <text> element per rāg in this slice
    const raagLabels = (payload.raags as Raag[]).map((r, i) => {
      const lineHeight   = 15;
      const radialOffset = outerRadius * 0.45 + i * lineHeight;

      // --- position: still along the slice radius ---
      const radialCoordDeg = -midAngle;           // convert Recharts CW to SVG CCW
      const x = cx + radialOffset * Math.cos(radialCoordDeg * RAD);
      const y = cy + radialOffset * Math.sin(radialCoordDeg * RAD);

      // --- orientation: tangent to the ring (same as time label) ---
      const tangentDeg   = midAngle + 90;         // CW tangent
      const textRotation = uprightAngle(tangentDeg);

      return (
        <HoverCard key={`${payload.label}-${r.name}`}>
          <HoverCardTrigger asChild>
            <text
              x={x}
              y={y}
              transform={`rotate(${textRotation} ${x} ${y})`}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: 12,
                cursor: "pointer",
                fill: "#fff",
                paintOrder: "stroke",
                stroke: "rgba(0,0,0,0.6)",
                strokeWidth: 2,
              }}
              className="select-none"
            >
              {r.name}
            </text>
          </HoverCardTrigger>

          <HoverCardContent>
            <h4 className="font-semibold mb-1">{r.name}</h4>
            <p className="text-sm mb-2">{r.description}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>Time:</strong> {r.time}
              </p>
              <p>
                <strong>Mood:</strong> {r.mood}
              </p>
              <p>
                <strong>Origin:</strong> {r.origin}
              </p>
              <p>
                <strong>Notes:</strong> {r.notes}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    });

    // ----- time‑range label (tangent to the ring) -----
    // radial angle in degrees (SVG uses clockwise, 0° at 3 o’clock)
    const radialDeg = midAngle;            // raw Recharts angle (clockwise)
    // tangent is radial + 90°
    const tangentDeg = radialDeg + 90;     // tangent = radial + 90°
    const timeAngle  = uprightAngle(tangentDeg);

    const tx = cx + timeOffset * Math.cos(radialDeg * RAD);
    const ty = cy + timeOffset * Math.sin(radialDeg * RAD);

    const timeLabel = (
      <text
        x={tx}
        y={ty}
        transform={`rotate(${timeAngle} ${tx} ${ty})`}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 11, fill: "#000", fontWeight: 600 }}
        className="select-none"
      >
        {payload.label}
      </text>
    );

    // Recharts expects a single React element back
    return <g>{timeLabel}{raagLabels}</g>;
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart>
        <Pie
          data={intervalData}
          dataKey="value"
          nameKey="label"
          startAngle={90}
          endAngle={-270}
          innerRadius="35%"
          outerRadius="85%"
          paddingAngle={0}
          labelLine={false}
          label={renderLabels}
        >
          {intervalData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.colour}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};