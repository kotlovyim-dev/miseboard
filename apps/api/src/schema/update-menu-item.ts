import { notFound } from "../errors";
import { updateMenuItem } from "../repositories/menu-items";
import { builder } from "./builder";
import { MenuItem } from "./menu-item";

const UpdateMenuItemInput = builder.inputType("UpdateMenuItemInput", {
  fields: (t) => ({
    id: t.globalID({ required: true, for: MenuItem }),
    name: t.string({ validate: { minLength: 1 } }),
    price: t.int({ validate: { min: 0 } }),
    isActive: t.boolean(),
  }),
});

builder.mutationFields((t) => ({
  updateMenuItem: t.field({
    type: MenuItem,
    args: { input: t.arg({ type: UpdateMenuItemInput, required: true }) },
    resolve: async (_root, { input }, context) => {
      const patch = {
        name: input.name ?? undefined,
        priceKopecks: input.price ?? undefined,
        isActive: input.isActive ?? undefined,
      };
      const menuItem = await updateMenuItem(context.db, input.id.id, patch);
      if (!menuItem) throw notFound("Menu item not found");
      return menuItem;
    },
  }),
}));
