import { builder } from "./builder";
import { Viewer } from "./viewer";
import "./venue";
import "./menu-item";
import "./inventory-item";
import "./order-connection";
import "./update-order-status";
import "./adjust-inventory";
import "./order-updated";
import "./update-menu-item";
import "./revenue-point";
import "./app";
import "./create-app";
import "./save-app";
import "./delete-app";
import "./reset-demo";
import "./set-role";

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
