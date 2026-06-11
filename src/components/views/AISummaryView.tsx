import { ArrowLeft, ArrowRight, Lightbulb, WashingMachine, Flame, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { CostPie } from "@/components/charts/CostPie";
import {
  aiSummaryByTimeframe,
  analogies,
  costBreakdownByTimeframe,
  usageByTimeframe,
} from "@/data/mockData";
import { useState } from "react";
import { AnalogyModal } from "@/components/modals/AnalogyModal";
import type { Timeframe } from "@/types/energy";
import { formatKRW } from "@/lib/formatKRW";

export function AISummaryView({
  timeframe,
  onBack,
  onGoToTips,
}: {
  timeframe: Timeframe;
  onBack: () => void;
  onGoToTips: () => void;
}) {
  const [showAnalogy, setShowAnalogy] = useState(false);
  const summary = aiSummaryByTimeframe[timeframe];
  const usage = usageByTimeframe[timeframe];
  const costs = costBreakdownByTimeframe[timeframe];
  const total = costs.reduce((s, d) => s + d.value, 0);
  const analogy = analogies[summary.analogyKey];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-3xl bg-canvas p-3 sm:p-5 lg:overflow-hidden">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <article className="flex-none space-y-5 overflow-visible rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <header>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {summary.detailTitle}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{summary.detailSubtitle}</p>
        </header>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Energy use</h3>
          <div className="h-[220px] sm:h-[240px]">
            <UsageBarChart data={usage} fill />
          </div>
        </section>

        <section className="rounded-xl bg-secondary/40 p-4 text-sm leading-relaxed">
          {summary.longSummary}
          <div className="mt-2 text-xs font-medium text-primary">
            Estimated saving {summary.savingLabel}: {formatKRW(summary.estimatedSaving)}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">What drove these spikes?</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {summary.spikeDrivers.map((d) => (
              <div key={d.label} className="rounded-xl border border-border bg-card p-3">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {iconFor(d.icon)}
                </div>
                <div className="text-sm font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.share} of bill</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold">Tips to avoid spikes in the future</h3>
          <ul className="space-y-2 text-sm">
            {summary.tips.map((tip) => (
              <li key={tip} className="rounded-xl border border-border bg-secondary/30 p-3">
                {tip}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setShowAnalogy(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
          >
            <Lightbulb className="h-3.5 w-3.5" /> Everyday analogy
          </button>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold">What is this based on?</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {summary.dataNotes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border p-3">
            <div className="mb-1 text-xs font-medium">Cost split {summary.savingLabel}</div>
            <div className="h-56">
              <CostPie data={costs} total={total} minHeight={0} />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={onGoToTips}>
            Saving Tips <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </article>

      <AnalogyModal
        analogy={showAnalogy ? analogy : null}
        open={showAnalogy}
        onOpenChange={setShowAnalogy}
      />
    </div>
  );
}

function iconFor(key: string) {
  switch (key) {
    case "washer":
      return <WashingMachine className="h-4 w-4" />;
    case "bulb":
      return <Lightbulb className="h-4 w-4" />;
    case "stove":
      return <Flame className="h-4 w-4" />;
    case "car":
      return <Car className="h-4 w-4" />;
    default:
      return <Flame className="h-4 w-4" />;
  }
}
