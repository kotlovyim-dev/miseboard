import { parseAppConfig } from "@miseboard/config";

const VENUES_DOCUMENT = `query Venues {
  venues {
    id
    name
  }
}`;

const REVENUE_DOCUMENT = `query RevenueToday($from: DateTime!, $to: DateTime!) {
  venues {
    id
    revenue(from: $from, to: $to) {
      total
      orders
    }
  }
}`;

const ORDERS_DOCUMENT = `query VenueOrders($venueId: ID) {
  orders(first: 20, venueId: $venueId) {
    edges {
      node {
        id
        status
        total
        createdAt
      }
    }
  }
}`;

const LOW_STOCK_DOCUMENT = `query LowStock {
  venues {
    id
    inventory(lowStockOnly: true) {
      id
      name
      qty
      minQty
      unit
      isLow
    }
  }
}`;

const MARK_READY_DOCUMENT = `mutation MarkReady($id: ID!, $status: OrderStatus!) {
  updateOrderStatus(id: $id, status: $status) {
    id
    status
  }
}`;

const RESTOCK_DOCUMENT = `mutation Restock($id: ID!, $delta: Float!) {
  adjustInventory(id: $id, delta: $delta) {
    id
    qty
    isLow
  }
}`;

const venueVariables = { venueId: "{{ venueSelect.value }}" };
const selectedVenue = (query: string) =>
  `filter(${query}.data.venues ?? [], "id", venueSelect.value)[0]`;
const lowStockItems = `filter(${selectedVenue("lowStockQuery")}.inventory ?? [], "isLow", true)`;

const parsed = parseAppConfig({
  version: 1,
  queries: [
    { id: "venuesQuery", kind: "query", document: VENUES_DOCUMENT },
    {
      id: "revenueQuery",
      kind: "query",
      document: REVENUE_DOCUMENT,
      variables: { from: "{{ today() }}", to: "{{ daysAgo(-1) }}" },
    },
    { id: "ordersQuery", kind: "query", document: ORDERS_DOCUMENT, variables: venueVariables },
    { id: "lowStockQuery", kind: "query", document: LOW_STOCK_DOCUMENT },
    { id: "markReady", kind: "mutation", document: MARK_READY_DOCUMENT, trigger: "manual" },
    { id: "restock", kind: "mutation", document: RESTOCK_DOCUMENT, trigger: "manual" },
  ],
  widgets: [
    {
      id: "header",
      type: "text",
      width: 6,
      props: { content: "# Restaurant Ops\nOrders, revenue and stock for the selected venue." },
    },
    {
      id: "venueSelect",
      type: "select",
      width: 6,
      props: {
        options: "{{ venuesQuery.data.venues ?? [] }}",
        labelKey: "name",
        valueKey: "id",
        default: "{{ venuesQuery.data.venues[0].id }}",
      },
    },
    {
      id: "revenueStat",
      type: "stat",
      width: 4,
      props: {
        label: "Revenue today",
        value: `{{ sum(${selectedVenue("revenueQuery")}.revenue ?? [], "total") }}`,
        format: "uah",
      },
    },
    {
      id: "ordersStat",
      type: "stat",
      width: 4,
      props: {
        label: "Orders today",
        value: `{{ sum(${selectedVenue("revenueQuery")}.revenue ?? [], "orders") }}`,
        format: "number",
      },
    },
    {
      id: "lowStockStat",
      type: "stat",
      width: 4,
      props: {
        label: "Low stock items",
        value: `{{ len(${lowStockItems}) }}`,
        format: "number",
      },
    },
    {
      id: "ordersTable",
      type: "table",
      width: 12,
      props: {
        data: '{{ map(ordersQuery.data.orders.edges ?? [], "node") }}',
        pageSize: 10,
        columns: [
          { key: "createdAt", label: "Placed", cell: "{{ formatDate(row.createdAt) }}" },
          { key: "status", label: "Status" },
          { key: "total", label: "Total", cell: "{{ formatUAH(row.total) }}" },
        ],
        rowAction: {
          label: "Mark ready",
          mutation: "markReady",
          variables: { id: "{{ row.id }}", status: "READY" },
        },
      },
    },
    {
      id: "lowStockTable",
      type: "table",
      width: 12,
      props: {
        data: `{{ ${lowStockItems} }}`,
        pageSize: 10,
        columns: [
          { key: "name", label: "Item" },
          { key: "qty", label: "In stock" },
          { key: "minQty", label: "Minimum" },
          { key: "unit", label: "Unit" },
        ],
        rowAction: {
          label: "Add 10",
          mutation: "restock",
          variables: { id: "{{ row.id }}", delta: "{{ 10 }}" },
        },
      },
    },
  ],
});
if (!parsed.ok) {
  throw new Error(parsed.message);
}

export const restaurantOps = {
  name: "Restaurant Ops",
  slug: "restaurant-ops",
  config: parsed.config,
  isTemplate: true,
};
