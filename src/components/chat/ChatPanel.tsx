import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Lightbulb } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  chatSuggestionsByTimeframe,
  greetings,
  timeframeLabels,
  usageByTimeframe,
} from "@/data/mockData";
import { scriptReply } from "@/data/aiScripts";
import type { Analogy, Timeframe } from "@/types/energy";
import { UsageBarChart } from "@/components/charts/UsageBarChart";
import { AnalogyModal } from "@/components/modals/AnalogyModal";
import { useIsMobile } from "@/hooks/use-mobile";

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "ai"; text: string; analogy?: Analogy };

export function ChatPanel({
  open,
  onOpenChange,
  timeframe,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  timeframe: Timeframe;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState<[number, number] | undefined>();
  const [analogy, setAnalogy] = useState<Analogy | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const chartData = useMemo(() => usageByTimeframe[timeframe], [timeframe]);
  const suggested = useMemo(() => chatSuggestionsByTimeframe[timeframe], [timeframe]);

  // Reset state whenever panel opens / timeframe changes
  useEffect(() => {
    if (open) {
      setMessages([{ id: "g", role: "ai", text: greetings[timeframe] }]);
      setInput("");
      setHighlight(undefined);
    }
  }, [open, timeframe]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    const reply = scriptReply(text, timeframe);
    const aiMsg: Msg = {
      id: `a-${Date.now()}`,
      role: "ai",
      text: reply.text,
      analogy: reply.analogy,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    if (reply.highlightRange) setHighlight(reply.highlightRange);
    window.setTimeout(() => setMessages((m) => [...m, aiMsg]), 450);
  };

  const content = (
    <ChatContent
      timeframe={timeframe}
      chartData={chartData}
      highlight={highlight}
      messages={messages}
      suggested={suggested}
      input={input}
      scrollRef={scrollRef}
      onInputChange={setInput}
      onSend={send}
      onAnalogy={setAnalogy}
    />
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[88dvh] rounded-t-3xl border-border bg-background p-0">
            <DrawerHeader className="border-b border-border px-4 pb-3 pt-2 text-left">
              <DrawerTitle className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                Ask AI · {timeframeLabels[timeframe]}
              </DrawerTitle>
            </DrawerHeader>
            {content}
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                Ask AI · {timeframeLabels[timeframe]}
              </SheetTitle>
            </SheetHeader>
            {content}
          </SheetContent>
        </Sheet>
      )}
      <AnalogyModal
        analogy={analogy}
        open={!!analogy}
        onOpenChange={(o) => !o && setAnalogy(null)}
      />
    </>
  );
}

function ChatContent({
  chartData,
  highlight,
  messages,
  suggested,
  input,
  scrollRef,
  onInputChange,
  onSend,
  onAnalogy,
}: {
  timeframe: Timeframe;
  chartData: (typeof usageByTimeframe)[Timeframe];
  highlight?: [number, number];
  messages: Msg[];
  suggested: { id: string; text: string }[];
  input: string;
  scrollRef: React.RefObject<HTMLDivElement>;
  onInputChange: (value: string) => void;
  onSend: (textOverride?: string) => void;
  onAnalogy: (analogy: Analogy) => void;
}) {
  return (
    <>
      <div className="border-b border-border bg-secondary/30 p-3">
        <UsageBarChart data={chartData} highlightRange={highlight} compact />
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                  : "max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm text-foreground"
              }
            >
              <p className="leading-relaxed">{m.text}</p>
              {m.role === "ai" && m.analogy && (
                <button
                  type="button"
                  onClick={() => onAnalogy(m.analogy!)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground hover:opacity-90"
                >
                  <Lightbulb className="h-3 w-3" /> Analogy
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border p-3">
        <div className="flex flex-wrap gap-1.5">
          {suggested.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSend(s.text)}
              className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              {s.text}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask about your energy use..."
            aria-label="Message"
            className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" size="icon" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
