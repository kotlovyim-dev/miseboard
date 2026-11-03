import type { EvaluatedProps } from "../types";

export interface SelectOption {
  label: string;
  value: string;
}

export function readOptions(widgetId: string, props: EvaluatedProps): SelectOption[] {
  const { options, labelKey, valueKey } = props;
  if (!Array.isArray(options)) throw new Error(`${widgetId}.options must be an array`);
  if (typeof labelKey !== "string" || typeof valueKey !== "string") {
    throw new Error(`${widgetId}.labelKey and ${widgetId}.valueKey must be set`);
  }
  return options
    .filter(isRecord)
    .map((record) => ({
      label: String(record[labelKey] ?? ""),
      value: String(record[valueKey] ?? ""),
    }))
    .filter((option) => option.value !== "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
