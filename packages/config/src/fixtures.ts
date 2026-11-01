export const tableWidget = {
  id: "ordersTable",
  type: "table",
  width: 12,
  props: {
    data: "{{ ordersQuery.data.orders.edges }}",
    columns: [{ key: "status", label: "Status", cell: "{{ row.status }}" }],
    rowAction: { label: "Mark ready", mutation: "markReady", variables: { id: "{{ row.id }}" } },
  },
};

export const statWidget = {
  id: "revenueStat",
  type: "stat",
  width: 4,
  props: { label: "Revenue", value: "{{ revenueQuery.data }}", format: "uah" },
};

export const textWidget = {
  id: "header",
  type: "text",
  width: 12,
  props: { content: "# Orders" },
};

export const selectWidget = {
  id: "venueSelect",
  type: "select",
  width: 3,
  props: {
    options: "{{ venuesQuery.data.venues }}",
    labelKey: "name",
    valueKey: "id",
    default: "{{ venuesQuery.data.venues[0].id }}",
  },
};

export const formWidget = {
  id: "restockForm",
  type: "form",
  width: 6,
  props: {
    fields: [{ name: "amount", label: "Amount", type: "number", default: "10" }],
    submitLabel: "Restock",
    mutation: "restock",
    variables: { amount: "{{ restockForm.values.amount }}" },
  },
};

export const ordersQuery = {
  id: "ordersQuery",
  kind: "query",
  document: "query { orders(first: 20) { totalCount } }",
  variables: { venueId: "{{ venueSelect.value }}" },
  trigger: "onLoad",
};

export const markReadyMutation = {
  id: "markReady",
  kind: "mutation",
  document: "mutation($id: ID!) { updateOrderStatus(id: $id, status: READY) { id } }",
  variables: {},
  trigger: "manual",
};

export const fullConfig = {
  version: 1,
  queries: [ordersQuery, markReadyMutation],
  widgets: [textWidget, selectWidget, statWidget, tableWidget, formWidget],
};
