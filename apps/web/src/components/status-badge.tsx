import { graphql, type ResultOf } from "@miseboard/schema";
import { cn } from "@/lib/utils";

export const OrderStatusFragment = graphql(`
  fragment OrderStatusValue on Order {
    status
  }
`);

export type OrderStatus = ResultOf<typeof OrderStatusFragment>["status"];

interface StatusStyle {
  label: string;
  tint: string;
  dot: string;
}

const STATUS_STYLES: Record<OrderStatus, StatusStyle> = {
  NEW: { label: "New", tint: "bg-info/12", dot: "bg-info" },
  PREPARING: { label: "Preparing", tint: "bg-warning/12", dot: "bg-warning" },
  READY: { label: "Ready", tint: "bg-success/12", dot: "bg-success" },
  SERVED: { label: "Served", tint: "bg-muted", dot: "bg-muted-foreground" },
  CANCELLED: { label: "Cancelled", tint: "bg-destructive/12", dot: "bg-destructive" },
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && Object.hasOwn(STATUS_STYLES, value);
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, tint, dot } = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs leading-none font-medium text-foreground",
        tint,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
