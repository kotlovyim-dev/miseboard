import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WidgetComponentProps } from "../types";
import { formatStatValue, formatTrend } from "./format-stat";
import type { StatFormat } from "./format-stat";

const FORMATS: readonly StatFormat[] = ["number", "uah", "percent"];

export function StatWidget({ id, props }: WidgetComponentProps) {
  const { label, value, format, trend } = props;
  if (typeof value !== "number") throw new Error(`${id}.value must be a number`);

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{String(label ?? "")}</p>
      <p className="font-display text-5xl tabular-nums">
        {formatStatValue(value, readFormat(format))}
      </p>
      {typeof trend === "number" && <Trend trend={trend} />}
    </div>
  );
}

function Trend({ trend }: { trend: number }) {
  const Icon = trend < 0 ? TrendingDown : TrendingUp;
  return (
    <p
      className={cn(
        "flex items-center gap-1 text-sm tabular-nums",
        trend > 0 && "text-success",
        trend < 0 && "text-destructive",
        trend === 0 && "text-muted-foreground",
      )}
    >
      <Icon aria-hidden className="size-4" />
      {formatTrend(trend)}
    </p>
  );
}

function readFormat(format: unknown) {
  return FORMATS.find((candidate) => candidate === format) ?? "number";
}
