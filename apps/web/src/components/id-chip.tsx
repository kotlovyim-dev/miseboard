import { cn } from "@/lib/utils";

export function IdChip({ id, className }: { id: string; className?: string }) {
  return (
    <code
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs leading-none text-foreground",
        className,
      )}
    >
      {id}
    </code>
  );
}
