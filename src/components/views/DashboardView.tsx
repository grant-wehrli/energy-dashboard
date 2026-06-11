import { DashboardCard } from "@/components/cards/DashboardCard";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { CostPie } from "@/components/charts/CostPie";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  aiSummaryByTimeframe,
  costBreakdownByTimeframe,
  costStatsByTimeframe,
  recommendationsByTimeframe,
  timeframeLabels,
  usageByTimeframe,
} from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";
import type { Timeframe } from "@/types/energy";

interface DashboardViewProps {
  timeframe: Timeframe;
  onOpenSummary: () => void;
  onOpenRecommendations: () => void;
  onExplainChart: () => void;
  onExplainCost: () => void;
}

export function DashboardView({
  timeframe,
  onOpenSummary,
  onOpenRecommendations,
  onExplainChart,
  onExplainCost,
}: DashboardViewProps) {
  const data = usageByTimeframe[timeframe];
  const totalKwh = data.reduce((s, d) => s + d.kwh, 0);
  const costBreakdown = costBreakdownByTimeframe[timeframe];
  const totalCost = costBreakdown.reduce((s, d) => s + d.value, 0);
  const costStats = costStatsByTimeframe[timeframe];
  const recommendations = recommendationsByTimeframe[timeframe];
  const summary = aiSummaryByTimeframe[timeframe];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-3xl bg-canvas p-3 sm:p-4 lg:overflow-hidden">
      <div className="mb-3 flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">
            {timeframeLabels[timeframe]} at a glance
          </h2>
          <p className="text-xs text-muted-foreground">
            {totalKwh.toFixed(1)} kWh used · estimated {formatKRW(costStats.estimated)}{" "}
            {summary.savingLabel}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs sm:flex">
          <Stat label="Saved this month" value={formatKRW(costStats.savedThisMonth)} tone="good" />
          <Stat
            label="Potential savings"
            value={formatKRW(costStats.potentialSavings)}
            tone="accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:grid-rows-2">
        <DashboardCard
          title="Energy usage"
          subtitle={`${timeframeLabels[timeframe]} · kWh`}
          action={
            <Button variant="secondary" size="sm" onClick={onExplainChart}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Explain
            </Button>
          }
        >
          <div className="h-[210px] w-full lg:h-full">
            <UsageBarChart data={data} fill />
          </div>
        </DashboardCard>

        <DashboardCard
          title="Recommendations"
          subtitle="Personalized for your home"
          action={
            <Button variant="secondary" size="sm" onClick={onOpenRecommendations}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Explain
            </Button>
          }
        >
          <ul className="flex h-full flex-col gap-2 overflow-y-auto pr-1 text-sm">
            {recommendations.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-secondary/30 p-2.5">
                <div className="text-sm font-medium">{r.title}</div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.body}</p>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard
          title="Cost breakdown"
          subtitle={`${timeframeLabels[timeframe]} by category`}
          action={
            <Button variant="secondary" size="sm" onClick={onExplainCost}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Explain
            </Button>
          }
        >
          <div className="flex h-full flex-col items-center gap-3 sm:flex-row">
            <div className="h-48 w-full sm:h-full sm:flex-1">
              <CostPie data={costBreakdown} total={totalCost} />
            </div>
            <ul className="grid w-full grid-cols-1 gap-1 text-xs sm:block sm:flex-1 sm:space-y-1">
              {costBreakdown.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                  <span className="flex-1 text-muted-foreground">{c.name}</span>
                  <span className="font-medium">{formatKRW(c.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </DashboardCard>

        <DashboardCard
          title="AI Summary"
          subtitle="What's driving your bill"
          action={
            <Button size="sm" onClick={onOpenSummary}>
              See more <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          }
        >
          <p className="h-full overflow-y-auto pr-1 text-sm leading-relaxed text-foreground/80">
            {summary.shortSummary}
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "good" | "accent" }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card px-3 py-1.5 shadow-sm">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={
          tone === "good"
            ? "text-sm font-semibold text-primary"
            : "text-sm font-semibold text-foreground"
        }
      >
        {value}
      </div>
    </div>
  );
}
