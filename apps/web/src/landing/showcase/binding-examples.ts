export const PREFILLED_BINDING = "{{ venuesQuery.data.venues[0].name }}";

export const BINDING_EXAMPLES = [
  {
    label: "Revenue in hryvnia",
    source: '{{ formatUAH(sum(map(ordersQuery.data.orders.edges, "node"), "total")) }}',
  },
  { label: "When the kitchen day began", source: "{{ today() }}" },
  { label: "A typo, to see the error", source: "{{ formatUAH(orderQuery.data) }}" },
];
