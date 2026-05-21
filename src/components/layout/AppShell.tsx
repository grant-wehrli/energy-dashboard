import { useState } from "react";
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
import { analogies } from "@/data/mockData";
import type { Timeframe } from "@/types/energy";

type SubView = "dashboard" | "summary" | "recommendations";

export function AppShell() {
  const [nav, setNav] = useState<NavKey>("usage");
  const [sub, setSub] = useState<SubView>("dashboard");
  const [timeframe, setTimeframe] = useState<Timeframe>("today");
  const [chatOpen, setChatOpen] = useState(false);
  const [costExplainOpen, setCostExplainOpen] = useState(false);
  const [chartExplainOpen, setChartExplainOpen] = useState(false);

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

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <Sidebar active={nav} onChange={handleNav} onHome={handleHome} />

      <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden px-6 py-4">
          <div className="mb-4 flex shrink-0 items-start justify-between gap-4">
            <TopTabs value={timeframe} onChange={handleTimeframe} />
            <AskAIButton onClick={() => setChatOpen(true)} />
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

      <ChatPanel open={chatOpen} onOpenChange={setChatOpen} timeframe={timeframe} />
      <SourceModal open={costExplainOpen} onOpenChange={setCostExplainOpen} />
      <AnalogyModal
        analogy={chartExplainOpen ? analogies.rushHour : null}
        open={chartExplainOpen}
        onOpenChange={setChartExplainOpen}
      />
      <Toaster position="bottom-right" />
    </div>
  );
}
