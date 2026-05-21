import { Sparkles } from "lucide-react";

export function AskAIButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask AI"
      className="group inline-flex h-[72px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <Sparkles className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
      <span className="text-[11px] font-semibold tracking-wide">Ask AI</span>
    </button>
  );
}