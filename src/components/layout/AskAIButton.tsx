import { Sparkles } from "lucide-react";

export function AskAIButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask AI"
      className="group inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-3 text-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:h-[72px] sm:w-[72px] sm:flex-col sm:gap-0.5 sm:rounded-full sm:px-0"
    >
      <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:scale-110 sm:h-6 sm:w-6" />
      <span className="text-[11px] font-semibold tracking-wide sm:text-[11px]">Ask AI</span>
    </button>
  );
}
