import { roles } from "../context";
import type { Role } from "../context";
import { builder } from "./builder";
import "./venue";
import "./menu-item";
import "./inventory-item";
import "./order-connection";
import "./update-order-status";
import "./adjust-inventory";
import "./revenue-point";

const RoleEnum = builder.enumType("Role", { values: roles });

const Viewer = builder.objectRef<{ role: Role }>("Viewer");

Viewer.implement({
  fields: (t) => ({
    role: t.field({ type: RoleEnum, resolve: (viewer) => viewer.role }),
  }),
});

builder.queryType({
  fields: (t) => ({
    viewer: t.field({
      type: Viewer,
      resolve: (_root, _args, context) => ({ role: context.role }),
    }),
  }),
});

builder.mutationType({});

export const schema = builder.toSchema();
