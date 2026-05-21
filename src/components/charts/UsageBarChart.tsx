import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { UsageDataPoint } from "@/types/energy";

export type BarPoint = UsageDataPoint;

export function UsageBarChart({
  data,
  highlightRange,
  compact,
  fill,
}: {
  data: BarPoint[];
  highlightRange?: [number, number];
  compact?: boolean;
  fill?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={fill ? "100%" : compact ? 130 : 240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          interval={compact ? 3 : "preserveStartEnd"}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          width={36}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v} kWh`, "Usage"]}
        />
        <Bar dataKey="kwh" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => {
            const highlighted =
              highlightRange &&
              d.hour !== undefined &&
              d.hour >= highlightRange[0] &&
              d.hour <= highlightRange[1];
            return (
              <Cell
                key={i}
                fill={highlighted ? "var(--highlight)" : "var(--primary)"}
                fillOpacity={highlighted ? 1 : 0.85}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}