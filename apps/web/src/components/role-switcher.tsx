"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/lib/role/use-role";
import { ROLES } from "@/lib/role/roles";
import { useSwitchRole } from "@/lib/role/use-switch-role";

export function RoleSwitcher() {
  const { role } = useRole();
  const { switchRole, isSwitching } = useSwitchRole();

  const handleChange = (next: string) => {
    const choice = ROLES.find((candidate) => candidate.role === next);
    if (choice) switchRole(choice.role);
  };

  return (
    <Select value={role} onValueChange={handleChange} disabled={isSwitching}>
      <SelectTrigger size="sm" aria-label="Role" className="min-w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {ROLES.map(({ role: value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
