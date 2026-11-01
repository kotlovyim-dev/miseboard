import type { WidgetConfig } from "@miseboard/config";

export type StatFormat = Extract<WidgetConfig, { type: "stat" }>["props"]["format"];

const KOPECKS_PER_HRYVNIA = 100;
const LOCALE = "uk-UA";

const formatters: Record<StatFormat, (value: number) => string> = {
  number: new Intl.NumberFormat(LOCALE).format,
  uah: (kopecks) =>
    new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: "UAH",
      currencyDisplay: "narrowSymbol",
    }).format(kopecks / KOPECKS_PER_HRYVNIA),
  percent: new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 1 }).format,
};

const trendFormatter = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

export function formatStatValue(value: number, format: StatFormat) {
  return formatters[format](value);
}

export function formatTrend(trend: number) {
  return trendFormatter.format(trend);
}
