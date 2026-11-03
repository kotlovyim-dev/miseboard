import { Button } from "@/components/ui/button";
import type { SaveStatus as Status } from "@/editor/persistence/autosave";

const LABELS: Record<Status, string> = {
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn't save",
  conflict: "Newer version found",
};

export function SaveStatus({ status, onRetry }: { status: Status; onRetry: () => void }) {
  return (
    <p aria-live="polite" className="flex items-center gap-1 text-xs text-muted-foreground">
      {LABELS[status]}
      {status === "error" && (
        <>
          <span aria-hidden>·</span>
          <Button variant="link" size="xs" className="px-0" onClick={onRetry}>
            Retry
          </Button>
        </>
      )}
    </p>
  );
}
