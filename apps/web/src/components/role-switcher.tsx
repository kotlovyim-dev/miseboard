"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@miseboard/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetRoleMutation } from "@/lib/role/role-documents";
import { useRole } from "@/lib/role/use-role";

const ROLES: { role: Role; label: string }[] = [
  { role: "ADMIN", label: "Admin" },
  { role: "MANAGER", label: "Manager" },
  { role: "VIEWER", label: "Viewer" },
];

export function RoleSwitcher() {
  const { role } = useRole();
  const router = useRouter();
  const [setRole, { loading }] = useMutation(SetRoleMutation);

  const handleChange = async (next: string) => {
    const choice = ROLES.find((candidate) => candidate.role === next);
    if (!choice) return;
    try {
      await setRole({ variables: { role: choice.role } });
      router.refresh();
    } catch {
      toast.error("Couldn't switch the role. Try again.");
    }
  };

  return (
    <Select value={role} onValueChange={handleChange} disabled={loading}>
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
