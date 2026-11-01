export const HELPER_NAMES: ReadonlySet<string> = new Set(["sum", "count", "map", "formatUAH"]);

const WIDGET_COUNT = 40;
const ORDER_COUNT = 200;

export const widgetNodes = [
  { id: "orders", fields: { variables: "{{ 1 }}" } },
  ...Array.from({ length: WIDGET_COUNT - 1 }, (_, index) => ({
    id: `widget${index}`,
    fields: {
      value: "{{ formatUAH(sum(orders.data, 'total')) }}",
      label: "Orders: {{ count(orders.data) }} / {{ round(avg(orders.data, 'total'), 1) }}",
      visible: "{{ orders.isLoading ? false : len(orders.data) > 0 }}",
    },
  })),
];

export const ordersState = {
  orders: {
    data: Array.from({ length: ORDER_COUNT }, (_, index) => ({ total: 1000 + index })),
    isLoading: false,
  },
};
