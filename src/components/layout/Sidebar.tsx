import { Settings, Gauge, LineChart, Lightbulb, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/data/mockData";

export type NavKey = "usage" | "forecast" | "tips" | "goals";

const items: { key: NavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "usage", label: "Current Energy Usage", icon: Gauge },
  { key: "forecast", label: "Forecast preview", icon: LineChart },
  { key: "tips", label: "Saving Tips", icon: Lightbulb },
  { key: "goals", label: "Goals & Milestones", icon: Target },
];

export function Sidebar({
  active,
  onChange,
  onHome,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  onHome?: () => void;
}) {
  return (
    <aside className="flex h-dvh w-64 shrink-0 flex-col gap-6 overflow-hidden border-r border-border bg-sidebar p-4">
      <button
        type="button"
        aria-label="Open settings"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
      >
        <Settings className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onHome}
        aria-label="Go to dashboard"
        className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-3 py-4 text-left transition-colors hover:bg-secondary"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Zap className="h-6 w-6" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">{brand.appName}</div>
          <div className="text-xs text-muted-foreground">{brand.groupTag}</div>
        </div>
      </button>

      <nav className="flex flex-col gap-1" aria-label="Main">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:bg-muted",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}