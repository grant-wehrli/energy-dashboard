import { Sparkles } from "lucide-react";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { CostPie } from "@/components/charts/CostPie";
import { Button } from "@/components/ui/button";
import {
  aiSummaryByTimeframe,
  costBreakdownByTimeframe,
  costStatsByTimeframe,
  timeframeLabels,
  usageByTimeframe,
} from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";
import { cn } from "@/lib/utils";
import type { Timeframe } from "@/types/energy";

interface DashboardViewProps {
  timeframe: Timeframe;
  onExplainChart: () => void;
  onExplainCost: () => void;
}

export function DashboardView({ timeframe, onExplainChart, onExplainCost }: DashboardViewProps) {
  const data = usageByTimeframe[timeframe];
  const totalKwh = data.reduce((s, d) => s + d.kwh, 0);
  const costBreakdown = costBreakdownByTimeframe[timeframe];
  const totalCost = costBreakdown.reduce((s, d) => s + d.value, 0);
  const costStats = costStatsByTimeframe[timeframe];
  const summary = aiSummaryByTimeframe[timeframe];
  const largestCost = costBreakdown.reduce((largest, item) =>
    item.value > largest.value ? item : largest,
  );

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-canvas px-4 pb-28 pt-4 sm:rounded-3xl sm:px-6 sm:pt-6 md:pb-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <section className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {timeframeLabels[timeframe]} at a glance
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {summary.shortSummary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:min-w-[540px]">
              <Stat label="Used" value={`${totalKwh.toFixed(1)} kWh`} tone="neutral" />
              <Stat label="Cost" value={formatKRW(costStats.estimated)} tone="neutral" />
              <Stat label="Saved" value={formatKRW(costStats.savedThisMonth)} tone="good" />
              <Stat label="Potential" value={formatKRW(costStats.potentialSavings)} tone="accent" />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Usage pattern</h3>
              <p className="text-xs text-muted-foreground">
                The spike is visible first so the recommendation has context.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={onExplainChart}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Explain
            </Button>
          </div>
          <div className="h-[280px] w-full rounded-[2rem] bg-card/70 p-3 shadow-sm ring-1 ring-border/60 sm:h-[340px] sm:p-4">
            <UsageBarChart data={data} fill />
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Cost breakdown</h3>
              <p className="text-xs text-muted-foreground">
                Largest: {largestCost.name} at {formatKRW(largestCost.value)}.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={onExplainCost}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Explain
            </Button>
          </div>
          <div className="grid gap-4 rounded-[2rem] bg-card/70 p-4 shadow-sm ring-1 ring-border/60 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="h-[260px] min-h-0">
              <CostPie data={costBreakdown} total={totalCost} />
            </div>
            <ul className="space-y-2 text-sm">
              {costBreakdown.map((item) => (
                <li key={item.name} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="flex-1 text-muted-foreground">{item.name}</span>
                  <span className="font-medium">{formatKRW(item.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "accent" | "neutral";
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-0.5 text-lg font-semibold leading-none sm:text-xl",
          tone === "good" ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}
