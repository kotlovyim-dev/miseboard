import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/role/roles";
import { CropFrame } from "./crop-frame";

const SELECTED_ROLE = "MANAGER";

export function RoleMenuCrop() {
  return (
    <CropFrame className="bg-surface p-6 md:p-10">
      <div className="flex h-14 items-center justify-between rounded-md border border-input bg-card px-4 text-lg">
        Manager
        <ChevronDown aria-hidden className="size-5 opacity-50" />
      </div>
      <ul className="mt-2 rounded-md border border-border bg-popover p-1.5 text-lg landing-float">
        {ROLES.map(({ role, label }) => (
          <li
            key={role}
            className={cn(
              "flex h-14 items-center justify-between rounded-sm px-3",
              role === SELECTED_ROLE && "bg-accent text-accent-foreground",
            )}
          >
            {label}
            {role === SELECTED_ROLE && <Check aria-hidden className="size-5" />}
          </li>
        ))}
      </ul>
    </CropFrame>
  );
}
