import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { Toaster } from "sonner";
import { Sidebar, type AccentColor, type NavKey } from "./Sidebar";
import { TopTabs } from "./TopTabs";
import { AskAIButton } from "./AskAIButton";
import { DashboardView } from "@/components/views/DashboardView";
import { AISummaryView } from "@/components/views/AISummaryView";
import { RecommendationsView } from "@/components/views/RecommendationsView";
import { PlaceholderView } from "@/components/views/PlaceholderView";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { SourceModal } from "@/components/modals/SourceModal";
import { AnalogyModal } from "@/components/modals/AnalogyModal";
import { OnboardingCoachmark } from "./OnboardingCoachmark";
import { analogies } from "@/data/mockData";
import { DEMO_ONBOARDING_ENABLED } from "@/config/onboarding";
import type { Timeframe } from "@/types/energy";

type SubView = "dashboard" | "summary";

type SwipeStart = { x: number; y: number } | null;

const RECOMMENDATION_HINT_DISMISSED_KEY = "energy-dashboard-recommendation-hint-dismissed";

export function AppShell() {
  const [nav, setNav] = useState<NavKey>("usage");
  const [sub, setSub] = useState<SubView>("dashboard");
  const [timeframe, setTimeframe] = useState<Timeframe>("today");
  const [chatOpen, setChatOpen] = useState(false);
  const [costExplainOpen, setCostExplainOpen] = useState(false);
  const [chartExplainOpen, setChartExplainOpen] = useState(false);
  const [onboardingEnabled, setOnboardingEnabled] = useState(DEMO_ONBOARDING_ENABLED);
  const [coachmarkOpen, setCoachmarkOpen] = useState(DEMO_ONBOARDING_ENABLED);
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState<AccentColor>("yellow");
  const [swipeStart, setSwipeStart] = useState<SwipeStart>(null);
  const [recommendationHintVisible, setRecommendationHintVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dataset.accent = accentColor;
  }, [accentColor]);

  useEffect(() => {
    if (window.localStorage.getItem(RECOMMENDATION_HINT_DISMISSED_KEY) === "true") return;

    const timeout = window.setTimeout(() => {
      setRecommendationHintVisible(true);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, []);

  const dismissRecommendationHint = () => {
    setRecommendationHintVisible(false);
    window.localStorage.setItem(RECOMMENDATION_HINT_DISMISSED_KEY, "true");
  };

  const handleNav = (k: NavKey) => {
    if (k === "recommendations") dismissRecommendationHint();
    setNav(k);
    setSub("dashboard");
  };

  const handleTimeframe = (t: Timeframe) => {
    setTimeframe(t);
    setNav("usage");
    setSub("dashboard");
    setChatOpen(false);
  };

  const handleHome = () => {
    setNav("usage");
    setSub("dashboard");
    setChatOpen(false);
  };

  const handleAskAI = () => {
    setChatOpen(true);
    setCoachmarkOpen(false);
  };

  const handleOnboardingChange = (enabled: boolean) => {
    setOnboardingEnabled(enabled);
    setCoachmarkOpen(enabled);
  };

  const finishViewSwipe = (x: number, y: number) => {
    if (!swipeStart || Number.isNaN(x) || Number.isNaN(y)) {
      setSwipeStart(null);
      return;
    }

    const dx = x - swipeStart.x;
    const dy = y - swipeStart.y;
    setSwipeStart(null);
    if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 1.4) return;

    if (nav === "usage" && sub === "dashboard" && dx < 0) {
      handleNav("recommendations");
    } else if (nav === "recommendations" && dx > 0) {
      handleNav("usage");
    }
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-canvas text-foreground md:bg-background">
      <Sidebar
        active={nav}
        onChange={handleNav}
        onHome={handleHome}
        onAskAI={handleAskAI}
        askAIAttention={onboardingEnabled && coachmarkOpen && !chatOpen}
        onboardingEnabled={onboardingEnabled}
        onOnboardingChange={handleOnboardingChange}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        accentColor={accentColor}
        onAccentColorChange={setAccentColor}
        showRecommendationHint={recommendationHintVisible}
        onSettingsOpen={() => setCoachmarkOpen(false)}
      />

      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden px-0 py-0 sm:px-4 md:px-6 md:py-4">
          <div className="flex shrink-0 items-start justify-center gap-3 bg-canvas px-3 py-3 md:mb-4 md:justify-between md:bg-transparent md:px-0 md:py-0">
            <TopTabs value={timeframe} onChange={handleTimeframe} />
            <AskAIButton
              onClick={handleAskAI}
              attention={onboardingEnabled && coachmarkOpen && !chatOpen}
              className="hidden md:inline-flex"
            />
          </div>

          <div
            className="min-h-0 flex-1 overflow-hidden"
            onPointerDown={(event) => setSwipeStart({ x: event.clientX, y: event.clientY })}
            onPointerUp={(event) => finishViewSwipe(event.clientX, event.clientY)}
            onPointerCancel={() => finishViewSwipe(Number.NaN, Number.NaN)}
          >
            {(nav === "usage" || nav === "recommendations") && sub === "dashboard" && (
              <div className="h-full overflow-hidden">
                <div
                  data-view-slider
                  className="flex h-full w-[200%] transition-transform duration-500 ease-out"
                  style={{
                    transform: nav === "recommendations" ? "translateX(-50%)" : "translateX(0)",
                  }}
                >
                  <section className="h-full w-1/2 shrink-0 overflow-hidden">
                    <DashboardView
                      timeframe={timeframe}
                      onExplainChart={() => setChartExplainOpen(true)}
                      onExplainCost={() => setCostExplainOpen(true)}
                    />
                  </section>
                  <section className="h-full w-1/2 shrink-0 overflow-hidden">
                    <RecommendationsView timeframe={timeframe} />
                  </section>
                </div>
              </div>
            )}
            {nav === "usage" && sub === "summary" && (
              <AISummaryView
                timeframe={timeframe}
                onBack={() => setSub("dashboard")}
                onGoToRecommendations={() => handleNav("recommendations")}
              />
            )}
            {nav === "goals" && (
              <PlaceholderView
                icon={Target}
                title="Goals & Milestones"
                description="Track monthly savings goals and celebrate milestones. This area is part of the broader product roadmap."
              />
            )}
          </div>
        </div>
      </main>

      <OnboardingCoachmark
        open={onboardingEnabled && coachmarkOpen && !chatOpen}
        onAskAI={handleAskAI}
        onDismiss={() => setCoachmarkOpen(false)}
      />
      <ChatPanel open={chatOpen} onOpenChange={setChatOpen} timeframe={timeframe} />
      <SourceModal open={costExplainOpen} onOpenChange={setCostExplainOpen} timeframe={timeframe} />
      <AnalogyModal
        analogy={chartExplainOpen ? analogies.rushHour : null}
        open={chartExplainOpen}
        onOpenChange={setChartExplainOpen}
      />
      <Toaster position="bottom-right" />
    </div>
  );
}
