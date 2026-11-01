import type { Context } from "../context";
import { findMenuItemsByIds, listMenuItems } from "../repositories/menu-items";
import { builder } from "./builder";

export const MenuItem = builder.loadableNode("MenuItem", {
  id: { resolve: (menuItem) => menuItem.id },
  load: (ids: string[], context: Context) => findMenuItemsByIds(context.db, ids),
  sort: (menuItem) => menuItem.id,
  fields: (t) => ({
    name: t.exposeString("name"),
    category: t.exposeString("category"),
    price: t.exposeInt("priceKopecks"),
    isActive: t.exposeBoolean("isActive"),
  }),
});

builder.queryFields((t) => ({
  menuItems: t.field({
    type: [MenuItem],
    args: { category: t.arg.string() },
    resolve: (_root, args, context) => listMenuItems(context.db, args.category ?? undefined),
  }),
}));
