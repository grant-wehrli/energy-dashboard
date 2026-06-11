import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  FileSearch,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { DashboardCard } from "@/components/cards/DashboardCard";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { CostPie } from "@/components/charts/CostPie";
import { Button } from "@/components/ui/button";
import { SourceModal } from "@/components/modals/SourceModal";
import {
  aiSummaryByTimeframe,
  costBreakdownByTimeframe,
  costStatsByTimeframe,
  proactiveActionsByTimeframe,
  recommendationsByTimeframe,
  timeframeLabels,
  usageByTimeframe,
} from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";
import { cn } from "@/lib/utils";
import type { ProactiveAction, Recommendation, Timeframe } from "@/types/energy";

const AI_TRUST_COPY =
  "AI suggestions are estimates based on available smart meter, rate, and forecast data. Review before changing comfort settings.";

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
  const [sourceRecommendation, setSourceRecommendation] = useState<Recommendation | null>(null);
  const data = usageByTimeframe[timeframe];
  const totalKwh = data.reduce((s, d) => s + d.kwh, 0);
  const costBreakdown = costBreakdownByTimeframe[timeframe];
  const totalCost = costBreakdown.reduce((s, d) => s + d.value, 0);
  const costStats = costStatsByTimeframe[timeframe];
  const recommendations = recommendationsByTimeframe[timeframe];
  const proactiveActions = proactiveActionsByTimeframe[timeframe];
  const primaryRecommendation = recommendations[0];
  const summary = aiSummaryByTimeframe[timeframe];

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-canvas p-3 pb-28 sm:rounded-3xl sm:p-4 md:pb-4">
      <div className="space-y-4">
        <section className="overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Smart home overview
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {timeframeLabels[timeframe]} at a glance
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {summary.shortSummary}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Stat label="Used" value={`${totalKwh.toFixed(1)} kWh`} tone="neutral" />
                <Stat
                  label="Estimated cost"
                  value={formatKRW(costStats.estimated)}
                  tone="neutral"
                />
                <Stat label="Saved" value={formatKRW(costStats.savedThisMonth)} tone="good" />
                <Stat
                  label="Potential"
                  value={formatKRW(costStats.potentialSavings)}
                  tone="accent"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between rounded-3xl border border-primary/20 bg-primary/10 p-4 text-primary shadow-inner lg:w-80">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Primary spike insight</h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/75">
                  {primaryRecommendation.body}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setSourceRecommendation(primaryRecommendation)}>
                  Why this? <FileSearch className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="secondary" onClick={onOpenSummary}>
                  AI summary <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Proactive actions</h3>
              <p className="text-xs text-muted-foreground">
                Demo notifications shown as persistent cards.
              </p>
            </div>
            <BellRing className="h-5 w-5 text-primary" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {proactiveActions.map((action) => (
              <ProactiveCard
                key={action.id}
                action={action}
                onInspect={() => {
                  const related =
                    recommendations.find((r) => r.id === action.relatedRecommendationId) ??
                    primaryRecommendation;
                  setSourceRecommendation(related);
                }}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Primary recommendation
                </span>
                {primaryRecommendation.estimatedSavings && (
                  <span className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground">
                    Save about {formatKRW(primaryRecommendation.estimatedSavings)}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {primaryRecommendation.title}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75">
                {primaryRecommendation.body}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSourceRecommendation(primaryRecommendation)}
              >
                <FileSearch className="mr-1.5 h-3.5 w-3.5" /> Source
              </Button>
              <Button size="sm" onClick={onOpenRecommendations}>
                See all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <TrustCallout confidence={primaryRecommendation.confidence} className="mt-4" />
        </section>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <DashboardCard
            title="Supporting usage chart"
            subtitle={`${timeframeLabels[timeframe]} · kWh evidence`}
            action={
              <Button variant="secondary" size="sm" onClick={onExplainChart}>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Explain
              </Button>
            }
          >
            <div className="h-[210px] w-full lg:h-[250px]">
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium">{r.title}</div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                      {r.confidence}
                    </span>
                  </div>
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

      <SourceModal
        open={!!sourceRecommendation}
        onOpenChange={(open) => !open && setSourceRecommendation(null)}
        recommendation={sourceRecommendation}
        timeframe={timeframe}
      />
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
    <div className="min-w-0 rounded-2xl border border-border bg-secondary/40 px-3 py-2 shadow-sm">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-sm font-semibold",
          tone === "good" ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function ProactiveCard({ action, onInspect }: { action: ProactiveAction; onInspect: () => void }) {
  const Icon =
    action.tone === "forecast" ? CalendarClock : action.tone === "comfort" ? ShieldCheck : Zap;

  return (
    <article className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
              action.tone === "forecast"
                ? "bg-accent/15 text-accent-foreground"
                : action.tone === "comfort"
                  ? "bg-secondary text-foreground"
                  : "bg-primary/10 text-primary",
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-secondary/60 px-2.5 py-1 text-[10px] font-medium uppercase text-muted-foreground">
            Action
          </span>
        </div>
        <h4 className="font-semibold tracking-tight">{action.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{action.body}</p>
      </div>
      <button
        type="button"
        onClick={onInspect}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline"
      >
        {action.actionLabel} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}

function TrustCallout({
  confidence,
  className,
}: {
  confidence: Recommendation["confidence"];
  className?: string;
}) {
  const low = confidence === "low";

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border p-3 text-xs leading-relaxed",
        low
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-secondary/40 text-muted-foreground",
        className,
      )}
    >
      {low ? (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <p>{AI_TRUST_COPY}</p>
    </div>
  );
}
