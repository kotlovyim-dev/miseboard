import { badInput, notFound } from "../errors";
import { adjustInventoryQty, findInventoryItemsByIds } from "../repositories/inventory";
import type { Context } from "../context";
import { builder } from "./builder";
import { InventoryItem } from "./inventory-item";

builder.mutationFields((t) => ({
  adjustInventory: t.field({
    type: InventoryItem,
    authScopes: { manager: true },
    args: {
      id: t.arg.globalID({ required: true, for: InventoryItem }),
      delta: t.arg.float({ required: true }),
    },
    resolve: async (_root, args, context) => {
      const { id } = args.id;
      const item = await adjustInventoryQty(context.db, id, args.delta);
      return item ?? throwMissingOrInsufficient(context, id);
    },
  }),
}));

async function throwMissingOrInsufficient(context: Context, id: string): Promise<never> {
  const [existing] = await findInventoryItemsByIds(context.db, [id]);
  if (!existing) throw notFound("Inventory item not found");
  throw badInput("Stock cannot go below zero");
}
