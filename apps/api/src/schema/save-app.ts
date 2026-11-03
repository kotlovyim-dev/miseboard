import { parseAppConfig } from "@miseboard/config";
import type { App as AppRow } from "@miseboard/db";
import type { Context } from "../context";
import { badInput, forbidden, notFound } from "../errors";
import { findAppsByIds, updateAppConfig } from "../repositories/apps";
import { App } from "./app";
import { builder } from "./builder";

interface VersionConflictShape {
  message: string;
  latest: AppRow;
}

const VersionConflict = builder.objectRef<VersionConflictShape>("VersionConflict");

VersionConflict.implement({
  fields: (t) => ({
    message: t.exposeString("message"),
    latest: t.field({ type: App, resolve: (conflict) => conflict.latest }),
  }),
});

const SaveAppResult = builder.unionType("SaveAppResult", {
  types: [App, VersionConflict],
  resolveType: (result) => ("latest" in result ? VersionConflict : App),
});

builder.mutationFields((t) => ({
  saveApp: t.field({
    type: SaveAppResult,
    authScopes: { admin: true },
    args: {
      id: t.arg.globalID({ required: true, for: App }),
      config: t.arg({ type: "JSON", required: true }),
      expectedUpdatedAt: t.arg({ type: "DateTime", required: true }),
    },
    resolve: async (_root, args, context) => {
      const parsed = parseAppConfig(args.config);
      if (!parsed.ok) throw badInput(parsed.message);
      const { id } = args.id;
      const saved = await updateAppConfig(context.db, id, parsed.config, args.expectedUpdatedAt);
      return saved ?? explainRejectedSave(context, id);
    },
  }),
}));

async function explainRejectedSave(context: Context, id: string): Promise<VersionConflictShape> {
  const [latest] = await findAppsByIds(context.db, [id]);
  if (!latest) throw notFound("App not found");
  if (latest.isTemplate) throw forbidden("The template cannot be changed");
  return { message: "The app was changed by someone else", latest };
}
