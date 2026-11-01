import { AppConfig } from "@miseboard/config";

export const DEMO_SLUG = "demo";

const ORDERS_DOCUMENT = `
  query LatestOrders {
    orders(first: 20) {
      edges {
        node {
          id
          status
          total
          createdAt
          venue {
            name
          }
        }
      }
    }
  }
`;

const REVENUE_DOCUMENT = `
  query RevenueToday($from: DateTime!, $to: DateTime!) {
    venues {
      id
      name
      revenue(from: $from, to: $to) {
        total
      }
    }
  }
`;

function revenueStat(id: string, venueIndex: number) {
  const venue = `revenueQuery.data.venues[${venueIndex}]`;
  return {
    id,
    type: "stat",
    width: 4,
    props: {
      label: `{{ ${venue}.name }} · revenue today`,
      value: `{{ sum(${venue}.revenue ?? [], "total") }}`,
      format: "uah",
    },
  };
}

export const demoApp = {
  name: "Orders today",
  config: AppConfig.parse({
    version: 1,
    queries: [
      { id: "ordersQuery", kind: "query", document: ORDERS_DOCUMENT },
      {
        id: "revenueQuery",
        kind: "query",
        document: REVENUE_DOCUMENT,
        variables: { from: "{{ today() }}", to: "{{ daysAgo(-1) }}" },
      },
    ],
    widgets: [
      {
        id: "intro",
        type: "text",
        width: 12,
        props: {
          content:
            "Latest orders across all venues. Revenue counts from midnight Kyiv time and leaves out cancelled orders.",
        },
      },
      revenueStat("venueRevenue1", 0),
      revenueStat("venueRevenue2", 1),
      revenueStat("venueRevenue3", 2),
      {
        id: "ordersTable",
        type: "table",
        width: 12,
        props: {
          data: '{{ map(ordersQuery.data.orders.edges ?? [], "node") }}',
          pageSize: 10,
          columns: [
            { key: "createdAt", label: "Placed", cell: "{{ formatDate(row.createdAt) }}" },
            { key: "venue", label: "Venue", cell: "{{ row.venue.name }}" },
            { key: "status", label: "Status" },
            { key: "total", label: "Total", cell: "{{ formatUAH(row.total) }}" },
          ],
        },
      },
    ],
  }),
};
