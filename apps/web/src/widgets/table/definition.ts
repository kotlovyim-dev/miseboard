import type { WidgetConfig } from "@miseboard/config";
import type { WidgetDefinition } from "../types";
import { TableSkeleton } from "./table-skeleton";
import { TableWidget } from "./table-widget";

type TableProps = Extract<WidgetConfig, { type: "table" }>["props"];

const DEFAULT_PAGE_SIZE = 10;

export const tableDefinition: WidgetDefinition<TableProps> = {
  type: "table",
  label: "Table",
  defaultProps: (_id, { queryIds }) => ({
    data: queryIds[0] ? `{{ ${queryIds[0]}.data }}` : "{{ [] }}",
    pageSize: DEFAULT_PAGE_SIZE,
    columns: [],
  }),
  templatedFields: (props) => ({ data: props.data }),
  initialState: () => ({ selectedRow: null, page: 1 }),
  inspectorFields: [
    { kind: "template", name: "data", label: "Data" },
    { kind: "number", name: "pageSize", label: "Rows per page", min: 5, max: 100 },
    { kind: "columns", name: "columns", label: "Columns" },
    { kind: "rowAction", name: "rowAction", label: "Row action" },
  ],
  Component: TableWidget,
  Skeleton: TableSkeleton,
};
