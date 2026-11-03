import { Button } from "@/components/ui/button";
import { CropFrame } from "./crop-frame";
import { OrderRowCrop } from "./order-row-crop";

export function UndoCrop() {
  return (
    <CropFrame className="space-y-3 bg-surface p-4">
      <div className="bg-card">
        <OrderRowCrop time="15:17" status="READY" total={49000}>
          <Button size="sm" variant="secondary" tabIndex={-1}>
            Mark ready
          </Button>
        </OrderRowCrop>
      </div>
      <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-popover px-4 py-3 text-sm text-popover-foreground landing-float">
        <span>Order marked READY</span>
        <Button size="xs" variant="outline" tabIndex={-1}>
          Undo
        </Button>
      </div>
    </CropFrame>
  );
}
