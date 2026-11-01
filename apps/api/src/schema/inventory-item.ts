import type { Context } from "../context";
import { findInventoryItemsByIds, listInventoryItems } from "../repositories/inventory";
import { builder } from "./builder";
import { Venue } from "./venue";

export const InventoryItem = builder.loadableNode("InventoryItem", {
  id: { resolve: (item) => item.id },
  load: (ids: string[], context: Context) => findInventoryItemsByIds(context.db, ids),
  sort: (item) => item.id,
  fields: (t) => ({
    venue: t.field({ type: Venue, resolve: (item) => item.venueId }),
    name: t.exposeString("name"),
    unit: t.exposeString("unit"),
    qty: t.exposeFloat("qty"),
    minQty: t.exposeFloat("minQty"),
    isLow: t.boolean({ resolve: (item) => item.qty < item.minQty }),
  }),
});

builder.objectField(Venue, "inventory", (t) =>
  t.field({
    type: [InventoryItem],
    args: { lowStockOnly: t.arg.boolean({ defaultValue: false }) },
    resolve: (venue, args, context) =>
      listInventoryItems(context.db, venue.id, args.lowStockOnly ?? false),
  }),
);
