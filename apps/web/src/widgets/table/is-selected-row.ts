import type { TableRecord } from "./table-columns";

export function isSelectedRow(selected: unknown, row: TableRecord) {
  if (typeof selected !== "object" || selected === null || !("id" in selected)) return false;
  return selected.id === row.id;
}
