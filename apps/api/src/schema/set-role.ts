import { builder } from "./builder";
import { RoleEnum, Viewer } from "./viewer";

builder.mutationFields((t) => ({
  setRole: t.field({
    type: Viewer,
    args: { role: t.arg({ type: RoleEnum, required: true }) },
    resolve: async (_root, args, context) => {
      await context.storeRole(args.role);
      return { role: args.role };
    },
  }),
}));
