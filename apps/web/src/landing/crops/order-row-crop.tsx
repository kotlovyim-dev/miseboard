import { StatusBadge, type OrderStatus } from "@/components/status-badge";
import { formatStatValue } from "@/widgets/stat/format-stat";

interface OrderRowCropProps {
  time: string;
  status: OrderStatus;
  total: number;
  children?: React.ReactNode;
}

export function OrderRowCrop({ time, status, total, children }: OrderRowCropProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 text-sm">
      <span className="tabular-nums">{time}</span>
      <StatusBadge status={status} />
      <span className="ml-auto tabular-nums">{formatStatValue(total, "uah")}</span>
      {children}
    </div>
  );
}
