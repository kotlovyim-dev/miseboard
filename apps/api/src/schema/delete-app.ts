import { encodeGlobalID } from "@pothos/plugin-relay";
import { forbidden, notFound } from "../errors";
import { deleteUserApp, findAppsByIds } from "../repositories/apps";
import type { Context } from "../context";
import { App } from "./app";
import { builder } from "./builder";

builder.mutationFields((t) => ({
  deleteApp: t.field({
    type: "ID",
    args: { id: t.arg.globalID({ required: true, for: App }) },
    resolve: async (_root, args, context) => {
      const { id } = args.id;
      const deleted = await deleteUserApp(context.db, id);
      if (!deleted) return throwMissingOrTemplate(context, id);
      return encodeGlobalID("App", id);
    },
  }),
}));

async function throwMissingOrTemplate(context: Context, id: string): Promise<never> {
  const [existing] = await findAppsByIds(context.db, [id]);
  if (!existing) throw notFound("App not found");
  throw forbidden("The template cannot be deleted");
}
