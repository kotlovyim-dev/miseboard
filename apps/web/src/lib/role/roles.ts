import type { Role } from "@miseboard/schema";

export const ROLES: { role: Role; label: string }[] = [
  { role: "ADMIN", label: "Admin" },
  { role: "MANAGER", label: "Manager" },
  { role: "VIEWER", label: "Viewer" },
];
