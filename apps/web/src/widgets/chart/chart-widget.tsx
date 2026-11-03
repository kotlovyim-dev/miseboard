import { formatStatValue } from "../stat/format-stat";
import type { StatFormat } from "../stat/format-stat";
import type { WidgetComponentProps } from "../types";
import { barHeightPercent, readChartPoints } from "./chart-points";

const FORMATS: readonly StatFormat[] = ["number", "uah", "percent"];

export function ChartWidget({ id, props }: WidgetComponentProps) {
  const points = readChartPoints(id, props);
  const format = FORMATS.find((candidate) => candidate === props.format) ?? "number";
  const max = Math.max(0, ...points.map((point) => point.value));

  if (points.length === 0) return <p className="text-sm text-muted-foreground">No data</p>;

  return (
    <ul className="flex h-40 items-stretch gap-2">
      {points.map(({ label, value }, index) => (
        <li key={index} className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-1 items-end">
            <div
              className="w-full rounded-t-sm bg-primary"
              style={{ height: `${barHeightPercent(value, max)}%` }}
              title={formatStatValue(value, format)}
            />
          </div>
          <span className="truncate text-center text-xs text-muted-foreground">{label}</span>
          <span className="sr-only">{formatStatValue(value, format)}</span>
        </li>
      ))}
    </ul>
  );
}
