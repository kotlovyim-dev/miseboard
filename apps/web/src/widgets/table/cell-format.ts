import type { EvaluatedRow } from "./evaluate-rows";

export function formatCell(value: unknown) {
  if (value === undefined || value === null) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

export function isNumericColumn(key: string, rows: EvaluatedRow[]) {
  return (
    isAllNumbers(rows.map((row) => row.source[key])) ||
    isAllNumbers(rows.map((row) => row.cells[key]))
  );
}

function isAllNumbers(values: unknown[]) {
  return values.length > 0 && values.every((value) => typeof value === "number");
}
