import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ExternalLink, ShieldCheck, TriangleAlert } from "lucide-react";
import { heatingUptime, rates, recommendationsByTimeframe, sources } from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";
import type { Recommendation, Timeframe } from "@/types/energy";

export function SourceModal({
  open,
  onOpenChange,
  recommendation,
  timeframe = "today",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  recommendation?: Recommendation | null;
  timeframe?: Timeframe;
}) {
  const selected = recommendation ?? recommendationsByTimeframe[timeframe][0];
  const citedSources = sources.filter((source) => selected.sourceIds.includes(source.id));
  const confidenceTone =
    selected.confidence === "low"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : "border-primary/25 bg-primary/10 text-primary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Why we recommend this</DialogTitle>
        </DialogHeader>

        <div className="rounded-2xl border border-border bg-secondary/30 p-4">
          <div className="text-sm font-semibold">{selected.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.body}</p>
          <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${confidenceTone}`}
          >
            {selected.confidence === "low" ? (
              <TriangleAlert className="h-3.5 w-3.5" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            {selected.confidence} confidence
          </div>
        </div>

        <Tabs defaultValue="evidence" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="calculation">Calculation</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="evidence" className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-semibold">Recent heating and load evidence</h4>
              <p className="text-xs text-muted-foreground">
                Highlighted region marks the peak-rate window ({rates.peakWindowLabel}).
              </p>
              <div className="mt-2 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={heatingUptime}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      width={28}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`${v} h`, "Uptime"]}
                    />
                    <ReferenceArea y1={3.5} y2={6} fill="var(--highlight)" fillOpacity={0.12} />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="var(--primary)"
                      fill="var(--primary)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <ul className="space-y-2 text-sm">
              {selected.evidence.map((item) => (
                <li key={item} className="rounded-xl border border-border bg-card p-3">
                  {item}
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="calculation" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric label="Peak rate" value={`${formatKRW(rates.peakKRWPerKWh)} / kWh`} />
              <Metric label="Off-peak rate" value={`${formatKRW(rates.offPeakKRWPerKWh)} / kWh`} />
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
              <div className="mb-2 font-semibold">Estimate breakdown</div>
              <dl className="space-y-1.5">
                {selected.calculation.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
                {selected.estimatedSavings && (
                  <div className="flex justify-between gap-4 border-t border-border pt-1.5 font-semibold text-primary">
                    <dt>Potential savings</dt>
                    <dd>{formatKRW(selected.estimatedSavings)}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-sm font-semibold">Limits of this estimate</div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {selected.limitations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              The recommendation combines smart meter patterns, tariff timing, and forecast context
              where available.
            </p>
            <ul className="space-y-3">
              {citedSources.map((source) => (
                <li key={source.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-sm font-medium">{source.label}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {source.citation}
                  </p>
                  {source.url !== "#" && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      Open source <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
