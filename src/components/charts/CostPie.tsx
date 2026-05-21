import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatKRW } from "@/lib/formatKRW";

export function CostPie({
  data,
  total,
  minHeight = 160,
}: {
  data: { name: string; value: number; color: string }[];
  total: number;
  minHeight?: number;
}) {
  return (
    <div className="relative h-full w-full" style={{ minHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(v: number, n) => [formatKRW(v), n as string]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs text-muted-foreground">Total</div>
        <div className="text-lg font-semibold">{formatKRW(total)}</div>
      </div>
    </div>
  );
}