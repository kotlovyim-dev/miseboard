import { StatusBadge, isOrderStatus } from "@/components/status-badge";
import { formatCell } from "./cell-format";

export function TableCell({ columnKey, value }: { columnKey: string; value: unknown }) {
  if (columnKey === "status" && isOrderStatus(value)) return <StatusBadge status={value} />;
  return formatCell(value);
}
