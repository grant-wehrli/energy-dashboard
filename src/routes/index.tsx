import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Energy Dashboard — AI Insights" },
      {
        name: "description",
        content: "AI-driven smart home energy dashboard with plain-language insights, recommendations, and source-cited explanations.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <AppShell />;
}
