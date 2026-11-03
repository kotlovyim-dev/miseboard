import type { EvaluatedProps } from "../types";

export interface ChartPoint {
  label: string;
  value: number;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}T/;
const dayFormat = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Kyiv",
});

export function readChartPoints(widgetId: string, props: EvaluatedProps): ChartPoint[] {
  const { data, xKey, yKey } = props;
  if (!Array.isArray(data)) throw new Error(`${widgetId}.data must be an array`);
  if (typeof xKey !== "string" || typeof yKey !== "string") {
    throw new Error(`${widgetId}.xKey and ${widgetId}.yKey must be set`);
  }
  return data.map((record) => toPoint(widgetId, record, xKey, yKey));
}

export function barHeightPercent(value: number, max: number) {
  return max > 0 ? Math.max(0, (value / max) * 100) : 0;
}

function toPoint(widgetId: string, record: unknown, xKey: string, yKey: string): ChartPoint {
  const row = new Map(Object.entries(record ?? {}));
  const value = row.get(yKey);
  if (typeof value !== "number") throw new Error(`${widgetId}.${yKey} must be a number`);
  return { label: formatLabel(row.get(xKey)), value };
}

function formatLabel(raw: unknown) {
  if (typeof raw === "string" && ISO_DAY.test(raw)) return dayFormat.format(new Date(raw));
  return String(raw ?? "");
}
