import { Settings, Gauge, ListChecks, Target, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/data/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

export type NavKey = "usage" | "recommendations" | "goals";
export type AccentColor = "yellow" | "blue" | "green" | "rose";

const items: { key: NavKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "usage", label: "Snapshot", icon: Gauge },
  { key: "recommendations", label: "Recommendations", icon: ListChecks },
  { key: "goals", label: "Goals & Milestones", icon: Target },
];

export function Sidebar({
  active,
  onChange,
  onHome,
  onAskAI,
  askAIAttention = false,
  onboardingEnabled,
  onOnboardingChange,
  darkMode,
  onDarkModeChange,
  accentColor,
  onAccentColorChange,
  showRecommendationHint,
  onSettingsOpen,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
  onHome?: () => void;
  onAskAI: () => void;
  askAIAttention?: boolean;
  onboardingEnabled: boolean;
  onOnboardingChange: (enabled: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  accentColor: AccentColor;
  onAccentColorChange: (color: AccentColor) => void;
  showRecommendationHint: boolean;
  onSettingsOpen?: () => void;
}) {
  const mobileActiveIndex = active === "recommendations" ? 1 : active === "goals" ? 3 : 0;

  return (
    <>
      <aside className="hidden h-dvh w-64 shrink-0 flex-col gap-6 overflow-hidden border-r border-border bg-sidebar p-4 md:flex">
        <Popover onOpenChange={(open) => open && onSettingsOpen?.()}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Open settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <SettingsPopover
            onboardingEnabled={onboardingEnabled}
            onOnboardingChange={onOnboardingChange}
            darkMode={darkMode}
            onDarkModeChange={onDarkModeChange}
            accentColor={accentColor}
            onAccentColorChange={onAccentColorChange}
          />
        </Popover>

        <button
          type="button"
          onClick={onHome}
          aria-label="Go to snapshot"
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
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

      <nav
        className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden"
        aria-label="Main"
      >
        {active === "usage" && showRecommendationHint && !askAIAttention && (
          <button
            type="button"
            onClick={() => onChange("recommendations")}
            className="absolute bottom-[calc(env(safe-area-inset-bottom)+4.7rem)] left-1/2 z-10 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-[0_12px_34px_oklch(0_0_0/0.18)] duration-300 hover:-translate-x-1/2 hover:-translate-y-0.5"
          >
            Swipe for recs -&gt;
          </button>
        )}
        <div className="liquid-glass-pill relative mx-auto grid max-w-sm grid-cols-5 gap-1 rounded-full p-1.5">
          <span
            aria-hidden="true"
            className="mobile-nav-selection absolute bottom-1.5 top-1.5 z-0 rounded-full"
            style={{
              left: `calc(0.375rem + ${mobileActiveIndex} * ((100% - 0.75rem) / 5))`,
              width: "calc((100% - 0.75rem) / 5)",
            }}
          />
          {mobileItems.map((it) => {
            const Icon = it.icon;
            const isActive = active === it.key;
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onChange(it.key)}
                className={cn(
                  "flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-medium transition-all",
                  isActive ? "text-primary-foreground" : "text-foreground/70 hover:bg-secondary",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate">{mobileLabel(it.key)}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onAskAI}
            aria-label="Ask AI"
            className={cn(
              "-my-1 flex min-h-[58px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-semibold text-foreground transition-all hover:bg-secondary",
              askAIAttention &&
                "accent-attention-glow bg-primary/10 text-primary ring-2 ring-primary/45 ring-offset-2 ring-offset-canvas",
            )}
          >
            <Sparkles className="h-5 w-5 shrink-0 text-primary" />
            <span className="max-w-full truncate">Ask AI</span>
          </button>
          <button
            type="button"
            onClick={() => onChange("goals")}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-medium transition-all",
              active === "goals"
                ? "text-primary-foreground"
                : "text-foreground/70 hover:bg-secondary",
            )}
            aria-current={active === "goals" ? "page" : undefined}
          >
            <Target className="h-4 w-4 shrink-0" />
            <span className="max-w-full truncate">Goals</span>
          </button>
          <Popover onOpenChange={(open) => open && onSettingsOpen?.()}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Open settings"
                className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[10px] font-medium text-foreground/70 transition-colors hover:bg-secondary"
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate">Settings</span>
              </button>
            </PopoverTrigger>
            <SettingsPopover
              onboardingEnabled={onboardingEnabled}
              onOnboardingChange={onOnboardingChange}
              darkMode={darkMode}
              onDarkModeChange={onDarkModeChange}
              accentColor={accentColor}
              onAccentColorChange={onAccentColorChange}
            />
          </Popover>
        </div>
      </nav>
    </>
  );
}

const mobileItems: {
  key: NavKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "usage", label: "Snapshot", icon: Gauge },
  { key: "recommendations", label: "Recs", icon: ListChecks },
];

function mobileLabel(key: NavKey) {
  switch (key) {
    case "usage":
      return "Snapshot";
    case "recommendations":
      return "Recs";
    case "goals":
      return "Goals";
  }
}

function SettingsPopover({
  onboardingEnabled,
  onOnboardingChange,
  darkMode,
  onDarkModeChange,
  accentColor,
  onAccentColorChange,
}: {
  onboardingEnabled: boolean;
  onOnboardingChange: (enabled: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  accentColor: AccentColor;
  onAccentColorChange: (color: AccentColor) => void;
}) {
  return (
    <PopoverContent
      align="end"
      sideOffset={12}
      className="w-72 rounded-2xl border-white/70 bg-card/90 p-4 shadow-[0_18px_50px_oklch(0_0_0/0.16)] backdrop-blur-xl"
    >
      <div>
        <h2 className="text-sm font-semibold tracking-tight">Demo settings</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Controls used to tune the walkthrough during presentations.
        </p>
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-3">
        <span className="min-w-0">
          <span className="block text-sm font-medium">Ask AI onboarding</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Shows the coachmark on each demo load.
          </span>
        </span>
        <Switch checked={onboardingEnabled} onCheckedChange={onOnboardingChange} />
      </label>

      <label className="mt-2 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-3">
        <span className="min-w-0">
          <span className="block text-sm font-medium">Dark mode</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Switches the dashboard theme.
          </span>
        </span>
        <Switch checked={darkMode} onCheckedChange={onDarkModeChange} />
      </label>

      <div className="mt-4">
        <div className="text-sm font-medium">Accent color</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {accentOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onAccentColorChange(option.value)}
              aria-label={`Use ${option.label} accent`}
              className={cn(
                "flex h-12 items-center justify-center rounded-xl border text-xs font-medium transition-all",
                accentColor === option.value
                  ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/40"
                  : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary",
              )}
            >
              <span
                className="h-5 w-5 rounded-full shadow-sm"
                style={{ background: option.color }}
              />
            </button>
          ))}
        </div>
      </div>
    </PopoverContent>
  );
}

const accentOptions: { value: AccentColor; label: string; color: string }[] = [
  { value: "yellow", label: "Yellow", color: "oklch(0.74 0.17 82)" },
  { value: "blue", label: "Blue", color: "oklch(0.58 0.13 245)" },
  { value: "green", label: "Green", color: "oklch(0.62 0.14 150)" },
  { value: "rose", label: "Rose", color: "oklch(0.63 0.18 22)" },
];
