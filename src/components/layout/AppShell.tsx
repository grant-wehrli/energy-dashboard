import { useEffect, useState } from "react";
import { LineChart, Lightbulb, Target } from "lucide-react";
import { Toaster } from "sonner";
import { Sidebar, type NavKey } from "./Sidebar";
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

type SubView = "dashboard" | "summary" | "recommendations";

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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleNav = (k: NavKey) => {
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

          <div className="min-h-0 flex-1 overflow-hidden">
            {nav === "usage" && sub === "dashboard" && (
              <DashboardView
                timeframe={timeframe}
                onOpenSummary={() => setSub("summary")}
                onOpenRecommendations={() => setSub("recommendations")}
                onExplainChart={() => setChartExplainOpen(true)}
                onExplainCost={() => setCostExplainOpen(true)}
              />
            )}
            {nav === "usage" && sub === "summary" && (
              <AISummaryView
                timeframe={timeframe}
                onBack={() => setSub("dashboard")}
                onGoToTips={() => handleNav("tips")}
              />
            )}
            {nav === "usage" && sub === "recommendations" && (
              <RecommendationsView timeframe={timeframe} onBack={() => setSub("dashboard")} />
            )}

            {nav === "forecast" && (
              <PlaceholderView
                icon={LineChart}
                title="Forecast preview"
                description="A 7-day energy forecast lives here in the full product. For this demo, jump back to Current Energy Usage to see the AI Summary and Recommendations flows."
              />
            )}
            {nav === "tips" && (
              <PlaceholderView
                icon={Lightbulb}
                title="Saving Tips"
                description="Personalized tips will appear here, generated from your usage history and local rate schedule."
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
