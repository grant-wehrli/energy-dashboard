import { CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
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
  return (
    <div className="liquid-glass-pill grid min-w-0 flex-1 grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-1 rounded-full p-1 sm:inline-flex sm:flex-none sm:gap-2">
      {tabs.map((t) => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={cn(
              "min-w-0 rounded-full px-2 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card/70",
            )}
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-card/70"
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
