import { resetDemo } from "@miseboard/db";
import { builder } from "./builder";

builder.mutationFields((t) => ({
  resetDemo: t.boolean({
    resolve: async (_root, _args, context) => {
      await resetDemo(context.db, new Date());
      return true;
    },
  }),
}));
