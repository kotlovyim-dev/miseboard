"use client";

import { useContext } from "react";
import { RoleContext } from "./role-context";

export function useRole() {
  const role = useContext(RoleContext);
  return { role, canEdit: role === "ADMIN", canMutate: role !== "VIEWER" };
}
