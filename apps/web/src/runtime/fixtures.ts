import { AppConfig } from "@miseboard/config";
import type { WidgetDefinition } from "@/widgets/types";

export const sampleConfig = AppConfig.parse({
  version: 1,
  queries: [
    {
      id: "ordersQuery",
      kind: "query",
      document: "query ($venueId: ID!) { orders(venueId: $venueId) { id } }",
      variables: { venueId: "{{ venueSelect.value }}" },
    },
    { id: "markReady", kind: "mutation", document: "mutation { noop }", variables: {} },
  ],
  widgets: [
    {
      id: "ordersTable",
      type: "table",
      width: 12,
      props: {
        data: "{{ ordersQuery.data }}",
        columns: [{ key: "status", label: "Status", cell: "{{ row.status }}" }],
      },
    },
    { id: "notes", type: "text", width: 4, props: { content: "Hello" } },
  ],
});

export const tableDefinition: WidgetDefinition = {
  type: "table",
  label: "Table",
  defaultProps: () => ({ data: "", pageSize: 10, columns: [] }),
  templatedFields: (props): Record<string, string> => ("data" in props ? { data: props.data } : {}),
  initialState: () => ({}),
  inspectorFields: [],
  Component: () => null,
};
