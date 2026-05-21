import { ArrowLeft, FileSearch, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { recommendationsByTimeframe, timeframeLabels } from "@/data/mockData";
import { SourceModal } from "@/components/modals/SourceModal";
import type { Timeframe } from "@/types/energy";

export function RecommendationsView({
  timeframe,
  onBack,
}: {
  timeframe: Timeframe;
  onBack: () => void;
}) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const recommendations = recommendationsByTimeframe[timeframe];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-canvas p-5">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <article className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-sm">
        <header className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Recommendations for {timeframeLabels[timeframe].toLowerCase()}
            </h2>
            <p className="text-sm text-muted-foreground">Each suggestion links to the data and source behind it.</p>
          </div>
        </header>

        <ol className="space-y-4">
          {recommendations.map((r, i) => (
            <li key={r.id} className="rounded-2xl border border-border bg-secondary/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                  {i + 1}
                </span>
                Recommendation
              </div>
              <h3 className="text-base font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">{r.body}</p>
              <div className="mt-3">
                <Button variant="secondary" size="sm" onClick={() => setSourceOpen(true)}>
                  <FileSearch className="mr-1.5 h-3.5 w-3.5" /> Source
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </article>

      <SourceModal open={sourceOpen} onOpenChange={setSourceOpen} />
    </div>
  );
}