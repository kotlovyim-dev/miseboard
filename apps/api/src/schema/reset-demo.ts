import { resetDemo } from "@miseboard/db";
import { builder } from "./builder";

builder.mutationFields((t) => ({
  resetDemo: t.boolean({
    authScopes: { admin: true },
    resolve: async (_root, _args, context) => {
      await resetDemo(context.db, new Date());
      return true;
    },
  }),
}));
