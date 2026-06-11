import { useState } from "react";
import { ArrowLeft, FileSearch, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourceModal } from "@/components/modals/SourceModal";
import { recommendationsByTimeframe, timeframeLabels } from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";
import type { Recommendation, Timeframe } from "@/types/energy";

const AI_TRUST_COPY =
  "AI suggestions are estimates based on available smart meter, rate, and forecast data. Review before changing comfort settings.";

export function RecommendationsView({
  timeframe,
  onSnapshot,
}: {
  timeframe: Timeframe;
  onSnapshot?: () => void;
}) {
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const recommendations = recommendationsByTimeframe[timeframe];

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-canvas px-4 pb-28 pt-4 sm:px-6 sm:pt-6 md:pb-6">
      {onSnapshot && (
        <button
          type="button"
          onClick={onSnapshot}
          className="mb-4 inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> Snapshot
        </button>
      )}

      <div className="mx-auto max-w-5xl space-y-8">
        <header className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Recommendations for {timeframeLabels[timeframe].toLowerCase()}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground md:hidden">
            Swipe right to return to Snapshot.
          </p>
        </header>

        <ol className="divide-y divide-border/70">
          {recommendations.map((r, i) => (
            <li key={r.id} className="grid gap-4 py-7 lg:grid-cols-[10rem_1fr_auto] lg:items-start">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:block lg:space-y-2">
                <span className="text-2xl font-semibold leading-none text-primary sm:text-3xl lg:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {r.estimatedSavings && (
                  <span className="text-base font-semibold text-foreground lg:block">
                    {formatKRW(r.estimatedSavings)}
                  </span>
                )}
                <span
                  className={
                    r.confidence === "low"
                      ? "text-xs font-medium uppercase tracking-wide text-destructive lg:block"
                      : "text-xs font-medium uppercase tracking-wide text-muted-foreground lg:block"
                  }
                >
                  {r.confidence}
                </span>
              </div>

              <div className="min-w-0">
                <h3 className="text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {r.body}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
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

        <TrustCallout confidence="medium" />
      </div>

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
      className={`flex max-w-3xl items-start gap-2 text-xs leading-relaxed ${low ? "text-destructive" : "text-muted-foreground"}`}
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
