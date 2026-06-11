import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "sonner";
import type { Timeframe } from "@/data/mockData";

const tabs: { key: Timeframe; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
];

export function TopTabs({
  value,
  onChange,
}: {
  value: Timeframe;
  onChange: (t: Timeframe) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const activeIndex = tabs.findIndex((tab) => tab.key === value);

  return (
    <div className="liquid-glass-pill relative grid min-w-0 flex-1 grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-1 rounded-full p-1 sm:inline-grid sm:flex-none sm:min-w-[360px]">
      <span
        aria-hidden="true"
        className="top-tab-selection absolute bottom-1 left-1 top-1 z-0 rounded-full"
        style={{
          left: `calc(0.25rem + ${Math.max(activeIndex, 0)} * ((100% - 2.5rem - 0.5rem) / 3))`,
          width: "calc((100% - 2.5rem - 0.5rem) / 3)",
        }}
      />
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`relative z-10 min-w-0 rounded-full px-2 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
              active ? "text-primary-foreground" : "text-muted-foreground hover:bg-card/70"
            }`}
            aria-pressed={active}
          >
            {t.label}
          </button>
        );
      })}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Pick a custom date"
            className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-card/70"
          >
            <CalendarDays className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              if (d) toast.success(`Custom date selected: ${d.toLocaleDateString()}`);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
