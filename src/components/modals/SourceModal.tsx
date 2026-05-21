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
import { ExternalLink } from "lucide-react";
import { heatingUptime, rates, savingsCalc, sources } from "@/data/mockData";
import { formatKRW } from "@/lib/formatKRW";

export function SourceModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Why we recommend this</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4 pt-4">
            <div>
              <h4 className="text-sm font-semibold">Floor heating uptime — last 14 days</h4>
              <p className="text-xs text-muted-foreground">
                Highlighted region marks the peak-rate window ({rates.peakWindowLabel}).
              </p>
              <div className="mt-2 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heatingUptime} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={28} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v} h`, "Uptime"]} />
                    <ReferenceArea y1={3.5} y2={6} fill="var(--highlight)" fillOpacity={0.12} />
                    <Area type="monotone" dataKey="hours" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground">Peak rate</div>
                <div className="font-semibold">{formatKRW(rates.peakKRWPerKWh)} / kWh</div>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground">Off-peak rate</div>
                <div className="font-semibold">{formatKRW(rates.offPeakKRWPerKWh)} / kWh</div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
              <div className="mb-2 font-semibold">Savings calculation</div>
              <dl className="space-y-1.5">
                <div className="flex justify-between"><dt className="text-muted-foreground">Current estimate</dt><dd>{formatKRW(savingsCalc.currentEstimate)} / month</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Recommended estimate</dt><dd>{formatKRW(savingsCalc.recommendedEstimate)} / month</dd></div>
                <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-primary"><dt>Estimated savings</dt><dd>{formatKRW(savingsCalc.estimatedSavings)} / month</dd></div>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="source" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              Recommendations are generated from three independent data feeds. Citations are formatted in MLA style.
            </p>
            <ul className="space-y-3">
              {sources.map((s) => (
                <li key={s.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-sm font-medium">{s.label}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.citation}</p>
                  {s.url !== "#" && (
                    <a
                      href={s.url}
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