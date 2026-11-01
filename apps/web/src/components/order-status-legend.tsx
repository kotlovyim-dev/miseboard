import { StatusBadge, type OrderStatus } from "@/components/status-badge";

const ORDER_STATUSES: OrderStatus[] = ["NEW", "PREPARING", "READY", "SERVED", "CANCELLED"];

export function OrderStatusLegend() {
  return (
    <section aria-labelledby="order-statuses" className="mt-8 border-t border-border pt-4">
      <h2
        id="order-statuses"
        className="text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase"
      >
        Order statuses
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <li key={status}>
            <StatusBadge status={status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
