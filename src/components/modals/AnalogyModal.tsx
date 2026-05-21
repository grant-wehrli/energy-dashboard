import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AnalogyIllustration } from "@/components/illustrations/AnalogyIllustrations";
import type { Analogy } from "@/types/energy";

export function AnalogyModal({
  analogy,
  open,
  onOpenChange,
}: {
  analogy: Analogy | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-3 flex items-center justify-center rounded-2xl bg-accent/40 py-3">
            {analogy && <AnalogyIllustration analogyKey={analogy.key} />}
          </div>
          <DialogTitle>{analogy?.title ?? "Analogy"}</DialogTitle>
          <DialogDescription className="pt-1 text-base leading-relaxed text-foreground/80">
            {analogy?.body}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
