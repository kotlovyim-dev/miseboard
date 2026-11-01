import { evaluateTemplate } from "@miseboard/engine";
import type { Scope } from "@miseboard/engine";
import type { TableColumn, TableRecord } from "./table-columns";

export interface EvaluatedRow {
  source: TableRecord;
  cells: Record<string, unknown>;
}

export function evaluateRows(
  widgetId: string,
  columns: TableColumn[],
  records: TableRecord[],
  scope: Scope,
): EvaluatedRow[] {
  return records.map((source) => ({
    source,
    cells: Object.fromEntries(
      columns.map((column) => [column.key, evaluateCell(widgetId, column, source, scope)]),
    ),
  }));
}

function evaluateCell(widgetId: string, column: TableColumn, row: TableRecord, scope: Scope) {
  if (column.cell === undefined) return row[column.key];
  const result = evaluateTemplate(column.cell, { ...scope, row });
  if (result.ok) return result.value;
  throw new Error(`${widgetId}.columns.${column.key}: ${result.error}`);
}
