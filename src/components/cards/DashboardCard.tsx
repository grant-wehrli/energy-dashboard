import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DashboardCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4 lg:min-h-0",
        className,
      )}
    >
      <header className="mb-2 flex shrink-0 items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>
  );
}
