import { roles } from "../roles";
import type { Role } from "../roles";
import { builder } from "./builder";

export const RoleEnum = builder.enumType("Role", { values: roles });

export const Viewer = builder.objectRef<{ role: Role }>("Viewer");

Viewer.implement({
  fields: (t) => ({
    role: t.field({ type: RoleEnum, resolve: (viewer) => viewer.role }),
  }),
});
