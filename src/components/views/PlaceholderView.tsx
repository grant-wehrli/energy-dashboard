import { type LucideIcon } from "lucide-react";

export function PlaceholderView({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full overflow-y-auto rounded-3xl bg-canvas p-3 sm:p-5">
      <div className="flex min-h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-4 py-14 text-center sm:px-6 sm:py-20">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
