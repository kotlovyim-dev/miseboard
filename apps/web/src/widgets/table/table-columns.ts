import { readVariableTemplates } from "@/mutations/read-variable-templates";
import type { EvaluatedProps } from "../types";

export interface TableColumn {
  key: string;
  label: string;
  cell?: string;
}

export type TableRecord = Record<string, unknown>;

const DEFAULT_PAGE_SIZE = 10;

export function readColumns(props: EvaluatedProps): TableColumn[] {
  return Array.isArray(props.columns) ? props.columns.filter(isTableColumn) : [];
}

export function readPageSize(props: EvaluatedProps) {
  return typeof props.pageSize === "number" ? props.pageSize : DEFAULT_PAGE_SIZE;
}

export function readRecords(widgetId: string, data: unknown): TableRecord[] {
  if (!Array.isArray(data)) throw new Error(`${widgetId}.data must be an array`);
  return data.filter(isRecord);
}

function isTableColumn(value: unknown): value is TableColumn {
  return isRecord(value) && typeof value.key === "string" && typeof value.label === "string";
}

function isRecord(value: unknown): value is TableRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export interface TableRowAction {
  label: string;
  mutation: string;
  variables: Record<string, string>;
}

export function readRowAction(props: EvaluatedProps): TableRowAction | null {
  const { rowAction } = props;
  if (!isRecord(rowAction)) return null;
  if (typeof rowAction.label !== "string" || typeof rowAction.mutation !== "string") return null;
  return {
    label: rowAction.label,
    mutation: rowAction.mutation,
    variables: readVariableTemplates(rowAction.variables),
  };
}
