import type { QueryConfig } from "@miseboard/config";

export function KindBadge({ kind }: { kind: QueryConfig["kind"] }) {
  return (
    <span className="rounded-sm border border-border px-1.5 py-0.5 text-[11px] leading-none tracking-[0.06em] text-muted-foreground uppercase">
      {kind}
    </span>
  );
}
