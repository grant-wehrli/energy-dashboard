import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OnboardingCoachmark({
  open,
  onAskAI,
  onDismiss,
}: {
  open: boolean;
  onAskAI: () => void;
  onDismiss: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-[6.25rem] z-50 rounded-2xl border border-white/70 bg-card/85 p-4 text-card-foreground shadow-[0_18px_50px_oklch(0_0_0/0.16)] backdrop-blur-xl md:inset-x-auto md:bottom-auto md:right-6 md:top-[6.25rem] md:w-[min(calc(100vw-1.5rem),20rem)]">
      <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-white/70 bg-card/85 backdrop-blur-xl md:-top-2 md:bottom-auto md:left-auto md:right-12 md:translate-x-0 md:border-b-0 md:border-l md:border-r-0 md:border-t" />
      <button
        type="button"
        aria-label="Dismiss onboarding"
        onClick={onDismiss}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3 pr-7">
        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">Ask AI can explain this</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Tap the Ask AI button for a plain-language walkthrough of spikes, cost changes, and
            savings ideas.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Later
        </Button>
        <Button size="sm" onClick={onAskAI}>
          Ask now
        </Button>
      </div>
    </div>
  );
}
