import { useState } from "react";
import { ArrowLeft, FileSearch, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceModal } from "@/components/modals/SourceModal";
import { recommendationsByTimeframe, timeframeLabels } from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";
import { cn } from "@/lib/utils";
import type { Recommendation, Timeframe } from "@/types/energy";

const AI_TRUST_COPY =
  "AI suggestions are estimates based on available smart meter, rate, and forecast data. Review before changing comfort settings.";

export function RecommendationsView({
  timeframe,
  onBack,
}: {
  timeframe: Timeframe;
  onBack: () => void;
}) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const recommendations = recommendationsByTimeframe[timeframe];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-canvas p-3 pb-28 sm:rounded-3xl sm:p-5 md:pb-5">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <article className="flex-none space-y-4 overflow-visible rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <header className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">
              Recommendations for {timeframeLabels[timeframe].toLowerCase()}
            </h2>
            <p className="text-sm text-muted-foreground">
              Each suggestion links to the evidence, calculation, and source behind it.
            </p>
          </div>
        </header>

        <TrustCallout confidence="medium" />

        <ol className="space-y-4">
          {recommendations.map((r, i) => (
            <li key={r.id} className="rounded-2xl border border-border bg-secondary/30 p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  {i + 1}
                </span>
                <span>Recommendation</span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 uppercase",
                    r.confidence === "low"
                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                      : "border-primary/20 bg-primary/10 text-primary",
                  )}
                >
                  {r.confidence} confidence
                </span>
                {r.estimatedSavings && (
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 text-foreground">
                    {formatKRW(r.estimatedSavings)} est.
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">{r.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedRecommendation(r)}>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Why this?
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedRecommendation(r)}>
                  <FileSearch className="mr-1.5 h-3.5 w-3.5" /> Source
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </article>

      <SourceModal
        open={!!selectedRecommendation}
        onOpenChange={(open) => !open && setSelectedRecommendation(null)}
        recommendation={selectedRecommendation}
        timeframe={timeframe}
      />
    </div>
  );
}

function TrustCallout({ confidence }: { confidence: Recommendation["confidence"] }) {
  const low = confidence === "low";

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-2xl border p-3 text-xs leading-relaxed",
        low
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-secondary/40 text-muted-foreground",
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
