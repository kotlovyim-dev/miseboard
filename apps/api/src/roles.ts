export const roles = ["ADMIN", "MANAGER", "VIEWER"] as const;

export type Role = (typeof roles)[number];

export const DEFAULT_ROLE: Role = "ADMIN";
