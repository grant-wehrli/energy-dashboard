import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AskAIButton({
  onClick,
  attention = false,
  className,
}: {
  onClick: () => void;
  attention?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask AI"
      className={cn(
        "group inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card px-3 text-foreground shadow-md transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/10 hover:text-primary hover:shadow-lg sm:h-[72px] sm:w-[72px] sm:flex-col sm:gap-0.5 sm:rounded-full sm:px-0",
        attention &&
          "border-primary/35 bg-primary/10 text-primary ring-2 ring-primary/45 ring-offset-2 ring-offset-background shadow-[0_0_30px_oklch(0.84_0.16_86/0.34)]",
        className,
      )}
    >
      <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:scale-110 sm:h-6 sm:w-6" />
      <span className="text-[11px] font-semibold tracking-wide sm:text-[11px]">Ask AI</span>
    </button>
  );
}
