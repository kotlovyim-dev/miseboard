"use client";

import { StatusBadge } from "@/components/status-badge";
import { useStatusCycle } from "../hero/use-status-cycle";
import { CropFrame } from "./crop-frame";

const TABS = ["Pass", "Expo"];

export function TwoTabsCrop() {
  const status = useStatusCycle();

  return (
    <div className="grid grid-cols-2 gap-3">
      {TABS.map((name) => (
        <CropFrame key={name} className="bg-surface p-3">
          <p className="mb-3 text-sm text-muted-foreground">{name}</p>
          <div className="flex items-center justify-between gap-2 bg-card px-3 py-2 text-sm">
            <span className="tabular-nums">15:41</span>
            <StatusBadge status={status} />
          </div>
        </CropFrame>
      ))}
    </div>
  );
}
