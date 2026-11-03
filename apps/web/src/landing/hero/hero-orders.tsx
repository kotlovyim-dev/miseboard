"use client";

import { StatusBadge } from "@/components/status-badge";
import { formatStatValue } from "@/widgets/stat/format-stat";
import { formatOrderTime } from "../data/format-order-time";
import type { OrderRow } from "../data/order-rows";
import { useStatusCycle } from "./use-status-cycle";

const CYCLING_ROW = 1;

export function HeroOrders({ rows }: { rows: OrderRow[] }) {
  const cycling = useStatusCycle();

  return (
    <div
      data-ui
      className="landing-ui grid h-full grid-rows-3 bg-card text-card-foreground [container-type:inline-size]"
    >
      {rows.map((row, index) => (
        <div
          key={row.id}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-[3cqw] text-[clamp(13px,4.2cqw,22px)] odd:bg-card even:bg-muted"
        >
          <span className="tabular-nums">{formatOrderTime(row.createdAt)}</span>
          <span>
            <StatusBadge status={index === CYCLING_ROW ? cycling : row.status} />
          </span>
          <span className="tabular-nums">{formatStatValue(row.total, "uah")}</span>
        </div>
      ))}
    </div>
  );
}
